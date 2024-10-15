'use client';

import { Container, Box, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import Vapi from "@vapi-ai/web";
import Orb from './Orb';
import { isConversationUpdate } from '../types/conversation'
import { Retroboard, getEmptyRetroboard, isRetroboard, getSampleRetroboard } from '../types/retroboard'
import RenderedRetroboard from './RenderedRetroboard';
const vapi = new Vapi("5903c1e9-194f-4d25-8fa9-5f242f5cc775");

function shouldAnalyzeConversation(message: any): boolean {
  if (!isConversationUpdate(message)) {
    return false;
  }
  if (message.conversation.length === 0) {
    return false;
  }

  const lastMessage = message.conversation[message.conversation.length - 1];
  if (!lastMessage.role.toLowerCase().startsWith("user")) {
    return false;
  }

  return true;
}

async function fetchAnalyzeConversation(message: any, currentRetroboard: Retroboard): Promise<Retroboard> {  

  message.messages = [];
  message.messagesOpenAIFormatted = [];

  const response = await fetch('/api/ConversationAnalyzer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
      retroboard: currentRetroboard,
    }),
  });

  const data = await response.json();

  if (isRetroboard(data.retroboard)) {
    return data.retroboard;
  } else {
    console.error("Invalid retroboard object");
    return currentRetroboard;
  }
}

export default function Retro() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVapiEnabled, setIsVapiEnabled] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const [retroboard, setRetroboard] = useState<Retroboard>(getEmptyRetroboard());

  const volumeLevelRef = useRef(0);
  const targetVolumeRef = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    console.log("Vapi started");
    vapi.start('a0e47d57-4db1-4d19-b99e-a27920881da2');

    vapi.on('speech-start', () => {
      console.log("speech-start");
      setIsSpeaking(true);
    });

    vapi.on('message', (message) => {
      if(shouldAnalyzeConversation(message)) {
        fetchAnalyzeConversation(message, retroboard).then((newRetroboard) => {
          console.log("newRetroboard", newRetroboard);
          setRetroboard(newRetroboard);
        });
      }
    });

    vapi.on('speech-end', () => {
      console.log("speech-end");
      setIsSpeaking(false);
      targetVolumeRef.current = 0;
      animateVolumeLevel(); // Continue animating to fade out smoothly
    });

    vapi.on("volume-level", (volume) => {
      targetVolumeRef.current = volume;
      animateVolumeLevel();
    });

    vapi.on('call-end', () => {
      console.log("call-end");
      setIsSpeaking(false);
      targetVolumeRef.current = 0;
      animateVolumeLevel(); // Continue animating to fade out smoothly
      setIsVapiEnabled(false);
    });

    return () => {
      // Clean up the animation frame when component unmounts
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const animateVolumeLevel = () => {
    if (animationFrameRef.current) return; // Prevent multiple animation loops

    const animate = () => {
      const currentVolume = volumeLevelRef.current;
      const targetVolume = targetVolumeRef.current;
      const delta = targetVolume - currentVolume;
      const smoothingFactor = 0.1; // Smaller value for more smoothing

      if (Math.abs(delta) > 0.001) {
        const newVolume = currentVolume + delta * smoothingFactor;
        volumeLevelRef.current = newVolume;
        setVolumeLevel(newVolume);
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        volumeLevelRef.current = targetVolume;
        setVolumeLevel(targetVolume);
        animationFrameRef.current = undefined;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleOrbClick = () => {
    if (isVapiEnabled) {
      console.log("Vapi stopped");
      vapi.stop();
    } else {
      console.log("Vapi restarted");
      vapi.start('a0e47d57-4db1-4d19-b99e-a27920881da2');
    }
    setIsVapiEnabled(!isVapiEnabled);
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        background: 'linear-gradient(45deg, #FFDEE9, #B5FFFC, #FFDEE9, #B5FFFC)',
        backgroundSize: '400% 400%',
        animation: '15s ease infinite',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box component="main" sx={{ textAlign: 'center', position: 'relative' }}>
        <Typography variant="h1" sx={{ color: '#333333' }}>
          Sprint Retrospective
        </Typography>
        <Orb
          isSpeaking={isSpeaking}
          isVapiEnabled={isVapiEnabled}
          volumeLevel={volumeLevel}
          handleOrbClick={handleOrbClick}
        />
        {!isVapiEnabled && (
          <Typography
            variant="h6"
            sx={{ color: '#333333', mt: 2, cursor: 'pointer' }}
            onClick={handleOrbClick}
          >
            Click to restart
          </Typography>
        )}
        <RenderedRetroboard retroboard={retroboard} />
      </Box>
    </Container>
  );
}

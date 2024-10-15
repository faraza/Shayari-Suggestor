'use client';

import { Container, Box, Typography, Button } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useRouter } from 'next/navigation';

// Background animation similar to Retro
const diamondBackgroundAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function Home() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/retro');
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        background: 'linear-gradient(45deg, #1fa2ff, #12d8fa, #a6ffcb)',
        backgroundSize: '400% 400%',
        animation: `${diamondBackgroundAnimation} 15s ease infinite`,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box component="main" sx={{ textAlign: 'center', position: 'relative' }}>
        <Typography variant="h1" sx={{ color: '#FFFFFF', mb: 4 }}>
          Welcome to Scrum Master AI
        </Typography>
        <Button
          variant="contained"
          sx={{
            width: '200px',
            height: '60px',
            borderRadius: '30px',
            fontSize: '1.25rem',
            background: 'linear-gradient(45deg, #FFFFFF 0%, #CCCCCC 100%)',
            color: '#333333',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(45deg, #F0F0F0 0%, #BBBBBB 100%)',
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            },
          }}
          onClick={handleButtonClick}
        >
          Start Retro
        </Button>
      </Box>
    </Container>
  );
}

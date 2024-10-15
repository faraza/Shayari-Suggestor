import { Box } from '@mui/material';

interface OrbProps {
  isSpeaking: boolean;
  isVapiEnabled: boolean;
  volumeLevel: number;
  handleOrbClick: () => void;
}

const Orb = ({ isSpeaking, isVapiEnabled, volumeLevel, handleOrbClick }: OrbProps) => (
  <Box
    onClick={handleOrbClick}
    sx={{
      position: 'relative',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      backgroundColor: isVapiEnabled ? '#FF6666' : '#000000',
      margin: '0 auto',
      cursor: 'pointer',
      overflow: 'visible',
      transition: 'background-color 0.5s ease',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '-12.5%',
        left: '-12.5%',
        width: '125%',
        height: '125%',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 102, 102, 1)',
        opacity: isSpeaking && isVapiEnabled ? volumeLevel : 0,
        transform: `scale(${1 + volumeLevel})`,
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        pointerEvents: 'none',
      },
    }}
  />
);

export default Orb;
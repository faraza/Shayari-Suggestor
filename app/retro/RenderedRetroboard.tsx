import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Divider } from '@mui/material';
import { Retroboard } from '../types/retroboard';

interface RenderedRetroboardProps {
  retroboard: Retroboard;
}

const pastelColors = ['#FFDEE9', '#C6FFDD', '#FFFCB6', '#FFABAB', '#AFCBFF', '#E0BBE4']; // Different pastel shades for cards
const darkerPastelColors = ['#FFC4D6', '#A1E7C0', '#FFEB8A', '#FF8888', '#89BFFF', '#C69BD9']; // Slightly darker pastels for sections

const RenderedRetroboard: React.FC<RenderedRetroboardProps> = ({ retroboard }) => {
    if (!retroboard || !retroboard.users || retroboard.users.length === 0) {
        return(<></>)
    }
  
    return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid container spacing={3}>
        {retroboard.users.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ backgroundColor: pastelColors[index % pastelColors.length], boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#333' }} gutterBottom>
                  {user.name}
                </Typography>
                
                <Divider sx={{ marginY: 2 }} />

                <Box mb={3} sx={{ backgroundColor: darkerPastelColors[index % darkerPastelColors.length], padding: 2, borderRadius: 2 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                    What Went Well
                  </Typography>
                  <Box sx={{ marginLeft: 2, marginTop: 1 }}>
                    {user.whatWentWell.map((item, idx) => (
                      <Typography variant="body1" key={idx} sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                        • {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
                
                <Divider sx={{ marginY: 2 }} />

                <Box mb={3} sx={{ backgroundColor: darkerPastelColors[index % darkerPastelColors.length], padding: 2, borderRadius: 2 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                    What Went Wrong
                  </Typography>
                  <Box sx={{ marginLeft: 2, marginTop: 1 }}>
                    {user.whatWentWrong.map((item, idx) => (
                      <Typography variant="body1" key={idx} sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                        • {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ marginY: 2 }} />

                <Box mb={3} sx={{ backgroundColor: darkerPastelColors[index % darkerPastelColors.length], padding: 2, borderRadius: 2 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                    What To Improve
                  </Typography>
                  <Box sx={{ marginLeft: 2, marginTop: 1 }}>
                    {user.whatToImprove.map((item, idx) => (
                      <Typography variant="body1" key={idx} sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                        • {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ marginY: 2 }} />

                <Box mb={3} sx={{ backgroundColor: darkerPastelColors[index % darkerPastelColors.length], padding: 2, borderRadius: 2 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Action Items
                  </Typography>
                  <Box sx={{ marginLeft: 2, marginTop: 1 }}>
                    {user.actionItems.map((item, idx) => (
                      <Typography variant="body1" key={idx} sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                        • {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RenderedRetroboard;

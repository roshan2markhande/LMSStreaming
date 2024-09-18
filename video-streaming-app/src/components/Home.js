// src/components/Home.js
import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

const Home = () => {
  const navigate = useNavigate();

  const startMeeting = () => {
    const roomId = uuidV4();
    navigate(`/room/${roomId}`);
  };

  return (
    <Container maxWidth="md" style={{ textAlign: 'center', paddingTop: '50px' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Video Streaming LMS
      </Typography>
      <Typography variant="h6" gutterBottom>
        Join live classes, collaborate with peers, and stay updated with your coursework.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" size="large" onClick={startMeeting}>
          Start a New Meeting
        </Button>
      </Box>
    </Container>
  );
};

export default Home;

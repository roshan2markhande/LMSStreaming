// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import VideoCallIcon from '@mui/icons-material/VideoCall';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Video Streaming LMS
        </Typography>
        <IconButton color="inherit" component={Link} to="/">
          <HomeIcon />
        </IconButton>
        <IconButton color="inherit" component={Link} to="/new-room">
          <VideoCallIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

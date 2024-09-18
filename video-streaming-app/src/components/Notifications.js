// src/components/Notifications.js
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const Notifications = ({ notifications }) => {
  return (
    <Box mt={2}>
      <Typography variant="h6">Notifications</Typography>
      <List style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f9f9f9' }}>
        {notifications.map((note, index) => (
          <ListItem key={index}>
            <ListItemText primary={note} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Notifications;

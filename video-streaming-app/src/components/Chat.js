// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Ensure this matches your backend URL

const Chat = ({ roomId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('receive-message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('send-message', message, roomId);
      setMessages((prev) => [...prev, `You: ${message}`]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="h6">Chat</Typography>
      <List style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f1f1f1' }}>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText primary={msg} />
          </ListItem>
        ))}
      </List>
      <Box display="flex" mt={1}>
        <TextField
          variant="outlined"
          label="Type a message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button variant="contained" color="primary" onClick={sendMessage} style={{ marginLeft: '10px' }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;

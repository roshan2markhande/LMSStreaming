// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');
const { v4: uuidV4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins; adjust in production
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());

// Set up PeerJS server
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use('/peerjs', peerServer);

// Serve static files (optional, for deployment)
app.use(express.static('public'));

// Endpoint to create a new room and redirect
app.get('/new-room', (req, res) => {
  res.redirect(`/room/${uuidV4()}`);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New Socket Connection:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);

    // Notify others in the room
    socket.to(roomId).emit('user-connected', userId);

    // Handle chat messages
    socket.on('send-message', (message) => {
      io.to(roomId).emit('receive-message', message);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
      console.log(`User ${userId} disconnected from room ${roomId}`);
    });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

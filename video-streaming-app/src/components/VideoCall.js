// src/components/VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Peer from 'peerjs';
import io from 'socket.io-client';
import { Box, Grid, Paper, Typography } from '@mui/material';
import VideoControls from './VideoControls';
import Chat from './Chat';
import ScreenShare from './ScreenShare';
import Notifications from './Notifications';

const socket = io('http://localhost:5000'); // Ensure this matches your backend URL

const VideoCall = () => {
  const { roomId } = useParams();
  const myVideoRef = useRef();
  const peersRef = useRef({});
  const [myPeer, setMyPeer] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const peer = new Peer(undefined, {
      path: '/peerjs',
      host: '/',
      port: '5000',
    });

    setMyPeer(peer);

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then(stream => {
      myVideoRef.current.srcObject = stream;
      myVideoRef.current.play();

      peer.on('open', userId => {
        socket.emit('join-room', roomId, userId);
      });

      peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream);
        });
      });

      socket.on('user-connected', userId => {
        connectToNewUser(userId, stream, peer);
        addNotification(`User ${userId} connected`);
      });

      socket.on('user-disconnected', userId => {
        if (peersRef.current[userId]) peersRef.current[userId].close();
        addNotification(`User ${userId} disconnected`);
      });
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      peer.destroy();
    };
  }, [roomId]);

  const connectToNewUser = (userId, stream, peer) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
      video.remove();
    });

    peersRef.current[userId] = call;
  };

  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    document.getElementById('video-grid').append(video);
  };

  const addNotification = (message) => {
    setNotifications(prev => [...prev, message]);
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Room ID: {roomId}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} style={{ padding: '10px', position: 'relative' }}>
            <div id="video-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <video ref={myVideoRef} muted style={{ width: '300px', borderRadius: '10px' }}></video>
              {/* Remote videos will be appended here */}
            </div>
            <VideoControls streamRef={myVideoRef} />
          </Paper>
          <ScreenShare peer={myPeer} roomId={roomId} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Chat roomId={roomId} />
          <Notifications notifications={notifications} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoCall;

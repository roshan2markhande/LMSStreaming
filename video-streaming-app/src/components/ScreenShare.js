// src/components/ScreenShare.js
import React, { useState } from 'react';
import { Button } from '@mui/material';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';

const ScreenShare = ({ peer, roomId }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);

  const toggleScreenShare = async () => {
    if (!isSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);

        // Replace video track in all peer connections
        Object.values(peer._connections).forEach(connections => {
          connections.forEach(connection => {
            const sender = connection.peerConnection.getSenders().find(s => s.track.kind === 'video');
            if (sender) {
              sender.replaceTrack(stream.getVideoTracks()[0]);
            }
          });
        });

        setIsSharing(true);
        stream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      } catch (error) {
        console.error('Error sharing the screen:', error);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setIsSharing(false);
      setScreenStream(null);

      // Restore original video tracks
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        Object.values(peer._connections).forEach(connections => {
          connections.forEach(connection => {
            const sender = connection.peerConnection.getSenders().find(s => s.track.kind === 'video');
            if (sender) {
              sender.replaceTrack(stream.getVideoTracks()[0]);
            }
          });
        });
      });
    }
  };

  return (
    <Button variant="contained" color="secondary" startIcon={<ScreenShareIcon />} onClick={toggleScreenShare} style={{ marginTop: '10px' }}>
      {isSharing ? 'Stop Sharing' : 'Share Screen'}
    </Button>
  );
};

export default ScreenShare;

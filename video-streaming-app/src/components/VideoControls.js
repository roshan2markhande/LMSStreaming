// src/components/VideoControls.js
import React, { useState } from 'react';
import { Button, ButtonGroup } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

const VideoControls = ({ streamRef }) => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const toggleMic = () => {
    streamRef.current.srcObject.getAudioTracks()[0].enabled = !micOn;
    setMicOn(!micOn);
  };

  const toggleCamera = () => {
    streamRef.current.srcObject.getVideoTracks()[0].enabled = !cameraOn;
    setCameraOn(!cameraOn);
  };

  return (
    <ButtonGroup variant="contained" color="primary" style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
      <Button onClick={toggleMic}>
        {micOn ? <MicIcon /> : <MicOffIcon />}
      </Button>
      <Button onClick={toggleCamera}>
        {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
      </Button>
    </ButtonGroup>
  );
};

export default VideoControls;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import VideoCall from './components/VideoCall';
import './App.css'; // Import any global styles

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<VideoCall />} />
      </Routes>
    </Router>
  );
};

export default App;

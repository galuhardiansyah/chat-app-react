import React from 'react';
import { Route, Routes, Navigate, useLocation  } from 'react-router-dom';
import Home from './components/Home';
import ChatRoom from './components/ChatRoom';

const App = () => {
  const location = useLocation();
  const username = new URLSearchParams(location.search).get('username') || 'JohnDoe';

  return (
    <div>
      <Routes>
        <Route path="/room/:roomId" element={<ChatRoom username={username} />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;

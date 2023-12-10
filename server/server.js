const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
const { saveMessage } = require('./controllers/messageController');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(bodyParser.json());
const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));

const conversationsRoutes = require('./routes/conversations');
const messageRoutes = require('./routes/message');

app.use('/api/conversations', conversationsRoutes);
app.use('/api/messages', messageRoutes);

const roomUsers = {};

const updateUserSocketId = (roomId, username, socketId) => {
  if (!roomUsers[roomId]) {
    roomUsers[roomId] = {};
  }

  roomUsers[roomId][username] = socketId;
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (data) => {
    const { roomId, username } = data;
    socket.join(roomId);

    updateUserSocketId(roomId, username, socket.id);

    const room = io.sockets.adapter.rooms[roomId];
    if (room && room.length > 0) {
      console.log(`Room ${roomId} exists with ${room.length} socket(s).`);
    } else {
      console.log(`Room ${roomId} does not exist or is empty.`);
    }

    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('sendMessage', async (data) => {
    const { roomId, message } = data;
    const { sender, content } = message

    try {
      await saveMessage(roomId, sender, content);
      io.to(roomId).emit('receiveMessage', message);
    } catch (error) {
      console.error('Error broadcasting message:', error);
    }
  });

  socket.on('leaveRoom', ({ roomId, username }) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


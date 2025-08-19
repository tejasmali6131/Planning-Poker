require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const setupSocket = require('./socket');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/api', gameRoutes);

setupSocket(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
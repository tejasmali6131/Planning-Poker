require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const setupSocket = require('./socket');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost", "http://172.18.161.201"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', gameRoutes);

// Serve static files from React app build
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Don't handle API routes or socket.io routes
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  // Serve the React app for all other routes
  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).json({ error: 'Unable to serve frontend' });
    }
  });
});

setupSocket(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend served at: http://localhost:${PORT}`);
  console.log(`🔌 Backend API at: http://localhost:${PORT}/api`);
});
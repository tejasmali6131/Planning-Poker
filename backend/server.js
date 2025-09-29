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
    origin: [
      "http://localhost:3000", 
      "http://localhost:4000", 
      "https://ngth2fs5-4000.asse.devtunnels.ms"
    ],
    methods: ["GET", "POST"],
    credentials: false
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
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📱 Local access: http://localhost:${PORT}`);
  console.log(`🌐 Public access: https://ngth2fs5-4000.asse.devtunnels.ms`);
  console.log(`🔌 Backend API: http://localhost:${PORT}/api`);
});
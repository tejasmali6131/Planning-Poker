# KONE Planning Poker

A real-time collaborative Planning Poker application for Agile teams to estimate story points effectively. Built with React.js frontend and Node.js backend with Socket.io for real-time communication.

## Features

- **Real-time Collaboration**: Multiple players can join and vote simultaneously
- **Cross-device Support**: Works seamlessly across desktop and mobile devices
- **Shareable Game Links**: Generate shareable links for remote team participation
- **Health Monitoring**: Built-in health checks and monitoring endpoints
- **Dockerized Deployment**: Easy deployment with Docker containers

## Prerequisites

- Node.js 18+ 
- npm
- Docker (for containerized deployment)

## Quick Start

### Development Mode

1. **Clone and install dependencies**
   ```bash
   git clone https://gitlab.com/konecorporation/rnd-internal/scrum-tools/kone-planning-poker
   cd planning-poker
   npm run install:all
   ```

2. **Start development servers**
   ```bash
   # Start both frontend and backend concurrently
   npm run start:dev
   ```
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

### Production Mode

1. **Build and start**
   ```bash
   # Build frontend and start backend
   npm start
   ```
   - Application: http://localhost:4000

## Docker Deployment

### Quick Docker Commands

```bash
# Build Docker image
npm run docker:build

# Run container (detached mode with auto-restart)
npm run docker:run

# View logs
npm run docker:logs

# Stop container
npm run docker:stop

# Remove container
npm run docker:remove

# Clean up Docker resources
npm run docker:clean
```

### Manual Docker Commands

```bash
# Build image
docker build -t planning-poker .

# Run container
docker run -d \
  --name planning-poker-app \
  -p 4000:4000 \
  --restart unless-stopped \
  planning-poker

# View running containers
docker ps

# Stop and remove
docker stop planning-poker-app
docker rm planning-poker-app
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/network-info` - Get network and tunnel information
- `POST /api/create-game` - Create a new game session
- `GET /api/game/:gameId` - Get game information
- `POST /api/update-tunnel` - Update tunnel URL for cross-device access

## Deployment Tips

1. **Environment Variables**:
   - `PORT` - Server port (default: 4000)
   - `NODE_ENV` - Environment mode (production/development)
   - `DEV_TUNNEL_URL` - VS Code dev tunnel URL for cross-device access

2. **Cross-device Access**:
   - Use VS Code dev tunnels or ngrok for external access
   - Update tunnel URL via `/api/update-tunnel` endpoint

3. **Production Considerations**:
   - Application runs as non-root user in Docker for security
   - Health checks configured for container orchestration
   - Static frontend files served by Express server


**Happy Planning!**
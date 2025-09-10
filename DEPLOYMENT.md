# Planning Poker Pro - Deployment Guide

## 🚀 Quick Start (Docker Hub)

### Method 1: Direct Docker Run
```bash
# Stop any existing container
docker stop planning-poker-pro 2>/dev/null || true
docker rm planning-poker-pro 2>/dev/null || true

# Run the latest version
docker run -d -p 80:80 --name planning-poker-pro your-dockerhub-username/planning-poker-pro:latest
```

### Method 2: Using Docker Compose
1. Download `docker-compose.prod.yml`
2. Run:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 💾 Alternative: Load from File

If you received a `.tar` file:
```bash
# Stop any existing container
docker stop planning-poker-pro 2>/dev/null || true
docker rm planning-poker-pro 2>/dev/null || true

# Load the image
docker load < planning-poker-pro.tar

# Verify the image loaded correctly
docker images | grep planning-poker-pro

# Run the container (recommended: use root user to avoid nginx permissions)
docker run -d -p 80:80 --user root --name planning-poker-pro planning-poker-pro:latest
```

## 🚨 Troubleshooting nginx Permission Issues

If you see nginx permission errors, use the rootless version:
```bash
# Stop the container
docker stop planning-poker-pro
docker rm planning-poker-pro

# Method 1: Use rootless startup script (port 8080)
docker run -d -p 8080:8080 --name planning-poker-pro --entrypoint /app/start-rootless.sh planning-poker-pro:latest

# Method 2: Run with privileged mode (port 80)
docker run -d -p 80:80 --privileged --name planning-poker-pro planning-poker-pro:latest

# Method 3: Run as root user
docker run -d -p 80:80 --user root --name planning-poker-pro planning-poker-pro:latest
```

**Access the application:**
- **Method 1**: `http://localhost:8080` or `http://[YOUR-IP]:8080`
- **Method 2 & 3**: `http://localhost` or `http://[YOUR-IP]`

## 🌐 Access the Application

After starting the container, access the application at:
- **Local**: `http://localhost`
- **Network**: `http://[YOUR-IP-ADDRESS]`

## 🔧 Management Commands

```bash
# Check status
docker ps

# View logs
docker logs planning-poker-pro

# Stop
docker stop planning-poker-pro

# Start
docker start planning-poker-pro

# Remove
docker rm planning-poker-pro

# Update (if using Docker Hub)
docker pull your-dockerhub-username/planning-poker-pro:latest
docker stop planning-poker-pro
docker rm planning-poker-pro
docker run -d -p 80:80 --name planning-poker-pro your-dockerhub-username/planning-poker-pro:latest
```

## 📋 Requirements

- Docker installed on the target machine
- Port 80 available (or change port mapping: `-p 8080:80`)

## 🎯 Features

- ✅ Single container with both frontend and backend
- ✅ Nginx reverse proxy
- ✅ Real-time Socket.io communication
- ✅ Optimized multi-stage build
- ✅ Health checks included

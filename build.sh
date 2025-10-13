#!/bin/bash
echo "🔧 Building Planning Poker for Render..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd frontend && npm install

# Build frontend
echo "🏗️ Building frontend..."
npm run build
cd ..

echo "✅ Build complete! Ready for Render."
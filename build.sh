#!/bin/bash
echo "🔧 Building Planning Poker for Render..."

# Install all dependencies
echo "📦 Installing dependencies..."
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Build frontend
echo "🏗️ Building frontend..."
cd frontend && npm run build && cd ..

echo "✅ Build complete! Ready for Render."
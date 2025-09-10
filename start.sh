#!/bin/sh

echo "Starting Planning Poker Pro..."

# Handle shutdown signals
shutdown() {
    echo "Shutting down..."
    kill $nginx_pid 2>/dev/null
    exit 0
}

trap shutdown SIGTERM SIGINT

# Test nginx configuration first
echo "Testing nginx configuration..."
nginx -t

# Start nginx as root in background
echo "Starting nginx as root..."
nginx -g "daemon off;" &
nginx_pid=$!

# Wait a moment and check if nginx started successfully
sleep 2
if ! kill -0 $nginx_pid 2>/dev/null; then
    echo "ERROR: nginx failed to start"
    exit 1
fi

echo "✅ nginx started successfully on port 80"

# Start backend as nodejs user
echo "Starting backend as nodejs user on port 4000..."
cd /app/backend

# Use exec to replace the shell process so signals are handled properly
exec su-exec nodejs:nodejs node server.js

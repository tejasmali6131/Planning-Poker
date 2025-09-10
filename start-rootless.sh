#!/bin/sh

echo "Starting Planning Poker Pro..."

# Create nginx directories with proper permissions
mkdir -p /tmp/nginx/logs /tmp/nginx/cache /tmp/nginx/run
chown -R $(id -u):$(id -g) /tmp/nginx

# Create a custom nginx config that doesn't require root
cat > /tmp/nginx.conf << 'EOF'
daemon off;
worker_processes 1;
pid /tmp/nginx/run/nginx.pid;
error_log /tmp/nginx/logs/error.log;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    access_log /tmp/nginx/logs/access.log;
    client_body_temp_path /tmp/nginx/cache/client_temp;
    proxy_temp_path /tmp/nginx/cache/proxy_temp;
    fastcgi_temp_path /tmp/nginx/cache/fastcgi_temp;
    uwsgi_temp_path /tmp/nginx/cache/uwsgi_temp;
    scgi_temp_path /tmp/nginx/cache/scgi_temp;
    
    upstream backend {
        server localhost:4000;
    }
    
    server {
        listen 8080;
        server_name localhost;
        
        location / {
            root /app/frontend/build;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
        
        location /api/ {
            proxy_pass http://backend/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
        
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

# Start nginx as non-root user
echo "Starting nginx on port 8080..."
nginx -c /tmp/nginx.conf &
nginx_pid=$!

# Wait and check if nginx started
sleep 2
if ! kill -0 $nginx_pid 2>/dev/null; then
    echo "ERROR: nginx failed to start"
    exit 1
fi

echo "✅ nginx started successfully on port 8080"

# Start backend
echo "Starting backend on port 4000..."
cd /app/backend
exec node server.js

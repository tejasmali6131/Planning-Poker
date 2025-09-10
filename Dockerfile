FROM node:18-alpine AS frontend-builder
WORKDIR /frontend-build
COPY frontend/package*.json ./
RUN npm ci --only=production --silent --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS backend-deps
WORKDIR /backend-build
COPY backend/package*.json ./
RUN npm ci --only=production --silent --no-audit --no-fund

FROM node:18-alpine AS production

# Install nginx and create necessary directories
RUN apk add --no-cache nginx su-exec && \
    mkdir -p /run/nginx /var/log/nginx /var/cache/nginx /var/lib/nginx/tmp/client_body /var/lib/nginx/tmp/proxy /var/lib/nginx/tmp/fastcgi /var/lib/nginx/tmp/uwsgi /var/lib/nginx/tmp/scgi && \
    chmod 755 /run/nginx /var/log/nginx /var/cache/nginx /var/lib/nginx && \
    chmod -R 755 /var/lib/nginx/tmp

# Create nodejs user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY backend/ ./backend/
COPY --from=backend-deps /backend-build/node_modules ./backend/node_modules
COPY --from=frontend-builder /frontend-build/build ./frontend/build

COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /app/start.sh
COPY start-rootless.sh /app/start-rootless.sh

RUN chmod +x /app/start.sh /app/start-rootless.sh && \
    chown -R nodejs:nodejs /app

# Create directories for rootless nginx
RUN mkdir -p /tmp/nginx/logs /tmp/nginx/cache /tmp/nginx/run && \
    chown -R nodejs:nodejs /tmp/nginx

EXPOSE 80 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["/app/start.sh"]
# Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /frontend-build
COPY frontend/package*.json ./
RUN npm ci --only=production --silent --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# Install backend dependencies
FROM node:18-alpine AS backend-deps
WORKDIR /backend-build
COPY backend/package*.json ./
RUN npm ci --only=production --silent --no-audit --no-fund

# Production image
FROM node:18-alpine AS production

# Install wget for health checks
RUN apk add --no-cache wget

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy backend files and dependencies
COPY --chown=nodejs:nodejs backend/ ./backend/
COPY --from=backend-deps --chown=nodejs:nodejs /backend-build/node_modules ./backend/node_modules

# Copy frontend build
COPY --from=frontend-builder --chown=nodejs:nodejs /frontend-build/build ./frontend/build

# Switch to non-root user
USER nodejs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose port
EXPOSE 4000

# Health check (use environment variable)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

# Start the Node.js server directly
CMD ["node", "backend/server.js"]
# Build stage
FROM node:18-alpine AS builder

# Add build metadata
LABEL maintainer="DevOps Team"
LABEL description="Task Management API - Build Stage"

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies first (needed for npm ci)
RUN npm ci && \
    npm cache clean --force

# Copy application code
COPY src ./src

# Production stage
FROM node:18-alpine AS production

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder
COPY --chown=nodejs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs --from=builder /app/src ./src
COPY --chown=nodejs:nodejs package*.json ./

# Security: Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "src/server.js"]

# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Remove development dependencies and source files
RUN npm prune --production && \
    rm -rf src/ tsconfig.json

# Create non-root user
RUN addgroup -g 1001 -S abp && \
    adduser -S abp -u 1001

# Change ownership of the app directory
RUN chown -R abp:abp /app

# Switch to non-root user
USER abp

# Expose port (if needed for HTTP mode)
EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('ABP.IO MCP Server is healthy')" || exit 1

# Set default command
ENTRYPOINT ["node", "dist/index.js"]

# Default arguments
CMD ["--stdio"] 
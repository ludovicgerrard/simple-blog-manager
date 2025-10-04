# ============================
#  Base image
# ============================
FROM node:22.20.0-alpine AS base

# ============================
#  Dependencies stage
# ============================
FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

# ============================
#  Production dependencies
# ============================
FROM base AS production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# ============================
#  Build stage
# ============================
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build --ignore-ts-errors

# ============================
#  Final production image
# ============================
FROM base
ENV NODE_ENV=production
WORKDIR /app

# Copy node_modules and build output
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app

# Create tmp directory for SQLite database
RUN mkdir -p /app/tmp && chown -R node:node /app/tmp

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose AdonisJS port
EXPOSE 3333

# Set entrypoint (runs migrations + server)
ENTRYPOINT ["docker-entrypoint.sh"]

# Default command (still here as fallback)
CMD ["node", "./bin/server.js"]

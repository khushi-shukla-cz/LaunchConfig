# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared workspace first (needed for path aliases)
COPY shared/package.json ./shared/
COPY shared/src ./shared/src/

# Copy backend
COPY backend/package.json backend/tsconfig.json ./backend/
COPY backend/src ./backend/src/
COPY backend/prisma ./backend/prisma/

# Install all deps (including dev for build)
WORKDIR /app/backend
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript
RUN npm run build

# ── Stage 2: Production image ──────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/package.json ./package.json

# Copy config directory (mounted as volume in production)
COPY config /app/config

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Run migrations then start server
CMD ["dumb-init", "sh", "-c", "npx prisma migrate deploy && node dist/index.js"]

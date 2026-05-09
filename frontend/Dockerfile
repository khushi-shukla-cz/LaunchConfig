# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared
COPY shared/package.json ./shared/
COPY shared/src ./shared/src/

# Copy frontend
COPY frontend/package.json frontend/tsconfig.json frontend/next.config.js ./frontend/
COPY frontend/tailwind.config.js frontend/postcss.config.js* ./frontend/
COPY frontend/src ./frontend/src/
COPY frontend/public* ./frontend/public/

WORKDIR /app/frontend
RUN npm install

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ── Stage 2: Production image ──────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./.next/static
COPY --from=builder /app/frontend/public ./public

EXPOSE 3000

CMD ["dumb-init", "node", "server.js"]

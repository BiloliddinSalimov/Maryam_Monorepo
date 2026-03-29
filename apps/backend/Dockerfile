# ─── Build stage ──────────────────────────────────────────────────────────────
FROM oven/bun:1.2-alpine AS base

WORKDIR /app

# Dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Prisma schema
COPY prisma ./prisma

# Source code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# ─── Production stage ─────────────────────────────────────────────────────────
FROM oven/bun:1.2-alpine AS production

WORKDIR /app

# Copy everything from base
COPY --from=base /app .

# Public uploads folder yaratish
RUN mkdir -p public/uploads

# Port
EXPOSE 3000

# Migrations ishlatib serverni ishga tushirish
CMD bunx prisma migrate deploy && bun run server.ts

# =========================
# BUILD STAGE
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# DATABASE_URL factice : requis par prisma.config.ts pour charger la config au build.
# `prisma generate` ne se connecte à aucune base — la vraie URL est injectée au runtime.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public"

RUN npx prisma generate
RUN npm run build

# =========================
# PRODUCTION STAGE
# =========================
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Applique les migrations Prisma puis démarre l'API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
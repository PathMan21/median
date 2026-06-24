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
# PRODUCTION STAGE - TEST
# =========================
FROM node:20-alpine

WORKDIR /app

CMD ["node", "dist/src/main"]

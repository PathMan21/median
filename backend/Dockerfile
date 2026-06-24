# =========================
# BUILD STAGE
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build


# =========================
# PRODUCTION STAGE - TEST
# =========================
FROM node:20-alpine

WORKDIR /app

CMD ["node", "dist/src/main"]
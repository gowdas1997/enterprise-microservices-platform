FROM node:20-alpine AS base

FROM base AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

FROM base

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

EXPOSE 7000

ENTRYPOINT ["node", "server.js"]
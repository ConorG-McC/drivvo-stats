FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY cli/package.json ./cli/package.json
COPY web/package.json ./web/package.json
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run web:build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/web/.next/standalone ./
COPY --from=builder /app/web/.next/static ./web/.next/static
COPY --from=builder /app/web/public ./web/public

EXPOSE 3000
CMD ["node", "web/server.js"]

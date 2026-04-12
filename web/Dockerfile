# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1

# Step 1. Install workspace dependencies only when package metadata changes
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY cli/package.json ./cli/package.json
COPY web/package.json ./web/package.json
RUN npm ci

# Step 2. Build the Next.js app with the workspace scripts
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build:web

# Step 3. Production image, copy traced standalone output and run as non-root
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 drivvo-group \
  && adduser --system --uid 1001 drivvo-user --ingroup drivvo-group

COPY --from=builder --chown=drivvo-user:drivvo-group /app/web/.next/standalone ./
COPY --from=builder --chown=drivvo-user:drivvo-group /app/web/.next/static ./web/.next/static
COPY --from=builder --chown=drivvo-user:drivvo-group /app/web/public ./web/public

RUN mkdir -p web/.next/cache \
  && chown -R drivvo-user:drivvo-group web/.next/cache

USER drivvo-user:drivvo-group

EXPOSE 3000
CMD ["node", "web/server.js"]

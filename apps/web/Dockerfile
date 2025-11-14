# Multi-stage build for Next.js frontend
# Stage 1: Build dependencies
FROM node:20.9.0-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN npm install --global pnpm@9.10.0

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copy shared packages
COPY packages/shared/package.json ./packages/shared/
COPY packages/shared/tsconfig.json ./packages/shared/
COPY packages/shared/src ./packages/shared/src

# Copy frontend package.json
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build application
FROM node:20.9.0-alpine AS builder
RUN npm install --global pnpm@9.10.0

# Build args for NEXT_PUBLIC_ env vars
ARG NEXT_PUBLIC_SOCKET_PORT=http://localhost:4000

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Copy workspace files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./

# Copy frontend source
COPY apps/web ./apps/web

# Build Next.js
WORKDIR /app/apps/web
ENV STANDALONE_BUILD=true
ENV NEXT_PUBLIC_SOCKET_PORT=$NEXT_PUBLIC_SOCKET_PORT
RUN pnpm build

# Stage 3: Production runtime
FROM node:20.9.0-alpine AS runner
RUN npm install --global pnpm@9.10.0

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# Set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]


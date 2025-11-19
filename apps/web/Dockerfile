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

# Copy shared packages (thin wrapper that points to NestJS libs)
COPY packages/shared/package.json ./packages/shared/
COPY packages/shared/src ./packages/shared/src

# Copy NestJS shared library (source of truth for types)
COPY apps/api/libs ./apps/api/libs
COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/nest-cli.json ./apps/api/

# Copy frontend package.json
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build application
FROM node:20.9.0-alpine AS builder
RUN npm install --global pnpm@9.10.0

# Build args for NEXT_PUBLIC_ env vars
ARG NEXT_PUBLIC_SOCKET_PORT=http://localhost:8888
ARG NEXT_PUBLIC_API_URL=http://localhost:8888

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

# Copy NestJS shared library (needed for TypeScript path resolution)
COPY --from=deps /app/apps/api/libs ./apps/api/libs
COPY --from=deps /app/apps/api/tsconfig.json ./apps/api/
COPY --from=deps /app/apps/api/nest-cli.json ./apps/api/

# Copy frontend source
COPY apps/web ./apps/web

# Build Next.js
WORKDIR /app/apps/web
ENV STANDALONE_BUILD=true
ENV NEXT_PUBLIC_SOCKET_PORT=$NEXT_PUBLIC_SOCKET_PORT
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
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

EXPOSE 6333

ENV PORT=6333
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]


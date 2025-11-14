# Multi-stage build for NestJS backend
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

# Copy backend package.json
COPY apps/api/package.json ./apps/api/
COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/nest-cli.json ./apps/api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build application
FROM node:20.9.0-alpine AS builder
RUN npm install --global pnpm@9.10.0

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

# Copy workspace files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./

# Copy backend source
COPY apps/api ./apps/api

# Copy champions data (needed by ChampionsService)
COPY apps/web/public/champions ./apps/web/public/champions

# Build NestJS
WORKDIR /app/apps/api
RUN pnpm build

# Stage 3: Production runtime
FROM node:20.9.0-alpine AS runner
RUN npm install --global pnpm@9.10.0

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs

# Copy entire built application structure
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/nest-cli.json ./apps/api/nest-cli.json
COPY --from=builder /app/apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/package.json ./package.json

# Copy champions data needed by API
COPY --from=builder /app/apps/web/public/champions ./apps/web/public/champions

# Create logs directory
RUN mkdir -p /app/logs && chown -R nestjs:nestjs /app

USER nestjs

WORKDIR /app/apps/api

EXPOSE 4000

ENV PORT=4000
ENV LOG_LEVEL=info

CMD ["node", "dist/apps/api/src/main"]


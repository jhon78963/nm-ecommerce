# =============================================================================
# Dockerfile — nm-ecommerce (Next.js storefront)
# Build: docker build -t nm-storefront .
# Run:   docker run -p 3015:3015 --env-file .env.local nm-storefront
# =============================================================================

ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS deps
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

RUN --mount=type=cache,target=/root/.npm \
    npm ci

FROM node:${NODE_VERSION} AS builder
WORKDIR /app

ARG NEXT_PUBLIC_APP_URL=http://localhost:3015
ARG NEXT_PUBLIC_WHATSAPP_NUMBER=51901259663
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
ARG API_BASE_URL=http://localhost:3000/api/v1

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=${NEXT_PUBLIC_WHATSAPP_NUMBER}
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
ENV API_BASE_URL=${API_BASE_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3015
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3015

CMD ["node", "server.js"]

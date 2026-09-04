# Kidora server — self-host container image.
#
# NOTE: this image is not yet built in CI (see docs/DEPLOYMENT.md). It follows
# the standard Next.js + Prisma pattern; openssl is installed explicitly so the
# Prisma query engine works on the Debian-slim base (the classic gotcha).
#
#   docker compose up -d   (from the repo root, with an .env — see DEPLOYMENT.md)
FROM node:20-bookworm-slim

# Prisma's query engine needs openssl at build (generate) and runtime.
# python3/make/g++ are needed to compile the better-sqlite3 native binding
# (npm ci below runs with --ignore-scripts, so its prebuilt binary is skipped).
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies first (better layer caching). --ignore-scripts is required:
# the package's postinstall runs `db:generate`, which needs scripts/ + prisma/ —
# not copied until the `COPY . .` below. `prisma generate` still runs, at the
# right time, via the `prebuild` hook when `npm run build` executes.
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund --ignore-scripts

# Copy the rest and build. The provider is fixed at build time (Prisma client
# dialect is baked at generate); override with --build-arg DATABASE_PROVIDER=sqlite
# for a single-container SQLite deployment. The compose file provisions Postgres
# by default; `prisma generate` runs in prebuild.
COPY . .
ARG DATABASE_PROVIDER=postgresql
ENV DATABASE_PROVIDER=${DATABASE_PROVIDER}
# --ignore-scripts above skipped better-sqlite3's install script; rebuild its
# native binding (downloads a prebuilt binary, or compiles from source as fallback).
RUN npm rebuild better-sqlite3
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

# Sync the schema (idempotent, retried until the DB is reachable) then start.
CMD ["sh", "docker-entrypoint.sh"]

# We use a multi-stage approach to keep our final image as small as possible
# without complicating a lot the build process on the trimming phases.
FROM node:lts AS build

WORKDIR /tmp/install
COPY . .
RUN git clean -fxd || true

WORKDIR /tmp/install/packages/backend
RUN corepack pnpm ci --prod
# ## Workaround of https://github.com/npm/cli/issues/6874
# RUN cp -r ../../node_modules . \
#     && rm -rf node_modules/@caise2027-website/shared \
#     && mkdir -p node_modules/@caise2027-website \
#     && mv ../shared node_modules/@caise2027-website

FROM node:lts-slim

WORKDIR /app
COPY --from=build /tmp/install/packages/backend .
# OpenSSL is needed for Prisma
RUN rm -rf *.config* tsconfig.json seeds sample.env Dockerfile $(find . -type f -name "*.md" -name ".*") \
    && apt update \
    && apt install -y openssl curl \
    && rm -rf /var/lib/apt/lists/{*,.*} /var/cache/apt/archives/{*,.*}

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD ["curl", "-f", "-s", "http://127.0.0.1:3000/ping"]
ENTRYPOINT ["npm", "run", "prod"]

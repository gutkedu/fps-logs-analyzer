FROM node:lts-bullseye-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

RUN npm i

COPY src/ ./src/

RUN npm run build

FROM node:lts-bullseye-slim AS deployment

RUN apt-get update && apt-get install -y \
  dumb-init \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /usr/src/app/dist ./dist

RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /usr/src/app
USER appuser

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
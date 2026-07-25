FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm ci

COPY . .

RUN DATABASE_URL="postgresql://docker:docker@localhost:5432/secret_kitchen" \
    npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
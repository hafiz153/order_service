# 🔹 Stage 1: Install dependencies (Base Stage)
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 🔹 Stage 2: Development (Includes dev dependencies)
FROM base AS development
WORKDIR /usr/src/app
COPY . .
RUN yarn install --frozen-lockfile
CMD ["yarn", "start:dev"]

# 🔹 Stage 3: Production (Optimized for deployment)
FROM node:20-alpine AS production
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY . .
RUN yarn build
CMD ["node", "dist/main.js"]

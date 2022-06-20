FROM node:18.4.0-alpine3.15 as base

EXPOSE 8081
WORKDIR /app
ARG PNPM_REGISTRY=${PNPM_REGISTRY}
RUN npm i -g pnpm && pnpm config set registry $PNPM_REGISTRY 

FROM base AS build

WORKDIR /app

COPY package.json ./ 
COPY pnpm-* ./
COPY backend backend

RUN pnpm i -r --frozen-lockfile --filter="./backend" && pnpm backend:build

FROM base AS final

WORKDIR /app

RUN mkdir /app/backend
COPY package.json ./
COPY pnpm-* ./
COPY backend/package.json ./backend/package.json
COPY --from=build /app/backend/dist ./backend/dist

RUN pnpm i -r -P --frozen-lockfile --filter="./backend" 

EXPOSE 8081

CMD ["pnpm", "backend:start"]

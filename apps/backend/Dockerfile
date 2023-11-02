FROM node:19.2.0-alpine3.15 as base

EXPOSE 8081
WORKDIR /app
ARG PNPM_REGISTRY=${PNPM_REGISTRY}
RUN npm i -g pnpm && pnpm config set registry $PNPM_REGISTRY 

FROM base AS build

WORKDIR /app

COPY package.json ./ 
COPY pnpm-* ./
COPY apps/backend apps/backend
COPY packages packages

RUN pnpm i -r --frozen-lockfile --filter="@plantarium/backend" && pnpm backend:build

FROM base AS final

WORKDIR /app

RUN mkdir -p /app/apps/backend
COPY package.json ./
COPY pnpm-* ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY --from=build /app/apps/backend/dist ./apps/backend/dist

RUN pnpm i -r -P --frozen-lockfile --filter="@plantarium/backend" 

EXPOSE 8081

CMD ["pnpm", "backend:start"]

# syntax=docker/dockerfile:1

FROM node:alpine

WORKDIR /app

COPY --link ["package.json", "pnpm-lock.yaml", "./"]

RUN pnpm install --frozen-lockfile

COPY --link prisma .
RUN pnpm run prisma generate

COPY --link . .

ENV PUBLIC_NODE_ENV=production

RUN pnpm run build

EXPOSE 3000
CMD ["node", "./build"]

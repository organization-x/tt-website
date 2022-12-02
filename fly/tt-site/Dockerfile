# syntax=docker/dockerfile:1

FROM node:alpine

WORKDIR /app

COPY --link ["package.json", "yarn.lock", "./"]

RUN yarn --frozen-lockfile

COPY --link prisma .
RUN yarn prisma generate

COPY --link . .

ENV PUBLIC_NODE_ENV=production

RUN yarn build

RUN yarn --frozen-lockfile --production

EXPOSE 3000
CMD ["node", "./build"]

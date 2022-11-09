FROM node:alpine

WORKDIR /app

COPY --link package.json .
COPY --link yarn.lock .

RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6 \
	yarn --frozen-lockfile

COPY --link prisma .
RUN yarn prisma generate

COPY --link . .

RUN yarn build

EXPOSE 3000
CMD ["node", "./build/index.js"]

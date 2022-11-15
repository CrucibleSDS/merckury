##### Build Image #####
FROM node:16 AS builder

WORKDIR /merckury

COPY package.json yarn.lock ./
RUN yarn install --immutable

COPY . .
RUN yarn build

##### Runtime Image #####
FROM node:16

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder /merckury .

CMD ["sh", "-c", "yarn build && yarn start"]

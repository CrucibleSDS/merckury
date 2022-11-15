##### Build Image #####
FROM node:16 AS builder

WORKDIR /merckury

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

##### Runtime Image #####
FROM node:16

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder /merckury/components ./components
COPY --from=builder /merckury/pages ./pages
COPY --from=builder /merckury/public ./public
COPY --from=builder /merckury/styles ./styles
COPY --from=builder /merckury/utils ./utils
COPY --from=builder /merckury/dist ./dist
COPY --from=builder /merckury/next.config.js ./next.config.js
COPY --from=builder /merckury/.next/ ./.next
COPY --from=builder /merckury/node_modules/ ./node_modules
COPY --from=builder /merckury/package.json/ ./package.json

CMD ["sh", "-c", "yarn start"]

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

ARG NEXT_PUBLIC_API_BASE_URL https://crucible.axolotl.cloud/api/v1
ENV NEXT_PUBLIC_API_BASE_URL https://crucible.axolotl.cloud/api/v1

WORKDIR /usr/src/app

COPY --from=builder /merckury/components ./components
COPY --from=builder /merckury/pages ./pages
COPY --from=builder /merckury/public ./public
COPY --from=builder /merckury/styles ./styles
COPY --from=builder /merckury/utils ./utils
COPY --from=builder /merckury/next.config.js ./next.config.js
COPY --from=builder /merckury/.next/ ./.next
COPY --from=builder /merckury/node_modules/ ./node_modules
COPY --from=builder /merckury/package.json/ ./package.json

CMD ["sh", "-c", "yarn start"]

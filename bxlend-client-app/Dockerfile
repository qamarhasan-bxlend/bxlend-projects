FROM node:20 as build

# RUN npm i -g yarn
# RUN apk add --no-cache --virtual .gyp python3 py-setuptools make g++
# RUN apk add --update alpine-sdk
# RUN apk add libffi-dev openssl-dev
# RUN apk --no-cache --update add build-base
# RUN apk add --no-cache make gcc g++ libc6-compat bash python3
RUN mkdir -p /home/node/node_modules && chown -R node:node /home/node

WORKDIR /home/node

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

USER node

RUN yarn --pure-lockfile

COPY --chown=node:node . .

RUN yarn build

FROM node:20

RUN npm i -g serve

RUN mkdir -p /home/node/node_modules && chown -R node:node /home/node

WORKDIR /home/node

COPY --chown=node:node --from=build /home/node/build ./build

USER node

EXPOSE 3000

CMD [ "serve", "-s", "build", "-l", "3000" ]

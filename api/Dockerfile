FROM node:14.17.5-alpine

RUN apk --no-cache add --virtual build-deps build-base python

RUN npm i -g npm@7.21.0

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home/node/api

WORKDIR /home/node/api

COPY --chown=node:node package*.json ./

USER node

RUN npm i --production

USER root

RUN apk del build-deps

USER node

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "npm", "start" ]

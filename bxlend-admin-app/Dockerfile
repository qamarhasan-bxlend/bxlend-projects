FROM node:14.18.0-alpine as build

# RUN npm i -g yarn

RUN mkdir -p /home/node/node_modules && chown -R node:node /home/node

WORKDIR /home/node

COPY --chown=node:node package.json ./
# COPY --chown=node:node package-lock.json ./

USER node

RUN npm i

COPY --chown=node:node . .

RUN npm run build

FROM node:14.18.0-alpine

RUN npm i -g serve

RUN mkdir -p /home/node/node_modules && chown -R node:node /home/node

WORKDIR /home/node

COPY --chown=node:node --from=build /home/node/dist ./dist

USER node

EXPOSE 3000

CMD [ "serve", "-s", "dist", "-l", "3000" ]
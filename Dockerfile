
FROM node:lts-alpine

RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

RUN apk update && apk upgrade
RUN apk add --no-cache --virtual .builder git python make g++

COPY . /usr/src/nuxt-app/
RUN npm install
RUN npm run build
RUN apk del .builder
EXPOSE 8080

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=8080

CMD [ "npm", "start" ]
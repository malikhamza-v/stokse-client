FROM node:18-alpine

RUN apk add --no-cache bash \
  && npm install -g yarn

WORKDIR /react

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build:web --no-cache

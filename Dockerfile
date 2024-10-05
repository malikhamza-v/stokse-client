FROM node:18-alpine

WORKDIR /react

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build:web --no-cache

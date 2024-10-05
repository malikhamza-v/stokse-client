FROM node:18-alpine

WORKDIR /react

COPY . .

RUN yarn install


RUN yarn build:web --no-cache

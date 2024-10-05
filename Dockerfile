FROM node:18-alpine

WORKDIR /react

COPY . .

RUN npm install --ignore-scripts


RUN npm run build:web --no-cache

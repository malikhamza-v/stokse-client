FROM node:18-alpine

WORKDIR /react

COPY . .

RUN npm install


RUN npm run build:web --no-cache

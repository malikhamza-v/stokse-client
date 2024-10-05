FROM node:18-alpine

WORKDIR /react

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build:web --no-cache

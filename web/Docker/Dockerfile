FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./
RUN cd server && npm install && cd ../src && npm install
COPY . .
EXPOSE 3000
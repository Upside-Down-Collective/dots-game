FROM node:16

WORKDIR /usr/src/app
COPY . .
RUN cd web && npm install && cd ../server && npm install
EXPOSE 3000
EXPOSE 5000
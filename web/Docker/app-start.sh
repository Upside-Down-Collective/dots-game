#! /bin/bash

cd web && npm install && cd ../server && npm install
node index.js & cd ../web && npm start
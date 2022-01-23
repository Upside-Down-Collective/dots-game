#! /bin/bash

cd server && npm install && cd ../web && npm install && npm run build && cd ../server
PORT=5001 node index.js
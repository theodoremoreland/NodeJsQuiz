FROM node:20-bullseye-slim

WORKDIR /server

COPY server/ ./
RUN npm install

CMD ["node", "index.js"]
FROM node:20-bullseye-slim

WORKDIR /server

COPY . ./
RUN npm install

EXPOSE 8080

CMD ["node", "server.js"]
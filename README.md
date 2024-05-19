# Node.js Quiz

A Node.js quiz through a Node.js command line program. The program can be used directly in a command line environment or indirectly via webpage. The latter leverages WebSockets and Node `child_process` to pipe input and output between web client and command line environment. The webpage is served using `Express.js`.

Given this project involves both a command line program and a web app, there are two different interfaces and feature sets available. For example, the command line interface allows the choosing of topics, whereas the web app doesn't. See screenshots and local setups for each below.

<img src="presentation/thumbnail.png" width="650">

[Visit the live deployment here](http://node-js-quiz.us-east-1.elasticbeanstalk.com/)

_This program is based on a homework assignment for LaunchCode's Lc101 (2019). The assignment was named "Candidate Testing", which involved creating a trivia quiz on random topics (written in Node.js)._

## Table of Contents

- [Technologies Used](#technologies-used)
- [How to run locally](#how-to-run-locally)
  - [Via web app](#via-web-app)
  - [Via command line](#via-command-line)
- [Screenshots](#screenshots)
  - [Desktop](#desktop)
  - [Mobile](#mobile)

## Technologies Used

- JavaScript
- HTML
- CSS
- Node
- Express
- Inquirer
- Figlet
- ws (WebSocket)
- Docker

## How to run locally

**The steps below assume you have `git`, `Node.js`, and/or `Docker` installed on your machine.**

### Via web app

#### With Docker

1. Clone this repository.
2. cd into `docker` directory

```
cd /docker
```

3. Build docker image and start container

```
docker compose up --build
```

4. Visit http://localhost:8080

#### With Node

1. Clone this repository.
2. Install necessary dependencies via executing npm install command in `/server` folder of this project on your machine.
3. Execute `node server.js` or `npm start`.
4. Visit http://localhost:8080

### Via command line

#### With Node

1. Clone this repository.
2. Install necessary dependencies via executing npm install command in `/server` folder of this project on your machine.
3. Execute `node cli.js`.

# Screenshots

## Desktop

<img src="presentation/thumbnail.png" width="600">

## Mobile

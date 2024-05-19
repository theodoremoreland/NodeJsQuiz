# Node.js Quiz

A Node.js quiz through a Node.js command line program. The program can be used directly in a command line environment or indirectly via webpage. The latter leverages WebSockets and Node `child_process` to pipe input and output between web client and command line environment. The webpage is served using `Express.js`.

<img src="presentation/thumbnail.png" width="650">

_This program is based on a homework assignment for LaunchCode's Lc101 (2019). The assignment was named "Candidate Testing", which involved creating a trivia quiz on random topics (written in Node.js)._

[Visit the live deployment](http://node-js-quiz.us-east-1.elasticbeanstalk.com/)

## Table of Contents

- [How to run locally](#how-to-run-locally)
  - [Via webpage](#via-webpage)
  - [Via command line](#via-command-line)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
  - [Desktop](#desktop)
  - [Mobile](#mobile)

## How to run locally

**The steps below assume you have `git`, `Node.js`, and/or `Docker` installed on your machine.**

### Via webpage

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

## Technologies Used

- JavaScript
- HTML
- CSS
- Inquirer
- Figlet
- Express
- ws (WebSocket)

# Screenshots

## Desktop

<img src="presentation/thumbnail.png" width="600">

## Mobile

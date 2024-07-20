# Node.js Quiz

A Node.js quiz through a Node.js command line program. The program can be used directly in a command line environment or indirectly via webpage. The latter leverages WebSockets and Node `child_process` to pipe input and output between web client and command line environment. The webpage is served using `Express.js`.

Given this project involves both a command line program and a web app, there are two different interfaces and feature sets available. For example, the command line interface allows the choosing of topics, whereas the web app doesn't. See screenshots and local setups for each below.

<img src="presentation/thumbnail.png" width="650">

[View the web application](http://node-js-quiz.us-east-1.elasticbeanstalk.com/)

_This program is based on a homework assignment for LaunchCode's Lc101 (2019). The assignment was named "Candidate Testing", which involved creating a trivia quiz on random topics (written in Node.js)._

## Table of Contents

[View the web application](http://node-js-quiz.us-east-1.elasticbeanstalk.com/)

- [Technologies Used](#technologies-used)
- [How to run locally](#how-to-run-locally)
  - [Via web app](#via-web-app)
  - [Via command line](#via-command-line)
- [Screenshots](#screenshots)
  - [Desktop](#desktop)
  - [Mobile](#mobile)
  - [Command line](#command-line)

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

**The steps below assume you have `git`, `Node`, and/or `Docker` installed on your machine. It is also assumed that you are executing commands from the root of this repository on your local machine.**

### Via web app

#### With Docker

Note: Confirm that Docker is running prior to proceeding and that port `8080` is not being used by another program.

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
2. `cd` into `/server` directory

```
cd /server
```

3. Install necessary dependencies via `npm`

```
npm install
```

4. Start server

```
npm run start
```

5. Visit http://localhost:8080

### Via command line

#### With Node

1. Clone this repository.
2. `cd` into `/server` directory

```
cd /server
```

3. Start command line program

```
npm run cli
```

# Screenshots

## Desktop

### After help command

<img src="https://dj8eg5xs13hf6.cloudfront.net/node-js-quiz/1.png" width="600">

### Quiz start

<img src="https://dj8eg5xs13hf6.cloudfront.net/node-js-quiz/2.png" width="600">

### Quiz complete (fail)

<img src="https://dj8eg5xs13hf6.cloudfront.net/node-js-quiz/3.png" width="600">

### Quiz complete (pass)

<img src="https://dj8eg5xs13hf6.cloudfront.net/node-js-quiz/4.png" width="600">

## Mobile

### After help command

<img src="https://dj8eg5xs13hf6.cloudfront.net/node-js-quiz/5.png" width="250">

### Quiz start

<img src="https://dj8eg5xs13hf6.cloudfront.net/node-js-quiz/6.png" width="250">

### Quiz complete (fail)

<img src="https://dj8eg5xs13hf6.cloudfront.net/node-js-quiz/7.png" width="250">

### Quiz complete (pass)

<img src="https://dj8eg5xs13hf6.cloudfront.net/node-js-quiz/8.png" width="250">

## Command Line

### Choose command line topics to include in quiz

<img src="https://dj8eg5xs13hf6.cloudfront.net/node-js-quiz/9.png" width="600">

### Quiz begun

<img src="https://dj8eg5xs13hf6.cloudfront.net/node-js-quiz/10.png" width="600">

### Quiz in progress

<img src="https://dj8eg5xs13hf6.cloudfront.net/node-js-quiz/11.png" width="600">

### Results

<img src="https://dj8eg5xs13hf6.cloudfront.net/node-js-quiz/12.png" width="600">

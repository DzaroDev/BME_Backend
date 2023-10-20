# BME Backend

#### Prerequisites
- Node.js
- MongoDB
- Git CLI
- Postman

#### Get started with Node.js
- Download NVM (Node Version Manager) from [here](https://github.com/coreybutler/nvm-windows/releases) and install it
- After NVM is installed, open terminal and,
  - Check current NVM version, run `nvm version`
  - Install Node.js in your system, run `nvm install 18`
  - Check current Node.js and NPM version, run `node -v` and `npm -v` respectively

#### Get started with MongoDB
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) 

#### Get started with Git CLI
- Install Git CLI ([instructions](https://git-scm.com/download/win))

#### Get started with Postman
- Install Postman ([instructions](https://www.postman.com/downloads/))

#### Start the Node.js server
- Clone this repo
- Run `npm install` to install all required dependencies
- Run `npm run dev` to start the local server
- Local server will start at http://127.0.0.1:8080/
- Verify if server is running,
  - Open Postman, and enter the API http://127.0.0.1:8080/api/health-check and hit send, then "OK" message will be returned as response.

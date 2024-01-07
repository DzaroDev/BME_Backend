const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('node-server:index');
const path = require('path');
const fs = require('fs');

// config
const config = require('./src/config');
const server = require('./src/server');

// controllers
const userController = require('./src/controllers/user.controller');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to database
let mongoUri = ['mongodb://', config.db.user, ':', config.db.pwd, '@', config.db.host, ':', config.db.port, '/', config.db.name];

mongoUri = mongoUri.join('');

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: config.db.name,
  })
  .then(
    async () => {
      // print mongoose logs in dev env
      if (config.db.debugMode) {
        mongoose.set('debug', (collectionName, method, query, doc) => {
          debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
        });
      }

      // create default admin
      await userController.createDefaultAdmin();

      // create default directories
      const imgDirPath = path.resolve(__dirname, './public/images');
      const docDirPath = path.resolve(__dirname, './public/docs');

      if (!fs.existsSync(imgDirPath)) fs.mkdirSync(imgDirPath);
      if (!fs.existsSync(docDirPath)) fs.mkdirSync(docDirPath);

      // start server
      server.listen(config.port, () => {
        debug(`Server ready at ${config.addr}:${config.port} (${config.env})`);
      });
    },
    (err) => {
      throw new Error(`Failed to connect to database (${config.db.name}) \n\n${err}`);
    },
  );

module.exports = server;

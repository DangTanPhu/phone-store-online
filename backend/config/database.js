const mongoose = require('mongoose');
const chalk = require('chalk');
const { url: dbURL } = require('./config'); // Use destructuring to extract `url` from config

const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

// Function to initialize database connection
module.exports = function initDatabase() {
  mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });


  mongoose.connection.on('connected', () => {
    console.log(connected('Mongoose default connection is open to MongoDB'));
  });

  mongoose.connection.on('error', (err) => {
    console.log(error('Mongoose default connection error: ' + err));
  });

  mongoose.connection.on('disconnected', () => {
    console.log(disconnected('Mongoose default connection is disconnected'));
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log(termination('Mongoose default connection is disconnected due to application termination'));
      process.exit(0);
    });
  });
};
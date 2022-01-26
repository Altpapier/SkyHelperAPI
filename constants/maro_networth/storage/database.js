const mongoose = require('mongoose');
require('dotenv').config();

const createDatabaseConnection = function () {
  try {
    mongoose.connection.on('connected', () => {
      console.log('Database connection opened successfully');
    });

    mongoose.connection.on('error', e => {
      console.log('An error occured while connecting to the database ' + e);
    });

    mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (e) {
    console.log(e);
  }
};

createDatabaseConnection();

module.exports = {
  bazaar: require('./schemas/bazaar'),
  auctions: require('./schemas/auctions'),
  leaderboard: require('./schemas/leaderboard'),
  ignoredItems: require('./schemas/ignoredItems')
};

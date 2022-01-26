const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  uuid: String,
  name: String,
  profile: String,
  networth: Number,
  isIronman: Boolean
});

module.exports = mongoose.model('leaderboards', leaderboardSchema, 'leaderboards');

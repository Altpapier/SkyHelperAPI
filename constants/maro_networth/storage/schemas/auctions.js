const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  id: String,
  sales: Array,
  auction: Object,
  skinPrices: Object
});

module.exports = mongoose.model('auctions', auctionSchema, 'auctions');

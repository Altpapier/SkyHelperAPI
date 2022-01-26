const mongoose = require('mongoose');

const ignoredItemsSchema = new mongoose.Schema({
  id: String,
});

module.exports = mongoose.model('ignoredItems', ignoredItemsSchema, 'ignoredItems');

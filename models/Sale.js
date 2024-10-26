const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  products: [{
    product: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  id_user: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = SaleSchema; 
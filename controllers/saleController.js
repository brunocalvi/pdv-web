const mongoose = require('mongoose');
const SaleModel = require('../models/Sale');
const dotenv = require('dotenv');

dotenv.config();
const Sale = mongoose.model('Sale', SaleModel);

module.exports = () => {
  async function saveSale(products) {
    return await Sale.create(products);
  }

  async function findSale(id) {
    return await Sale.findById(id);
  }

  async function findSaleUser(id_user) {
    return await Sale.find({ id_user: id_user });
  }

  return { saveSale, findSale, findSaleUser }
};
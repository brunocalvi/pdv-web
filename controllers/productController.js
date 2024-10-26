const mongoose = require('mongoose');
const ProductModel = require('../models/Product');
const dotenv = require('dotenv');

dotenv.config();
const Product = mongoose.model('Product', ProductModel);

module.exports = () => {
  async function create(params) {
    return await Product.create({
      name: params.name,
      price: params.price,
      stock: params.stock,
    });
  }

  async function getAll() {
    return await Product.find({});
  }

  async function getOne(id) {
    return await Product.findById(id);
  }

  async function oneUpdate(id, quantity) {
    return await Product.findOneAndUpdate(
      { _id: id }, { stock: quantity } 
    );
  }

  async function updateStock(id, dados) {
    return await Product.findOneAndUpdate(
      { _id: id }, { stock: dados.stock, price: dados.price } 
    );
  }

  return { create, getAll, getOne, oneUpdate, updateStock };
};
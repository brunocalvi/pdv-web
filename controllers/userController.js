const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
const User = mongoose.model('User', UserModel);

module.exports = () => {
  async function passwordHash(senha) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(senha, salt); 
  };

  async function checkPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  };

  async function findUser(user) {
    return await User.findOne({ username: user })
  }

  async function findId(id) {
    return await User.findById(id);
  }

  async function register(params) {
    let passwordH = await passwordHash(params.password);

    return await User.create({

      name: params.name,
      username: params.username,
      email: params.email,
      password: passwordH,
      record_type: params.record_type
    });
  }

  async function login(user, password) {
    let dados = [];

    const pass = await findUser(user);
    const checked = await checkPassword(password, pass.password);

    if(checked == true) {
      dados = {
        status: 'sucesso',
        id: pass._id,
        username: pass.username  
      }
    } else {
      dados = checked; 
    }

    return dados;
  }

  async function deleteUser(id) {
    return await User.deleteOne({ _id: id });
  }

  async function updateUser(id, dados) {
    return await User.findByIdAndUpdate(id, {  
      name: dados.name,
      username: dados.username,
      email: dados.email,
      record_type: dados.record_type  
    });
  }

  async function alterPassword(id, password) {
    let passwordH = await passwordHash(password);
    
    return await User.findByIdAndUpdate(id, { password: passwordH });
  }

  return { register, login, findId, deleteUser, updateUser, alterPassword };
}
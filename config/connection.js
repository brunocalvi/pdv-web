const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);

    console.log('-> Conectado ao MongoDB com sucesso!');
  } catch(e) {
    console.error('-> Erro ao se conectar ao MongoDB: ', e);
  }
};

connectToMongoDB();
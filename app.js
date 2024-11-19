const express = require('express');
const bodyParser = require('body-parser');
const consign = require('consign');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

consign({ verbose: false })
  .include('config/connection.js')
  .then('./controllers')
  .then('./factores')
  .then('./routes')
  .then('models') 
  .into(app);

app.listen(process.env.PORT, () => {
  console.log(`-> Aplicação rodando na porta ${process.env.PORT}!`);
});

module.exports = app;
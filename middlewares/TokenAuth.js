const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
  const authToken = req.headers['authorization'];

  if(authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];

    try {
      let decoded = jwt.verify(token, process.env.SECRET);
      next();

    } catch(e) {
      res.status(401).json({
        status: 401,
        metodo: 'Validar token', 
        mensagem: `Erro ao verificar o token: ${e}`
      });
    }
    
  } else {
    res.status(401).json({
      status: 401,
      metodo: 'Validar token',
      mensagem: 'Token inválido.'
    });
    
    return;
  }
};

const validaToken = require('../middlewares/TokenAuth');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (app) => {
  app.post('/api/user/register', async (req, res) => {
    let dados = req.body;
    let erro = [];

    let validEmail = await app.factores.userFactory.validEmail(dados.email);
    let validName = await app.factores.userFactory.validName(dados.name);
    let validPassword = await app.factores.userFactory.validPassword(dados.password);

    if(validEmail != undefined) { erro.push( validEmail ); }
    if(validName != undefined) { erro.push( validName ); }
    if(validPassword != undefined) { erro.push( validPassword ); }

    if(erro[0] == undefined || erro[0] == '') {
      try {
        const register = await app.controllers.userController.register(dados);

        res.status(201).json({
          status: 201, 
          metodo: 'Usuário',
          mensagem: `Usuário cadastrado com sucesso.`,
          ID_usuario: register._id 
        });

      } catch(e) {
        res.status(400).json({
          status: 400,
          metodo: 'Usuário',
          mensagem: `Falha ao cadastrar usuário`
        });
      }
    } else {
      res.status(400).json({ 
        status: 400,
        metodo: 'Usuário',
        mensagem: erro 
      });
    }
  });

  app.post('/api/user/login', async (req, res) => {
    let dados = req.body;
    let { username, password } = dados;

    try {
      const login = await app.controllers.userController.login(username, password); 

      if(login != false) {
        let token = jwt.sign({ id: login.id, username: login.username }, process.env.SECRET, { expiresIn: '1h' /* em minutos */ });

        res.status(200).json({
          status: 200,
          metodo: 'Usuário',
          usuario: login,
          token: token
        });

      } else {
        res.status(400).json({
          status: 400,
          metodo: 'Usuário',
          mensagem: 'Usuário ou senha inválidos.'
        });
      }

    } catch(e) {
      res.status(400).json({
        status: 400,
        metodo: 'Usuário',
        mensagem: `Falha ao se logar`
      });
    }
  });

  app.get('/api/user/:id', validaToken, async (req, res) => {
    const id = req.params.id;

    try {
      const user = await app.controllers.userController.findId(id);

      let userFilter = {
        id: user._id,
        username: user.username,
        record_type: user.record_type,
      }

      res.status(200).json({
        status: 200,
        metodo: 'Usuário',
        usuario: userFilter 
      });

    } catch(e) { 
      res.status(400).json({
        status: 400,
        metodo: 'Usuário',
        mensagem: `Falha ao consultar`
      });
     }
  });

  app.delete('/api/user/:id', validaToken, async (req, res) => {
    const id = req.params.id;

    try {
      let userSale = await app.controllers.saleController.findSaleUser(id);
      
      if(userSale == '') {
        await app.controllers.userController.deleteUser(id);

        res.status(200).json({
          status: 200,
          metodo: 'Usuário',
          mensagem: `Usuário deletado com sucesso!`
        });

      } else {
        res.status(400).json({
          status: 400,
          metodo: 'Usuário',
          mensagem: `Usuário já tem compras associadas a ele e não pode ser deletado.`
        });
      }
    } catch(e) {
      res.status(400).json({
        status: 400,
        metodo: 'Usuário',
        mensagem: `Falha ao deletar.`
      });
    }
  });

  app.put('/api/user/:id', validaToken, async (req, res) => {
    const id = req.params.id;
    let dados = req.body;
    let { name, username, email, password, record_type } = dados;
    let err = [];

    let validEmail = await app.factores.userFactory.validEmail(email);
    let validName = await app.factores.userFactory.validName(name);
    
    if(validEmail != undefined) { err.push( validEmail ); }
    if(validName != undefined) { err.push( validName ); }
    
    if(password != undefined) {
      let validPassword = await app.factores.userFactory.validPassword(password);
      if(validPassword != undefined) { err.push( validPassword ); }
    }

    if(err[0] == undefined || err[0] == '') {
      try {
        await app.controllers.userController.updateUser(id, dados);
        
        if(password != undefined) {
          await app.controllers.userController.alterPassword(id, password);
        }

        res.status(200).json({
          status: 200,
          metodo: 'Usuário',
          mensagem: `Usuário atualizado com sucesso.`
        });

      } catch(e) {
        res.status(400).json({
          status: 400,
          metodo: 'Usuário',
          mensagem: `Usuário não pode ser atualizado.`
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        metodo: 'Usuário',
        mensagem: `Falha ao atualizar o usuário.`,
        erro: err
      });
    }
  });

  return app;
}
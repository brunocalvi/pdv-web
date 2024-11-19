const validaToken = require('../middlewares/TokenAuth');

module.exports = (app) => {
  app.post('/api/product/register', validaToken, async (req, res) => {
    const product = req.body;
    const { name, price, stock } = product;

    try {
      const register = await app.controllers.productController.create(product);
      
      res.status(201).json({
        status: 201, 
        metodo: 'Produto',
        mensagem: `Produto cadastrado com sucesso.`,
        ID_produto: register._id 
      });

    } catch(e) {
      res.status(400).json({
        status: 400,
        metodo: 'Produto',
        mensagem: `Falha ao cadastrar produto.`
      });
    }
  });

  app.get('/api/product/all', validaToken, async (req, res) => {
    try {
      const allProducts = await app.controllers.productController.getAll();

      res.status(200).json({
        status: 200, 
        metodo: 'Produto',
        mensagem: `Lista de produtos.`,
        produtos: allProducts
      });

    } catch(e) {
      res.status(400).json({
        status: 400,
        metodo: 'Produto',
        mensagem: `Falha ao consultar produtos.`
      });
    }
  });

  app.get('/api/product/:id', validaToken, async (req, res) => {
    const id = req.params.id;

    try {
      const product = await app.controllers.productController.getOne(id);

      res.status(200).json({
        status: 200, 
        metodo: 'Produto',
        mensagem: `Dados Produto`,
        produto: product
      });

    } catch(e) {
      res.status(400).json({
        status: 400,
        metodo: 'Produto',
        mensagem: `Falha ao consultar produtos.`
      });
    }
  });

  app.put('/api/product/:id', validaToken, async (req, res) => {
    const id = req.params.id;
    let dados = req.body;
    let { name, price, stock } = dados;
    let err = [];

    if(isNaN(price)) {
      err.push("Insira um valor valido no preço.");
    }

    if(isNaN(stock)) {
      err.push("Insira um valor valido na quantidade do estoque.");
    }

    if(err[0] == undefined || err[0] == '') {

      await app.controllers.productController.updateStock(id, dados);

      res.status(200).json({
        status: 200,
        metodo: 'Produto',
        mensagem: `Estoque atualiado com sucesso.`,
      });

    } else {
      res.status(400).json({
        status: 400,
        metodo: 'Produto',
        mensagem: `Falha ao atualizar o estoque.`,
        erro: err
      });
    }
  });

  return app;
}
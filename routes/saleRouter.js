const validaToken = require('../middlewares/TokenAuth');

module.exports = (app) => {
  app.post('/api/sale/register', validaToken, async (req, res) => {
    const id_user = req.body.id_user;
    const { sale } = req.body;
    let total = 0;
    let products = [];

    try {
      for (const item of sale) {
        const prod = await app.controllers.productController.getOne(item.id);

        if (!prod || prod.stock < item.quantity) {
          return res.status(400).json({
            status: 400,
            metodo: 'Compra',
            mensagem: `Produto ${item.id} não encontrado ou estoque insuficiente.`,
          });
        }

        total += prod.price * item.quantity;
        const newStock = prod.stock - item.quantity;
        total = Math.round(total * 100) / 100;

        await app.controllers.productController.oneUpdate(prod._id, newStock);

        products.push({ product: prod._id, quantity: item.quantity });
      }

      const savedSale = await app.controllers.saleController.saveSale({ products, total, id_user });

      return res.status(201).json({
        status: 201,
        metodo: 'Compra',
        mensagem: `Compra realizada com sucesso.`,
        produtos: savedSale,
      });
    } catch (e) {
      return res.status(500).json({
        status: 500,
        metodo: 'Compra',
        mensagem: `Erro ${e}`,
      });
    }
  });

  app.get('/api/sale/:id', validaToken, async (req, res) => {
    const id = req.params.id;

    try {
      const sale = await app.controllers.saleController.findSale(id); 

      return res.status(200).json({
        status: 200,
        metodo: 'Compra',
        compra: sale,
      });

    } catch(e) {
      return res.status(400).json({
        status: 400,
        metodo: 'Compra',
        mensagem: `Erro ao consultar a compra.`,
      });
    }
  })

  return app;
};


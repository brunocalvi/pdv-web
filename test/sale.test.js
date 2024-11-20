const request = require('supertest');
const app = require('../app');

// Variáveis globais para a bateria
let token = '';
let IdUser = '';
let IdProduct = '';
let IdSale = '';

// usuário fake para a bateria
const userSale = {
  name: `Compra ${Date.now()}`,
  username: `compra.${Date.now()}`,
  email: `${Date.now()}@compra.com.br`,
  password: "Master-ACu2179-QvY",
  record_type: 'O'
}

// produto fake para a bateria
const productSale = {
  name: `Produto ${Date.now()}`, 
  price: 99.99, 
  stock: 1
}

test('Deve cadastrar um usuário para testar as rotas de compra', async () => {
  return await request(app).post('/api/user/register')
    .send(userSale)
    .then((res) => {
      expect(res.status).toEqual(201);
      expect(res.body.ID_usuario).not.toBeNull();
    });
});

test('Deve se logar com o usuário cadastrado e salvar o token', async () => {
  let log = { username: userSale.username, password: userSale.password };

  return await request(app).post('/api/user/login')
    .send(log)
    .then((res) => {
      token = res.body.token; 
      IdUser = res.body.usuario.id;

      expect(res.status).toEqual(200);
      expect(res.body.token).not.toBeNull();
      expect(res.body.usuario).not.toBeNull();
    });  
});

test('Deve cadastrar um produto com sucesso para testar', async () => {
  return await request(app).post('/api/product/register')
    .set('authorization', `bearer ${token}`)
    .send(productSale)
    .then((res) => {
      IdProduct = res.body.ID_produto;
       
      expect(res.status).toEqual(201);
      expect(res.body.ID_produto).not.toBeNull();
    })
});

test('Não Deve deixar registrar a compra com o estoque insuficiente', async () => {
  return await request(app).post('/api/sale/register')
    .set('authorization', `bearer ${token}`)
    .send({ sale: [{ id: IdProduct, name: productSale.name, price: productSale.price, quantity: 99 }],id_user: IdUser })
    .then((res) => {
      expect(res.status).toEqual(400)
      expect(res.body.mensagem).toEqual(`Produto ${IdProduct} não encontrado ou estoque insuficiente.`);
    })
});

test('Deve cadastrar uma compra com sucesso', async () => {
  return await request(app).post('/api/sale/register')
    .set('authorization', `bearer ${token}`)
    .send({ sale: [{ id: IdProduct, name: productSale.name, price: productSale.price, quantity: 1 }],id_user: IdUser })
    .then((res) => {
      IdSale = res.body.produtos._id;

      expect(res.status).toEqual(201)
      expect(res.body.produtos).not.toBeNull();
    })
});

test('Deve consultar a compra cadastrada no teste', async () => {
  return await request(app).get(`/api/sale/${IdSale}`)
    .set('authorization', `bearer ${token}`)
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.compra).not.toBeNull();
    })
});
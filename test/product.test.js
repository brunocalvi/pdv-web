const request = require('supertest');
const app = require('../app');

// Variáveis globais para a bateria
let token = '';
let IdProduct = '';
let IdUser = '';

// produto fake para a bateria
const productFake = {
  name: `Produto ${Date.now()}`, 
  price: 99.99, 
  stock: 10
}

// usuário fake para a bateria excluido ao final
const userProduct = {
  name: `User Product`,
  username: `product.product`,
  email: `product@product.com.br`,
  password: "Master-ACu2179-QvY",
  record_type: 'O'
}

test('Deve cadastrar um usuário para testar as rotas de produtos', async () => {
  return await request(app).post('/api/user/register')
    .send(userProduct)
    .then((res) => {
      expect(res.status).toEqual(201);
      expect(res.body.ID_usuario).not.toBeNull();
    });
});

test('Deve se logar com o usuário cadastrado e salvar o token', async () => {
  let log = { username: userProduct.username, password: userProduct.password };

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

test('Deve cadastrar um produto com sucesso', async () => {
  return await request(app).post('/api/product/register')
    .set('authorization', `bearer ${token}`)
    .send(productFake)
    .then((res) => {
      IdProduct = res.body.ID_produto;
       
      expect(res.status).toEqual(201);
      expect(res.body.ID_produto).not.toBeNull();
    })
});

test('Deve carregar a lista de produtos cadastrado', async () => {
  return await request(app).get('/api/product/all')
    .set('authorization', `bearer ${token}`)
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.produtos).not.toBeNull();
    });
});

test('Deve carregar o produto cadastrado', async () => {
  return await request(app).get(`/api/product/${IdProduct}`)
    .set('authorization', `bearer ${token}`)
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.produto._id).toEqual(IdProduct);
    });
});

describe('Ao alterar o produto cadastrado ...', () => {
  test('Deve aceitar somente valores validos', async () => {
    let prod = { name: productFake.name, price: 'aa.99', stock: productFake.stock };

    return await request(app).put(`/api/product/${IdProduct}`)
      .set('authorization', `bearer ${token}`)
      .send(prod)
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.erro[0]).toEqual('Insira um valor valido no preço.');
      })
  });

  test('Deve aceitar somente quantidade inteiras no estoque', async () => {
    let prod = { name: productFake.name, price: productFake.price, stock: 'a.10' };

    return await request(app).put(`/api/product/${IdProduct}`)
      .set('authorization', `bearer ${token}`)
      .send(prod)
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.erro[0]).toEqual('Insira um valor valido na quantidade do estoque.');
      })
  });

  test('Deve atualizar o produto com sucesso', async () => {
    let prod = { name: 'Produto atualizado', price: productFake.price, stock: 1 };

    return await request(app).put(`/api/product/${IdProduct}`)
      .set('authorization', `bearer ${token}`)
      .send(prod)
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.body.mensagem).toEqual('Estoque atualiado com sucesso.');
      })
  });
});

test('Deve excluir o usuário cadastrado para a bateria ao final dos testes', async () => {
  return await request(app).delete(`/api/user/${IdUser}`)
    .set('authorization', `bearer ${token}`)
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.mensagem).toEqual('Usuário deletado com sucesso!');
    });
});

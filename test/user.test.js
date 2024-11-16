const request = require('supertest');
const app = require('../app');
const dotenv = require('dotenv');

dotenv.config();

const user = {
  name: `User Teste`,
  username: `teste.teste`,
  email: `teste@teste.com.br`,
  password: "Master-ACu2179-QvY",
  record_type: 'O'
}

// Variáveis globais para a bateria
let token = '';
let IdUser = '';

test('Deve cadastrar um usuário novo', async () => {
  return await request(app).post('/api/user/register')
    .send(user)
    .then((res) => {
      expect(res.status).toEqual(201);
      expect(res.body.ID_usuario).not.toBeNull();
  });
});

test('Deve se logar com o usuário cadastrado e salvar o token', async () => {
  let log = { username: user.username, password: user.password };

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

test('Deve consultar os dados do usuário cadastrado', async () => {
  return await request(app).get(`/api/user/${IdUser}`)
    .set('authorization', `bearer ${token}`)
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.usuario.id).toEqual(IdUser);
  }); 
});

test('Não deve deixar o usuario atualizar o nome com caracterers especiais', async () => {
  return await request(app).put(`/api/user/${IdUser}`)
    .set('authorization', `bearer ${token}`)
    .send({ name: 'User teste @', username: user.username, email: user.email, record_type: user.record_type })
    .then((res) => {
      expect(res.status).toEqual(400);
  });  
});

test('Deve atualizar o usuário cadastrado', async () => {
  return await request(app).put(`/api/user/${IdUser}`)
    .set('authorization', `bearer ${token}`)
    .send({ name: 'User teste 2', username: user.username, email: user.email, record_type: user.record_type })
    .then((res) => {
      expect(res.status).toEqual(200);
  });
});

describe('Ao pedir para alterar a senha ...', () => {

  test('Deve pedir para ter mais de 8 caracteres', async () => {
    return await request(app).put(`/api/user/${IdUser}`)
      .set('authorization', `bearer ${token}`)
      .send({ name: user.name, username: user.username, email: user.email, password: "2179-Qv", record_type: user.record_type })
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.erro[0]).toEqual(['Senha deve ter no mínimo 8 caracteres.']);
    });  
  });

  test('Deve pedir para ter letras minusculas', async () => {
    return await request(app).put(`/api/user/${IdUser}`)
      .set('authorization', `bearer ${token}`)
      .send({ name: user.name, username: user.username, email: user.email, password: "MASTER-ACU2179-QVY", record_type: user.record_type })
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.erro[0]).toEqual(['Senha deve conter letras minusculas.']);
    });  
  });

  test('Deve pedir para ter letras maiúsculas', async () => {
    return await request(app).put(`/api/user/${IdUser}`)
      .set('authorization', `bearer ${token}`)
      .send({ name: user.name, username: user.username, email: user.email, password: "master-acu2179-qvy", record_type: user.record_type })
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.erro[0]).toEqual(['Senha deve conter letras maiúsculas.']);
    });  
  });

  test('Deve pedir para ter números na senha', async () => {
    return await request(app).put(`/api/user/${IdUser}`)
      .set('authorization', `bearer ${token}`)
      .send({ name: user.name, username: user.username, email: user.email, password: "Master-ACuqaew-QvY", record_type: user.record_type })
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.erro[0]).toEqual(['Senha deve conter números.']);
    });  
  });

  test('Deve pedir para ter caracteres especiais.', async () => {
    return await request(app).put(`/api/user/${IdUser}`)
      .set('authorization', `bearer ${token}`)
      .send({ name: user.name, username: user.username, email: user.email, password: "MasterACu2179QvY", record_type: user.record_type })
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.erro[0]).toEqual(['Senha deve conter caracteres especiais.']);
    });  
  });

});

test('Deve excluir o usuário ao final dos testes', async () => {
  return await request(app).delete(`/api/user/${IdUser}`)
    .set('authorization', `bearer ${token}`)
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.mensagem).toEqual('Usuário deletado com sucesso!');
  });
});
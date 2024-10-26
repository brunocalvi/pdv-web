module.exports = (app) => {

  async function validEmail(email) {
    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email.indexOf("@") == -1 || email.indexOf(".") == -1 || !regexEmail.test(email)) {
      return "Indique um e-mail válido.";
    }
  }

  async function validName(name) {
    let regexCaracter = /[^a-zA-Z0-9\s]/;
    
    if(name.lenght < 3 || name.indexOf(" ") == -1) {
      return "Insira um nome e sobrenome válido.";
    }

    if(regexCaracter.test(name)) {
      return "Não use caracteres especiais no nome.";
    }
  }

  async function validPassword(password) {
    let erro = [];

    if(password.length < 8) {
      erro.push("Senha deve ter no mínimo 8 caracteres.");
    }

    if(!password.match(/[a-z]/)) {
      erro.push("Senha deve conter letras minusculas.");
    }

    if(!password.match(/[A-Z]/)) {
      erro.push("Senha deve conter letras maiúsculas.");
    }

    if(!password.match(/\d/)) {
      erro.push("Senha deve conter números.");
    }

    if(!password.match(/[^a-zA-Z\d]/)) {
      erro.push("Senha deve conter caracteres especiais.");
    }

    return erro;
  }

  return { validEmail, validName, validPassword };
}
const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60 * 1000;
const { Usuario, Dentista, Paciente } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function isBlocked(email) {
  const attempt = loginAttempts[email];
  if (!attempt) return false;

  if (attempt.blockUntil && attempt.blockUntil > Date.now()) {
    return true;
  }

  return false;
}

exports.get = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.post = async (req, res) => {
  try {
    const { email, senha, tipo } = req.body;
    //validação de senha
    const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!senhaForteRegex.test(senha)) {
      return res.status(400).json({
        error: "Senha fraca. Use no mínimo 8 caracteres, com letra MAIÚSCULA, minúscula, número e símbolo."
      });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await Usuario.create({
      email,
      senha: senhaHash,
      tipo: 'paciente'
    });

    res.status(201).json(novoUsuario);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.patch = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

    await usuario.update(req.body);
    res.json(usuario);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Usuario.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ mensagem: "Usuário removido com sucesso" });
    } else {
      res.status(404).json({ erro: "Usuário não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // barra se estiver bloqueado
    if (isBlocked(email)) {
      return res.status(403).json({
        message: "Muitas tentativas. Tente novamente mais tarde."
      });
    }

    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      // soma tentativa
      loginAttempts[email] = loginAttempts[email] || { count: 0 };
      loginAttempts[email].count++;

      // bloqueia se passar a quant de tent
      if (loginAttempts[email].count >= MAX_ATTEMPTS) {
        loginAttempts[email].blockUntil = Date.now() + BLOCK_TIME;
      }

      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) {
      loginAttempts[email] = loginAttempts[email] || { count: 0 };
      loginAttempts[email].count++;

      if (loginAttempts[email].count >= MAX_ATTEMPTS) {
        loginAttempts[email].blockUntil = Date.now() + BLOCK_TIME;
      }

      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // login ok - zera tentativas
    delete loginAttempts[email];

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurada!");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    let userName = user.email.split('@')[0];

    if (user.tipo === 'dentista') {
      const { Dentista } = require('../models');
      const dentista = await Dentista.findOne({ where: { userId: user.id } });
      if (dentista && dentista.nome) {
        userName = dentista.nome;
      }
    }

    res.json({ token, user: { id: user.id, email: user.email, tipo: user.tipo, name: userName } });

  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor', erro: err.message });
  }
};
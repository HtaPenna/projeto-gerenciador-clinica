const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    const user = await Usuario.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas 1' });

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ message: 'Credenciais inválidas 2' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'chave_teste',
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, tipo: user.tipo } });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor', erro: err.message });
  }
};

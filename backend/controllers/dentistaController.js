const { Usuario, Dentista, sequelize} = require('../models');
const bcrypt = require('bcryptjs');

exports.getTodos = async (req, res) => {
  try {
    const dentistas = await Dentista.findAll();
    res.json(dentistas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criar = async (req, res) => {
  const t = await sequelize.transaction(); 
  try {
    const { email, senha, nome, cro, enderecoConsultorio, telefoneConsultorio } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create(
      { email, senha: senhaHash, tipo: 'dentista' },
      { transaction: t }
    );

    const dentista = await Dentista.create(
      { userId: usuario.id, nome, cro, enderecoConsultorio, telefoneConsultorio },
      { transaction: t }
    );

    await t.commit(); 
    res.status(201).json({ usuario, dentista });
  } catch (err) {
    await t.rollback();
    res.status(400).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Dentista.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const dentistaAtualizado = await Dentista.findByPk(req.params.id);
      res.json(dentistaAtualizado);
    } else {
      res.status(404).json({ erro: 'Dentista não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Dentista.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ erro: 'Dentista não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

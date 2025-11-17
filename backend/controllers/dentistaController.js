const { Usuario, Dentista, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

exports.getTodos = async (req, res) => {
  try {
    const dentista = await Dentista.findOne({
      where: { userId: req.user.id }
    });

    if (!dentista) {
      return res.status(404).json({ erro: "Dentista não encontrado" });
    }

    res.json([dentista]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const dentista = await Dentista.findOne({
      where: { userId: req.user.id }
    });

    if (!dentista) {
      return res.status(404).json({ error: "Dentista não encontrado" });
    }

    res.json(dentista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.atualizarDadosPessoais = async (req, res) => {
  try {
    const { nome, telefoneConsultorio } = req.body;

    const [updated] = await Dentista.update(
      { nome, telefoneConsultorio },
      { where: { userId: req.user.id } }
    );

    if (!updated) {
      return res.status(404).json({ error: "Dentista não encontrado" });
    }

    const dentistaAtualizado = await Dentista.findOne({
      where: { userId: req.user.id }
    });

    res.json(dentistaAtualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.atualizarDadosClinica = async (req, res) => {
  try {
    const { cro, enderecoConsultorio } = req.body;

    const [updated] = await Dentista.update(
      { cro, enderecoConsultorio },
      { where: { userId: req.user.id } }
    );

    if (!updated) {
      return res.status(404).json({ error: "Dentista não encontrado" });
    }

    const dentistaAtualizado = await Dentista.findOne({
      where: { userId: req.user.id }
    });

    res.json(dentistaAtualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.alterarSenha = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;

    const usuario = await Usuario.findByPk(req.user.id);

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: "Senha atual incorreta" });
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
    await Usuario.update(
      { senha: novaSenhaHash },
      { where: { id: req.user.id } }
    );

    res.json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (updated) {
      const dentistaAtualizado = await Dentista.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
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
    const deleted = await Dentista.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ erro: 'Dentista não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
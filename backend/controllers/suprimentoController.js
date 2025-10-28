const { Suprimento } = require('../models');

exports.getTodos = async (req, res) => {
  try {
    const suprimento = await Suprimento.findAll();
    res.json(suprimento);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novaSuprimento = await Suprimento.create(req.body);
    res.status(201).json(novaSuprimento);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Suprimento.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const suprimentoAtualizado = await Suprimento.findByPk(req.params.id);
      res.json(suprimentoAtualizado);
    } else {
      res.status(404).json({ erro: 'Suprimento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Suprimento.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ erro: 'Suprimento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

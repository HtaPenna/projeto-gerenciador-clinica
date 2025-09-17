const { Tratamento } = require('../models');

exports.getTodos = async (req, res) => {
  try {
    const tratamentos = await Tratamento.findAll();
    res.json(tratamentos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novoTratamento = await Tratamento.create(req.body);
    res.status(201).json(novoTratamento);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Tratamento.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const tratamentoAtualizado = await Tratamento.findByPk(req.params.id);
      res.json(tratamentoAtualizado);
    } else {
      res.status(404).json({ erro: 'Tratamento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.errors ? err.errors.map(e => e.message) : err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Tratamento.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ erro: 'Tratamento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.errors ? err.errors.map(e => e.message) : err.message });
  }
};

const { Procedimento } = require('../models');

// Listar procedimentos de um tratamento
exports.getPorTratamento = async (req, res) => {
  try {
    const procedimentos = await Procedimento.findAll({
      where: { tratamentoId: req.params.tratamentoId }
    });
    res.json(procedimentos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Criar procedimento vinculado a um tratamento
exports.criar = async (req, res) => {
  try {
    if (!req.body.tratamentoId) {
      return res.status(400).json({ erro: "tratamentoId é obrigatório" });
    }
    const novoProcedimento = await Procedimento.create(req.body);
    res.status(201).json(novoProcedimento);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// Atualizar procedimento pelo id
exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Procedimento.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const procedimentoAtualizado = await Procedimento.findByPk(req.params.id);
      res.json(procedimentoAtualizado);
    } else {
      res.status(404).json({ erro: 'Procedimento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.errors ? err.errors.map(e => e.message) : err.message });
  }
};

// Deletar procedimento pelo id
exports.deletar = async (req, res) => {
  try {
    const deleted = await Procedimento.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ erro: 'Procedimento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.errors ? err.errors.map(e => e.message) : err.message });
  }
};

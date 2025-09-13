const { Procedimento } = require('../models');

exports.get = async (req, res) => {
  try {
    const procedimentos = await Procedimento.findAll();
    res.json(procedimentos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.post = async (req, res) => {
  try {
    const novoProcedimento = await Procedimento.create(req.body);
    res.status(201).json(novoProcedimento);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.patch = async (req, res) => {
  try {
    const procedimento = await Procedimento.findByPk(req.params.id);
    if (!procedimento) return res.status(404).json({ erro: "Procedimento não encontrado" });

    await procedimento.update(req.body);
    res.json(procedimento);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Procedimento.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ mensagem: "Procedimento removido com sucesso" });
    } else {
      res.status(404).json({ erro: "Procedimento não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

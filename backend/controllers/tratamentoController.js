const { Tratamento } = require('../models');

exports.get = async (req, res) => {
  try {
    const tratamentos = await Tratamento.findAll();
    res.json(tratamentos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.post = async (req, res) => {
  try {
    const novoTratamento = await Tratamento.create(req.body);
    res.status(201).json(novoTratamento);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.patch = async (req, res) => {
  try {
    const tratamento = await Tratamento.findByPk(req.params.id);
    if (!tratamento) return res.status(404).json({ erro: "Tratamento não encontrado" });

    await tratamento.update(req.body);
    res.json(tratamento);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Tratamento.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ mensagem: "Tratamento removido com sucesso" });
    } else {
      res.status(404).json({ erro: "Tratamento não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
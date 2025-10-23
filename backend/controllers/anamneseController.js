const { Anamnese } = require('../models');

exports.get = async (res) => {
  try {
    const anamneses = await Anamnese.findAll();
    res.json(anamneses);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.post = async (req, res) => {
  try {
    const novoAnamnese = await Anamnese.create(req.body);
    res.status(201).json(Anamnese);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.patch = async (req, res) => {
  try {
    const anamnese = await Anamnese.findByPk(req.params.id);
    if (!anamnese) return res.status(404).json({ erro: "Anamnese não encontrado" });

    await anamnese.update(req.body);
    res.json(anamnese);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Anamnese.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ mensagem: "Anamnese removido com sucesso" });
    } else {
      res.status(404).json({ erro: "Anamnese não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
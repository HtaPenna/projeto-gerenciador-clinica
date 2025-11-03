const { Anamnese } = require('../models');

exports.get = async (req, res) => {
  try {
    const anamneses = await Anamnese.findAll();
    res.json(anamneses);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.getById = async (req, res) => {
  const { pacienteId } = req.params;
  try {
    const anamnese = await Anamnese.findOne({ where: { pacienteId } });
    if (!anamnese) return res.status(404).json({ msg: "Anamnese não encontrada" });
    res.json(anamnese);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.post = async (req, res) => {
  try {
    const novaAnamnese = await Anamnese.create(req.body);
    res.status(201).json(novaAnamnese);
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
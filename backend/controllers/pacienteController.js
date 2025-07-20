const { Paciente } = require('../models');

exports.getTodos = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novoPaciente = await Paciente.create(req.body);
    res.status(201).json(novoPaciente);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ erro: "Paciente não encontrado" });

    await paciente.update(req.body);
    res.json(paciente);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Paciente.destroy({ where: { Codigo_Pac: req.params.id } });
    if (deleted) {
      res.json({ mensagem: "Paciente removido com sucesso" });
    } else {
      res.status(404).json({ erro: "Paciente não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

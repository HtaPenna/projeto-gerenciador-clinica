const pacientes = require("../models/pacienteMock");

exports.getTodos = (req, res) => {
  res.json(pacientes);
};

exports.criar = (req, res) => {
  const novoPaciente = { id: pacientes.length + 1, ...req.body };
  pacientes.push(novoPaciente);
  res.status(201).json(novoPaciente);
};

exports.atualizar = (req, res) => {
  const paciente = pacientes.find(p => p.id == req.params.id);
  if (!paciente) return res.status(404).json({ erro: "Paciente não encontrado" });

  Object.assign(paciente, req.body);
  res.json(paciente);
};

exports.deletar = (req, res) => {
  const index = pacientes.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ erro: "Paciente não encontrado" });

  pacientes.splice(index, 1);
  res.json({ mensagem: "Paciente removido com sucesso" });
};

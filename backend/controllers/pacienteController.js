const { Paciente, Tratamento, Usuario} = require('../models');

exports.get = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.post = async (req, res) => {
  try {
    const novoPaciente = await Paciente.create(req.body);
    res.status(201).json(novoPaciente);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.patch = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ erro: "Paciente não encontrado" });

    await paciente.update(req.body);
    res.json(paciente);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Paciente.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ mensagem: "Paciente removido com sucesso" });
    } else {
      res.status(404).json({ erro: "Paciente não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};


exports.verificar = async (req, res) => {
  try {
    const { cpf } = req.query;

    const paciente = await Paciente.findOne({ where: { cpf } });

    if (!paciente) {
      return res.json({ message: "Paciente não encontrado, pode cadastrar paciente e usuário", step: "novoPaciente" });
    }

    // Paciente existe, verificar se já tem usuário vinculado
    const usuarioExistente = await Usuario.findOne({ where: { id: paciente.userId } });

    if (usuarioExistente) {
      return res.status(400).json({ erro: "Paciente já possui usuário cadastrado" });
    }

    // Paciente existe mas não tem usuário
    return res.json({ message: "Paciente existe, mas não tem usuário vinculado. Pode criar usuário.", step: "criarUsuario" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Buscar todos os tratamentos de um paciente
exports.getTratamentos = async (req, res) => {
  try {
    const pacienteId = req.params.pacienteId; 
    const paciente = await Paciente.findByPk(pacienteId, {
      include: { model: Tratamento, as: 'tratamentos' }
    });
    
    if (paciente) {
      res.json(paciente.tratamentos); 
    } else {
      res.status(404).json({ erro: 'Paciente não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

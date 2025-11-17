const { Anamnese, Paciente, Dentista } = require('../models');

exports.get = async (req, res) => {
  try {
    // Só anamneses dos pacientes do dentista logado
    const anamneses = await Anamnese.findAll({
      include: [{
        model: Paciente,
        as: 'paciente',
        where: { dentistaId: req.dentista.id }
      }]
    });
    res.json(anamneses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  const { pacienteId } = req.params;
  try {
    // Verifica se paciente pertence ao dentista
    const paciente = await Paciente.findOne({
      where: { 
        id: pacienteId,
        dentistaId: req.dentista.id 
      }
    });

    if (!paciente) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    const anamnese = await Anamnese.findOne({ 
      where: { pacienteId } 
    });
    
    if (!anamnese) {
      return res.status(404).json({ error: "Anamnese não encontrada" });
    }
    
    res.json(anamnese);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.post = async (req, res) => {
  try {
    // Verifica se paciente pertence ao dentista
    const paciente = await Paciente.findOne({
      where: { 
        id: req.body.pacienteId,
        dentistaId: req.dentista.id 
      }
    });

    if (!paciente) {
      return res.status(403).json({ error: "Paciente não pertence ao dentista" });
    }

    const novaAnamnese = await Anamnese.create(req.body);
    res.status(201).json(novaAnamnese);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.patch = async (req, res) => {
  try {
    // Verifica se anamnese pertence ao dentista
    const anamnese = await Anamnese.findOne({
      where: { id: req.params.id },
      include: [{
        model: Paciente,
        as: 'paciente',
        where: { dentistaId: req.dentista.id }
      }]
    });

    if (!anamnese) {
      return res.status(404).json({ error: "Anamnese não encontrada" });
    }

    await anamnese.update(req.body);
    res.json(anamnese);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    // Verifica se anamnese pertence ao dentista
    const deleted = await Anamnese.destroy({
      where: { id: req.params.id },
      include: [{
        model: Paciente,
        as: 'paciente', 
        where: { dentistaId: req.dentista.id }
      }]
    });
    
    if (deleted) {
      res.json({ message: "Anamnese removida com sucesso" });
    } else {
      res.status(404).json({ error: "Anamnese não encontrada" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
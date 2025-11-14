const { Tratamento, Procedimento, Paciente } = require('../models');

exports.getTodos = async (req, res) => {
  try {
    const tratamentos = await Tratamento.findAll({
      include: [{
        model: Paciente,
        as: 'paciente',
        where: { dentistaId: req.dentista.id }
      }]
    });
    res.json(tratamentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTratamentos = async (req, res) => {
  try {
    const pacienteId = req.params.pacienteId; 
    
    const paciente = await Paciente.findOne({
      where: { 
        id: pacienteId,
        dentistaId: req.dentista.id 
      },
      include: { 
        model: Tratamento, 
        as: 'tratamento' 
      }
    });
    
    if (paciente) {
      res.json(paciente.tratamento); 
    } else {
      res.status(404).json({ error: 'Paciente não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const paciente = await Paciente.findOne({
      where: { 
        id: req.body.pacienteId,
        dentistaId: req.dentista.id 
      }
    });
    
    if (!paciente) {
      return res.status(403).json({ error: 'Paciente não pertence ao dentista' });
    }

    const novoTratamento = await Tratamento.create(req.body);
    res.status(201).json(novoTratamento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Tratamento.update(req.body, {
      where: { id: req.params.id },
      include: [{
        model: Paciente,
        as: 'paciente',
        where: { dentistaId: req.dentista.id }
      }]
    });
    
    if (updated) {
      const tratamentoAtualizado = await Tratamento.findByPk(req.params.id);
      res.json(tratamentoAtualizado);
    } else {
      res.status(404).json({ error: 'Tratamento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Tratamento.destroy({
      where: { id: req.params.id },
      include: [{
        model: Paciente,
        as: 'paciente',
        where: { dentistaId: req.dentista.id }
      }]
    });    
    
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Tratamento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProcedimentos = async (req, res) => {
  try {
    const tratamentoId = req.params.tratamentoId;
    const tratamento = await Tratamento.findOne({
      where: { id: tratamentoId },
      include: [{
        model: Paciente,
        as: 'paciente',
        where: { dentistaId: req.dentista.id }
      }]
    });
    
    if (tratamento) {
      const procedimentos = await Procedimento.findAll({
        where: { tratamentoId: tratamento.id }
      });
      res.json(procedimentos); 
    } else {
      res.status(404).json({ error: 'Tratamento não encontrado' });
    }   
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
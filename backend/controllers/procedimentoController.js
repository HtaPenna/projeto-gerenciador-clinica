const { Procedimento, Tratamento, Paciente } = require('../models');

exports.getPorTratamento = async (req, res) => {
  try {
    const procedimentos = await Procedimento.findAll({
      where: { tratamentoId: req.params.tratamentoId },
      include: [{
        model: Tratamento,
        as: 'tratamento',
        include: [{
          model: Paciente,
          as: 'paciente',
          where: { dentistaId: req.dentista.id }
        }]
      }]
    });
    res.json(procedimentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    if (!req.body.tratamentoId) {
      return res.status(400).json({ error: "tratamentoId é obrigatório" });
    }
    
    const novoProcedimento = await Procedimento.create(req.body);
    res.status(201).json(novoProcedimento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Procedimento.update(req.body, {
      where: { id: req.params.id },
      include: [{
        model: Tratamento,
        as: 'tratamento', 
        include: [{
          model: Paciente,
          as: 'paciente',
          where: { dentistaId: req.dentista.id }
        }]
      }]
    });
    
    if (updated) {
      const procedimentoAtualizado = await Procedimento.findByPk(req.params.id);
      res.json(procedimentoAtualizado);
    } else {
      res.status(404).json({ error: 'Procedimento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Procedimento.destroy({
      where: { id: req.params.id },
      include: [{
        model: Tratamento,
        as: 'tratamento',
        include: [{
          model: Paciente, 
          as: 'paciente',
          where: { dentistaId: req.dentista.id }
        }]
      }]
    });
    
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Procedimento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
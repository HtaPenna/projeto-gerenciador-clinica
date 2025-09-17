const { Evento } = require('../models');

exports.getTodos = async (req, res) => {
  try {
    const eventos = await Evento.findAll();
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novoEvento = await Evento.create(req.body);
    res.status(201).json(novoEvento);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Evento.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const eventoAtualizado = await Evento.findByPk(req.params.id);
      res.json(eventoAtualizado);
    } else {
      res.status(404).json({ erro: 'Evento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Evento.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ erro: 'Evento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criarComProcedimentos = async (req, res) => {
  try {
    const { inicio, fim, pacienteId, dentistaId, status, valorPrevisto, observacoes, procedimentos } = req.body;

    const evento = await Evento.create({ inicio, fim, pacienteId, dentistaId, status, valorPrevisto, observacoes });

    if (procedimentos && procedimentos.length > 0) {
      await evento.addProcedimentos(procedimentos); // procedimentos = array de IDs
    }

    res.status(201).json(evento);
  } catch (err) {
    res.status(500).json({ erro: err.errors ? err.errors.map(e => e.message) : err.message });
  }
};

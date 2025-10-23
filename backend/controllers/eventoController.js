const { Evento, Procedimento, Paciente } = require('../models');

exports.get = async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      include: [
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['id', 'nome'],
        },
      ],
      order: [['inicio', 'ASC']],
    });
    res.json(eventos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
};

exports.post = async (req, res) => {
  try {
    const novoEvento = await Evento.create(req.body);
    res.status(201).json(novoEvento);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.patch = async (req, res) => {
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

exports.delete = async (req, res) => {
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

// Buscar todos os procedimentos de um evento
exports.getProcedimentos = async (req, res) => {
  try {
    const eventoId = req.params.eventoId;
    const evento = await Evento.findByPk(eventoId, {
      include: { model: Procedimento, as: 'procedimentos' }
    }); 
    if (evento) {
      res.json(evento.procedimentos); 
    } else {
      res.status(404).json({ erro: 'Evento não encontrado' });
    }   
  } 
  catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
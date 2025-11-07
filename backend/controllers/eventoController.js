const { Evento, Tratamento, Procedimento, Paciente } = require('../models');

exports.get = async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      include: [
          { model: Paciente, as: "paciente" },
          { model: Tratamento, as: "tratamento" },
          { model: Procedimento, as: "procedimento" }
        
      ],
      order: [['inicio', 'ASC']],
    });
    res.json(eventos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
};

exports.getByPacienteId = async (req, res) => {
  const { pacienteId } = req.params;

  if (!pacienteId) return res.status(400).json({ erro: "PacienteId é obrigatório" });

  try {
    const eventos = await Evento.findAll({
      where: { pacienteId },
      include: [
        { model: Tratamento, as: 'tratamento' },  // Assumindo alias 'tratamento'
        { model: Procedimento, as: 'procedimento' } // Assumindo alias 'procedimento'
      ],
      order: [['inicio', 'ASC']],
    });

    res.json(eventos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar eventos" });
  }
};

exports.getByProcedimentoId = async (req, res) => {
  try {
    const { procedimentoId } = req.params;

    const evento = await Evento.findOne({
      where: { procedimentoId },
      attributes: ['id', 'inicio', 'fim', 'status', 'observacoes']
    });

    if (!evento) {
      return res.status(404).json({ mensagem: 'Nenhum evento encontrado para este procedimento' });
    }

    res.json(evento);
  } catch (err) {
    res.status(500).json({ erro: err.message });
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
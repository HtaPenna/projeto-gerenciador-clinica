const { Evento, Tratamento, Procedimento, Paciente } = require('../models');
const { Op } = require('sequelize');

exports.get = async (req, res) => {
  try {
    console.log("🔍 DEBUG EVENTOS:", {
      dentistaLogado: req.dentista.id,
      userLogado: req.user.id
    });
    const eventos = await Evento.findAll({
      where: { dentistaId: req.dentista.id },
      include: [
        { model: Paciente, as: "paciente" },
        { model: Tratamento, as: "tratamento" },
        { model: Procedimento, as: "procedimento" }
      ],
      order: [['inicio', 'ASC']],
    });
    console.log("🔍 EVENTOS ENCONTRADOS:", eventos.map(e => ({ id: e.id, dentistaId: e.dentistaId })));
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
};

exports.getByPacienteId = async (req, res) => {
  const { pacienteId } = req.params;

  if (!pacienteId) {
    return res.status(400).json({ error: "PacienteId é obrigatório" });
  }

  try {
    const eventos = await Evento.findAll({
      where: { 
        pacienteId,
        dentistaId: req.dentista.id
      },
      include: [
        { model: Tratamento, as: 'tratamento' },
        { model: Procedimento, as: 'procedimento' }
      ],
      order: [['inicio', 'ASC']],
    });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
};

exports.getByProcedimentoId = async (req, res) => {
  try {
    const { procedimentoId } = req.params;
    const evento = await Evento.findOne({
      where: { 
        procedimentoId,
        dentistaId: req.dentista.id
      },
      attributes: ['id', 'inicio', 'fim', 'status', 'observacoes']
    });

    if (!evento) {
      return res.status(404).json({ error: 'Nenhum evento encontrado para este procedimento' });
    }
    res.json(evento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.post = async (req, res) => {
  try {
    const { inicio, fim, dentistaId } = req.body;

    const conflito = await Evento.findOne({
      where: {
        dentistaId: req.dentista.id,
        [Op.or]: [
          // Início dentro de outro agendamento
          { inicio: { [Op.between]: [inicio, fim] } },
          // Fim dentro de outro agendamento  
          { fim: { [Op.between]: [inicio, fim] } },
          // Agendamento engloba outro
          { inicio: { [Op.lte]: inicio }, fim: { [Op.gte]: fim } }
        ]
      }
    });

    if (conflito) {
      return res.status(409).json({ 
        error: "Conflito de horário", 
        conflitoCom: {
          id: conflito.id,
          inicio: conflito.inicio,
          fim: conflito.fim,
          paciente: conflito.paciente?.nome
        }
      });
    }

    const eventoData = {
      ...req.body,
      dentistaId: req.dentista.id
    };

    const novoEvento = await Evento.create(eventoData);
    res.status(201).json(novoEvento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.patch = async (req, res) => {
  try {
    const [updated] = await Evento.update(req.body, {
      where: { 
        id: req.params.id,
        dentistaId: req.dentista.id
      },
    });

    if (updated) {
      const eventoAtualizado = await Evento.findOne({
        where: { 
          id: req.params.id,
          dentistaId: req.dentista.id
        }
      });

      if (req.body.status?.toLowerCase() === "concluída" && eventoAtualizado.procedimentoId) {
        await Procedimento.update(
          { status: "concluído" },
          { where: { id: eventoAtualizado.procedimentoId } }
        );
      }

      res.json(eventoAtualizado);
    } else {
      res.status(404).json({ error: "Evento não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Evento.destroy({
      where: { 
        id: req.params.id,
        dentistaId: req.dentista.id
      } 
    });
    
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Evento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProcedimentos = async (req, res) => {
  try {
    const eventoId = req.params.eventoId;
    const evento = await Evento.findOne({
      where: { 
        id: eventoId,
        dentistaId: req.dentista.id
      },
      include: { model: Procedimento, as: 'procedimentos' }
    }); 
    
    if (evento) {
      res.json(evento.procedimentos); 
    } else {
      res.status(404).json({ error: 'Evento não encontrado' });
    }   
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
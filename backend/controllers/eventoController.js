const { Evento, Procedimento, Paciente, EventosEprocedimentos } = require('../models');

exports.getTodos = async (req, res) => {
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

// =================== RELACIONAMENTO Evento ↔ Procedimentos ===================

// Cria um evento com procedimentos associados
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

// Buscar todos os procedimentos de um evento
exports.getProcedimentos = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id, {
      include: {
        model: Procedimento,
        through: { attributes: ['status', 'quantidade', 'valor', 'observacoes'] }
      }
    });

    if (evento) {
      res.json(evento.Procedimentos);
    } else {
      res.status(404).json({ erro: 'Evento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Associar um procedimento existente ao evento
exports.addProcedimento = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    const procedimento = await Procedimento.findByPk(req.body.procedimentoId);

    if (evento && procedimento) {
      await evento.addProcedimento(procedimento, {
        through: {
          status: req.body.status || 'pendente',
          quantidade: req.body.quantidade || 1,
          valor: req.body.valor || 0.00,
          observacoes: req.body.observacoes || null
        }
      });
      res.json({ mensagem: 'Procedimento associado ao evento com sucesso' });
    } else {
      res.status(404).json({ erro: 'Evento ou Procedimento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Atualizar dados extras do relacionamento Evento ↔ Procedimento
exports.updateProcedimento = async (req, res) => {
  try {
    const { id } = req.params; // id do evento
    const { procedimentoId, status, quantidade, valor, observacoes } = req.body;

    // Verifica se evento e procedimento existem
    const evento = await Evento.findByPk(id);
    const procedimento = await Procedimento.findByPk(procedimentoId);

    if (!evento || !procedimento) {
      return res.status(404).json({ erro: 'Evento ou Procedimento não encontrado' });
    }

    // Atualiza o relacionamento na tabela intermediária
    const [updated] = await EventosEprocedimentos.update(
      { status, quantidade, valor, observacoes },
      { where: { eventoId: id, procedimentoId } }
    );

    if (updated) {
      const relacaoAtualizada = await EventosEprocedimentos.findOne({
        where: { eventoId: id, procedimentoId }
      });
      res.json(relacaoAtualizada);
    } else {
      res.status(404).json({ erro: 'Associação não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Remover associação de um procedimento do evento
exports.removeProcedimento = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    const procedimento = await Procedimento.findByPk(req.body.procedimentoId);

    if (evento && procedimento) {
      await evento.removeProcedimento(procedimento);
      res.json({ mensagem: 'Associação removida com sucesso' });
    } else {
      res.status(404).json({ erro: 'Evento ou Procedimento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
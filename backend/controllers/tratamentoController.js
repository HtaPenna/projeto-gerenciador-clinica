const { Tratamento, Procedimento, TratamentosEprocedimentos } = require('../models');

exports.getTodos = async (req, res) => {
  try {
    const tratamentos = await Tratamento.findAll();
    res.json(tratamentos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novoTratamento = await Tratamento.create(req.body);
    res.status(201).json(novoTratamento);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Tratamento.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const tratamentoAtualizado = await Tratamento.findByPk(req.params.id);
      res.json(tratamentoAtualizado);
    } else {
      res.status(404).json({ erro: 'Tratamento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.errors ? err.errors.map(e => e.message) : err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Tratamento.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ erro: 'Tratamento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.errors ? err.errors.map(e => e.message) : err.message });
  }
};

// Cria um tratamento com procedimentos associados
exports.criarComProcedimentos = async (req, res) => {
  try {
    const { nome, descricao, status, observacoes, valorPrevisto, procedimentos } = req.body;

    // cria o tratamento
    const tratamento = await Tratamento.create({ nome, descricao, status, valorPrevisto, observacoes });

    // associa os procedimentos (se enviados)
    if (procedimentos && procedimentos.length > 0) {
      // procedimentos = array de objetos { id: procedimentoId, ordem: 1, observacoes: '...' }
      for (const p of procedimentos) {
        await tratamento.addProcedimento(p.id, {
          through: {
            observacoes: p.observacoes || null,
            ordem: p.ordem || null
          }
        });
      }
    }

    res.status(201).json(tratamento);
  } catch (err) {
    res.status(500).json({ erro: err.errors ? err.errors.map(e => e.message) : err.message });
  }
};

// Listar todos os procedimentos de um tratamento
exports.getProcedimentos = async (req, res) => {
  try {
    const tratamento = await Tratamento.findByPk(req.params.id, {
      include: {
        model: Procedimento,
        through: { attributes: ['ordem'] },
        order: [['TratamentosEprocedimentos', 'ordem', 'ASC']]
      }
    });

    if (tratamento) {
      res.json(tratamento.Procedimentos);
    } else {
      res.status(404).json({ erro: 'Tratamento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Associar um procedimento existente ao tratamento
exports.addProcedimento = async (req, res) => {
  try {
    const tratamento = await Tratamento.findByPk(req.params.id);
    const procedimento = await Procedimento.findByPk(req.body.procedimentoId);

    if (tratamento && procedimento) {
      await tratamento.addProcedimento(procedimento, {
        through: {
          observacoes: req.body.observacoes || null,
          ordem: req.body.ordem !== undefined ? req.body.ordem : null
        }
      });
      res.json({ mensagem: 'Procedimento associado ao tratamento com sucesso' });
    } else {
      res.status(404).json({ erro: 'Tratamento ou Procedimento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Atualizar dados extras do relacionamento Tratamento ↔ Procedimento
exports.updateProcedimento = async (req, res) => {
  try {
    const { id } = req.params; // id do tratamento
    const { procedimentoId, observacoes, ordem } = req.body;

    const tratamento = await Tratamento.findByPk(id);
    const procedimento = await Procedimento.findByPk(procedimentoId);

    if (!tratamento || !procedimento) {
      return res.status(404).json({ erro: 'Tratamento ou Procedimento não encontrado' });
    }

    const [updated] = await TratamentosEprocedimentos.update(
      { observacoes, ordem },
      { where: { tratamentoId: id, procedimentoId } }
    );

    if (updated) {
      const relacaoAtualizada = await TratamentosEprocedimentos.findOne({
        where: { tratamentoId: id, procedimentoId }
      });
      res.json(relacaoAtualizada);
    } else {
      res.status(404).json({ erro: 'Associação não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Remover associação de um procedimento do tratamento
exports.removeProcedimento = async (req, res) => {
  try {
    const tratamento = await Tratamento.findByPk(req.params.id);
    const procedimento = await Procedimento.findByPk(req.body.procedimentoId);

    if (tratamento && procedimento) {
      await tratamento.removeProcedimento(procedimento);
      res.json({ mensagem: 'Associação removida com sucesso' });
    } else {
      res.status(404).json({ erro: 'Tratamento ou Procedimento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

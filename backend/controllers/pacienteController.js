const { Paciente, Tratamento, PacientesEtratamentos} = require('../models');

exports.getTodos = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novoPaciente = await Paciente.create(req.body);
    res.status(201).json(novoPaciente);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ erro: "Paciente não encontrado" });

    await paciente.update(req.body);
    res.json(paciente);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
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

// =================== RELACIONAMENTO Pacientes ↔ Tratamentos ===================

// Buscar todos os tratamentos de um paciente
exports.getTratamentos = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id, {
      include: {
        model: Tratamento,
        through: { attributes: ['status', 'dataInicio', 'dataFim'] }
      }
    });

    if (paciente) {
      res.json(paciente.Tratamentos);
    } else {
      res.status(404).json({ erro: 'Paciente não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Associar um tratamento existente ao paciente
exports.addTratamento = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    const tratamento = await Tratamento.findByPk(req.body.tratamentoId);

    if (paciente && tratamento) {
      await paciente.addTratamento(tratamento, {
        through: {
          status: req.body.status || 'ativo',
          dataInicio: req.body.dataInicio || new Date(),
          dataFim: req.body.dataFim || null
        }
      });
      res.json({ mensagem: 'Tratamento associado ao paciente com sucesso' });
    } else {
      res.status(404).json({ erro: 'Paciente ou Tratamento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Criar tratamento e já associar ao paciente
exports.createTratamento = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);

    if (paciente) {
      const novoTratamento = await paciente.createTratamento(req.body, {
        through: {
          status: req.body.status || 'planejado',
          dataInicio: req.body.dataInicio || new Date(),
          dataFim: req.body.dataFim || null
        }
      });
      res.status(201).json(novoTratamento);
    } else {
      res.status(404).json({ erro: 'Paciente não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Editar dados extras do relacionamento Paciente ↔ Tratamento
exports.updateTratamento = async (req, res) => {
  try {
    const { id } = req.params; // id do paciente
    const { tratamentoId, status, dataInicio, dataFim } = req.body;

    // Verifica se paciente e tratamento existem
    const paciente = await Paciente.findByPk(id);
    const tratamento = await Tratamento.findByPk(tratamentoId);

    if (!paciente || !tratamento) {
      return res.status(404).json({ erro: 'Paciente ou Tratamento não encontrado' });
    }

    // Atualiza o relacionamento na tabela intermediária
    const [updated] = await PacientesEtratamentos.update(
      { status, dataInicio, dataFim },
      { where: { pacienteId: id, tratamentoId } }
    );

    if (updated) {
      const relacaoAtualizada = await PacientesEtratamentos.findOne({
        where: { pacienteId: id, tratamentoId }
      });
      res.json(relacaoAtualizada);
    } else {
      res.status(404).json({ erro: 'Associação não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Remover associação de um tratamento do paciente
exports.removeTratamento = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    const tratamento = await Tratamento.findByPk(req.body.tratamentoId);

    if (paciente && tratamento) {
      await paciente.removeTratamento(tratamento);
      res.json({ mensagem: 'Associação removida com sucesso' });
    } else {
      res.status(404).json({ erro: 'Paciente ou Tratamento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
const { Especialidade } = require('../models');

exports.getTodos = async (req, res) => {
  try {
    const especialidade = await Especialidade.findAll();
    res.json(especialidade);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novaEspecialidade = await Especialidade.create(req.body);
    res.status(201).json(novaEspecialidade);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Especialidade.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const especialidadeAtualizada = await Categoria.findByPk(req.params.id);
      res.json(especialidadeAtualizada);
    } else {
      res.status(404).json({ erro: 'Especialidade não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Especialidade.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ erro: 'Especialidade não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

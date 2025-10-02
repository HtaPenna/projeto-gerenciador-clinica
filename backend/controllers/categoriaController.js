const { Categoria } = require('../models');

exports.getTodos = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novaCategoria = await Categoria.create(req.body);
    res.status(201).json(novaCategoria);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Categoria.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const categoriaAtualizada = await Categoria.findByPk(req.params.id);
      res.json(categoriaAtualizada);
    } else {
      res.status(404).json({ erro: 'Categoria não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Categoria.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ erro: 'Categoria não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

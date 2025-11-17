const { Suprimento } = require('../models');

exports.getTodos = async (req, res) => {
  try {
    const suprimentos = await Suprimento.findAll({
      where: { dentistaId: req.dentista.id },
      order: [['Nome_Sup', 'ASC']],
    });
    res.json(suprimentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const suprimentoData = {
      ...req.body,
      dentistaId: req.dentista.id
    };

    const novoSuprimento = await Suprimento.create(suprimentoData);
    res.status(201).json(novoSuprimento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Suprimento.update(req.body, {
      where: { 
        id: req.params.id,
        dentistaId: req.dentista.id 
      }
    });
    
    if (updated) {
      const suprimentoAtualizado = await Suprimento.findOne({
        where: { 
          id: req.params.id,
          dentistaId: req.dentista.id 
        }
      });
      res.json(suprimentoAtualizado);
    } else {
      res.status(404).json({ error: 'Suprimento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Suprimento.destroy({ 
      where: { 
        id: req.params.id,
        dentistaId: req.dentista.id 
      } 
    });
    
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Suprimento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
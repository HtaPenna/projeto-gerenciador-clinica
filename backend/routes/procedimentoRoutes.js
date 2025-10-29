const express = require("express");
const router = express.Router();
const procedimentoController = require("../controllers/procedimentoController");

// Rotas CRUD para Procedimentos
// Listar procedimentos de um tratamento
router.get('/tratamentos/:tratamentoId/procedimentos', procedimentoController.getPorTratamento);

// Criar procedimento vinculado a um tratamento
router.post('/procedimentos', procedimentoController.criar);

// Atualizar procedimento pelo id
router.patch('/procedimentos/:id', procedimentoController.atualizar);

// Deletar procedimento pelo id
router.delete('/procedimentos/:id', procedimentoController.deletar);

module.exports = router;

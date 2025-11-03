const express = require("express");
const router = express.Router();
const procedimentoController = require("../controllers/procedimentoController");

// Rotas CRUD para Procedimentos
// Listar procedimentos de um tratamento
router.get('/tratamento/:tratamentoId', procedimentoController.getPorTratamento);

// Criar procedimento vinculado a um tratamento
router.post('/', procedimentoController.criar);

// Atualizar procedimento pelo id
router.patch('/:id', procedimentoController.atualizar);

// Deletar procedimento pelo id
router.delete('/:id', procedimentoController.deletar);

module.exports = router;

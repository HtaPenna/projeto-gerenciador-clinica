const express = require("express");
const router = express.Router();
const tratamentoController = require("../controllers/tratamentoController");

// Rotas CRUD para Tratamentos
router.get("/", tratamentoController.getTodos);          // GET /tratamentos
router.get('/:pacienteId', tratamentoController.getTratamentos);  // GET /tratamentos/:id
router.post("/", tratamentoController.criar);            // POST /tratamentos
router.patch("/:id", tratamentoController.atualizar);    // PATCH /tratamentos/:id
router.delete("/:id", tratamentoController.deletar);     // DELETE /tratamentos/:id

// Rotas para gerenciar procedimentos de um tratamento
router.get("/:id/procedimentos", tratamentoController.getProcedimentos);       // GET /tratamentos/:id/procedimentos

module.exports = router;

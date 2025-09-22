const express = require("express");
const router = express.Router();
const tratamentoController = require("../controllers/tratamentoController");

// Rotas CRUD para Tratamentos
router.get("/", tratamentoController.getTodos);          // GET /tratamentos
router.post("/", tratamentoController.criar);            // POST /tratamentos
router.patch("/:id", tratamentoController.atualizar);    // PATCH /tratamentos/:id
router.delete("/:id", tratamentoController.deletar);     // DELETE /tratamentos/:id

// Rotas para gerenciar procedimentos de um tratamento
router.get("/:id/procedimentos", tratamentoController.getProcedimentos);       // GET /tratamentos/:id/procedimentos
router.post("/:id/procedimentos", tratamentoController.addProcedimento);       // POST /tratamentos/:id/procedimentos
router.patch("/:id/procedimentos", tratamentoController.updateProcedimento);   // PATCH /tratamentos/:id/procedimentos
router.delete("/:id/procedimentos", tratamentoController.removeProcedimento);  // DELETE /tratamentos/:id/procedimentos
router.post("/com-procedimentos", tratamentoController.criarComProcedimentos);

module.exports = router;

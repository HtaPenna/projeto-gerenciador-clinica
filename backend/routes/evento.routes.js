const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/eventoController");

router.get("/", eventoController.getTodos);         // GET /eventos
router.post("/", eventoController.criar);           // POST /eventos
router.patch("/:id", eventoController.atualizar);   // PATCH /eventos/:id
router.delete("/:id", eventoController.deletar);    // DELETE /eventos/:id

// Rotas para gerenciar procedimentos do evento
router.get("/:id/procedimentos", eventoController.getProcedimentos);       // GET /eventos/:id/procedimentos
router.post("/:id/procedimentos", eventoController.addProcedimento);       // POST /eventos/:id/procedimentos
router.patch("/:id/procedimentos", eventoController.updateProcedimento);   // PATCH /eventos/:id/procedimentos
router.delete("/:id/procedimentos", eventoController.removeProcedimento);  // DELETE /eventos/:id/procedimentos
router.post("/com-procedimentos", eventoController.criarComProcedimentos);

module.exports = router;

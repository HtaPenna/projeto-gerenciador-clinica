const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/eventoController");

router.get("/", eventoController.get);         // GET /eventos
router.post("/", eventoController.post);           // POST /eventos
router.patch("/:id", eventoController.patch);   // PATCH /eventos/:id
router.delete("/:id", eventoController.delete);    // DELETE /eventos/:id

// Rotas para gerenciar procedimentos do evento
router.get("/:id/procedimentos", eventoController.getProcedimentos);       // GET /eventos/:id/procedimentos
router.post("/:id/procedimentos", eventoController.addProcedimento);       // POST /eventos/:id/procedimentos
router.patch("/:id/procedimentos", eventoController.updateProcedimento);   // PATCH /eventos/:id/procedimentos
router.delete("/:id/procedimentos", eventoController.removeProcedimento);  // DELETE /eventos/:id/procedimentos
router.post("/com-procedimentos", eventoController.criarComProcedimentos);

module.exports = router;

const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/eventoController");

router.get("/", eventoController.get);         // GET /eventos
router.get("/paciente/:pacienteId", eventoController.getByPacienteId);
router.post("/", eventoController.post);           // POST /eventos
router.patch("/:id", eventoController.patch);   // PATCH /eventos/:id
router.delete("/:id", eventoController.delete);    // DELETE /eventos/:id

// Rotas para gerenciar procedimentos do evento
router.get("/:id/procedimentos", eventoController.getProcedimentos);       // GET /eventos/:id/procedimentos

module.exports = router;

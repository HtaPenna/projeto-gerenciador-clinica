const express = require("express");
const router = express.Router();
const pacienteController = require("../controllers/pacienteController");

router.get("/", pacienteController.get);         // GET /pacientes
router.post("/", pacienteController.post);           // POST /pacientes
router.patch("/:id", pacienteController.patch);   // PATCH /pacientes/:id
router.delete("/:id", pacienteController.delete);    // DELETE /pacientes/:id

// Associações Paciente ↔ Tratamentos
router.get('/:id/tratamentos', pacienteController.getTratamentos);       // GET /pacientes/:id/tratamentos
router.get('/verificar', pacienteController.verificar);       

module.exports = router;
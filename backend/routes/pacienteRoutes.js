const express = require("express");
const router = express.Router();
const pacienteController = require("../controllers/pacienteController");

router.get("/", pacienteController.get);         // GET /pacientes
router.post("/", pacienteController.post);           // POST /pacientes
router.patch("/:id", pacienteController.patch);   // PATCH /pacientes/:id
router.delete("/:id", pacienteController.delete);    // DELETE /pacientes/:id

// Associações Paciente ↔ Tratamentos
router.get('/:id/tratamentos', pacienteController.getTratamentos);        // Listar
router.post('/:id/tratamentos', pacienteController.addTratamento);        // Associar
router.post('/:id/tratamentos/novo', pacienteController.createTratamento); // Criar + Associar
router.put('/:id/tratamentos', pacienteController.updateTratamento);      // Editar associação
router.delete('/:id/tratamentos', pacienteController.removeTratamento);   // Remover

module.exports = router;
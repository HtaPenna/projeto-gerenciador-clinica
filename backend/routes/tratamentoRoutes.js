const express = require("express");
const router = express.Router();
const tratamentoController = require("../controllers/tratamentoController");

// Rotas CRUD para Tratamentos
router.get("/", tratamentoController.getTodos);          // GET /tratamentos
router.post("/", tratamentoController.criar);            // POST /tratamentos
router.patch("/:id", tratamentoController.atualizar);    // PATCH /tratamentos/:id
router.delete("/:id", tratamentoController.deletar);     // DELETE /tratamentos/:id

module.exports = router;

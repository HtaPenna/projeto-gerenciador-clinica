const express = require("express");
const router = express.Router();
const especialidadeController = require("../controllers/especialidadeController");

router.get("/", especialidadeController.getTodos);        // GET /categorias
router.post("/", especialidadeController.criar);          // POST /categorias
router.patch("/:id", especialidadeController.atualizar);  // PATCH /categorias/:id
router.delete("/:id", especialidadeController.deletar);   // DELETE /categorias/:id

module.exports = router;

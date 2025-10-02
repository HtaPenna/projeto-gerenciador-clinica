const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");

router.get("/", categoriaController.getTodos);        // GET /categorias
router.post("/", categoriaController.criar);          // POST /categorias
router.patch("/:id", categoriaController.atualizar);  // PATCH /categorias/:id
router.delete("/:id", categoriaController.deletar);   // DELETE /categorias/:id

module.exports = router;

const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// Rotas CRUD para Tratamentos
router.get("/", usuarioController.get);          // GET /usuarios
router.post("/", usuarioController.post);            // POST /usuarios
router.patch("/:id", usuarioController.patch);    // PATCH /usuarios/:id
router.delete("/:id", usuarioController.delete);     // DELETE /usuarios/:id

router.post('/login', usuarioController.login);         // POST /usuarios/login

module.exports = router;

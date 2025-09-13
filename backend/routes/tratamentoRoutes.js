const express = require("express");
const router = express.Router();
const tratamentoController = require("../controllers/tratamentoController");

router.get("/", tratamentoController.get);     
router.post("/", tratamentoController.post);          
router.patch("/:id", tratamentoController.patch);   
router.delete("/:id", tratamentoController.delete);

module.exports = router;
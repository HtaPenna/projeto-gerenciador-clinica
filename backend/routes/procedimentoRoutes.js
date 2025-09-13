const express = require("express");
const router = express.Router();
const procedimentoController = require("../controllers/procedimentoController");

router.get("/", procedimentoController.get);     
router.post("/", procedimentoController.post);          
router.patch("/:id", procedimentoController.patch);   
router.delete("/:id", procedimentoController.delete);

module.exports = router;
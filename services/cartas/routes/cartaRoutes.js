const express = require('express');
const CartaController = require('../controller/cartaController.js');

const router = express.Router();

router.get('/', CartaController.listar);
router.get('/:id', CartaController.buscar);

module.exports = router;
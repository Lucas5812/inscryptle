const express = require('express');
const CartaController = require('../controller/cartaController.js');

const router = express.Router();

router.get('/', CartaController.listar);

module.exports = router;
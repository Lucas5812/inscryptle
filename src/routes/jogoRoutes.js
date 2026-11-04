const express = require('express');
const JogoController = require('../controller/jogoController.js');

const router = express.Router();

router.post('/', JogoController.palpite);

module.exports = router;
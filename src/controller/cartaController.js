const CartaModel = require('../models/cartaModel.js');

class CartaController {
  static listar(req, res) {
    try {
      res.json(CartaModel.listarCompletas());
    } catch (erro) {
      console.error('Erro ao listar cartas:', erro);
      res.status(500).json({ erro: 'Não foi possível listar as cartas.' });
    }
  }
}

module.exports = CartaController;
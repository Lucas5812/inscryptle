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

  static buscar(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ erro: 'Id inválido.' });
      }

      const carta = CartaModel.buscarCompletaPorId(id);
      if (!carta) {
        return res.status(404).json({ erro: 'Carta não encontrada.' });
      }

      res.json(carta);
    } catch (erro) {
      console.error('Erro ao buscar carta:', erro);
      res.status(500).json({ erro: 'Não foi possível buscar a carta.' });
    }
  }
}

module.exports = CartaController;
const desafioModel = require('../models/desafioModel.js');
const jogoClient = require('../clients/jogoClient.js');

function comparaNumero(palpite, certa) {
  if (palpite === certa) {
    return 'certo';
  }
  if (typeof palpite !== 'number' || typeof certa !== 'number') {
    return 'errado';
  }
  return palpite < certa ? 'maior' : 'menor';
}

function comparaLista(a, b) {
  const emComum = a.filter(function (x) {
    return b.includes(x);
  });
  if (a.length === b.length && emComum.length === a.length) {
    return 'certo';
  }
  return emComum.length ? 'parcial' : 'errado';
}

function compararCartas(palpite, certa) {
  return {
    power: comparaNumero(palpite.power, certa.power),
    health: comparaNumero(palpite.health, certa.health),
    costAmount: comparaNumero(palpite.costAmount, certa.costAmount),
    costType: palpite.costType === certa.costType ? 'certo' : 'errado',
    tribes: comparaLista(palpite.tribes, certa.tribes),
    sigils: comparaLista(palpite.sigils, certa.sigils),
    traits: comparaLista(palpite.traits, certa.traits),
  };
}

async function cartaDoDia() {
  const hoje = desafioModel.dataDeHoje();
  let desafio = desafioModel.buscarPorDia(hoje);

  if (!desafio) {
    const cartas = await jogoClient.listar();
    const sorteada = cartas[Math.floor(Math.random() * cartas.length)];
    try {
        desafioModel.criar(sorteada.id, hoje);
    }
    catch (erro) {

    }
    desafio = desafioModel.buscarPorDia(hoje);
  }

  return jogoClient.buscarCompletaPorId(desafio.CartaID);
}

class JogoController {
  static async palpite(req, res) {
    try {
      const id = Number(req.body && req.body.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ erro: 'Envie o id da carta.' });
      }

      const palpite = await jogoClient.buscarCompletaPorId(id);
      if (!palpite) {
        return res.status(404).json({ erro: 'Carta não encontrada.' });
      }

      const certa = await cartaDoDia();

      res.json({
        acertou: palpite.id === certa.id,
        carta: palpite,
        resultado: compararCartas(palpite, certa),
      });
    } catch (erro) {
      console.error('Erro ao processar palpite:', erro);
      res.status(500).json({ erro: 'Não foi possível processar o palpite.' });
    }
  }
}

module.exports = JogoController;
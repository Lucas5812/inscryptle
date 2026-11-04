const db = require('../config/connection.js');

class desafioModel {

  static dataDeHoje() {
    return new Date().toISOString().slice(0, 10);
  }

  static listarTodas() {
    const sql = "SELECT * FROM DesafiosDiarios";

    return db.prepare(sql).all();
  }

  static buscarPorId(id) {
    const sql = "SELECT * FROM DesafiosDiarios WHERE ID = ?";

    return db.prepare(sql).get(id);
  }

  static buscarPorDia(data) {
    const sql = 'SELECT * FROM DesafiosDiarios WHERE Date = ?';

    return db.prepare(sql).get(data);
  }

  // Cria o desafio de um dia (por padrão, hoje)
  static criar(cartaid, data = desafioModel.dataDeHoje()) {
    const sql = `
    INSERT INTO DesafiosDiarios(Date, CartaID)
    VALUES (?, ?)
    `;

    return db.prepare(sql).run(data, cartaid);
  }

  static atualizar(id, novadata, novacartaId) {
    const sql = `
    UPDATE DesafiosDiarios
    SET Date = ?, CartaID = ?
    WHERE ID = ?
    `;

    return db.prepare(sql).run(novadata, novacartaId, id);
  }

  static excluir(id) {
    const sql = 'DELETE FROM DesafiosDiarios WHERE ID = ?';

    return db.prepare(sql).run(id);
  }
}

console.log("[DEBUG]desafioModel.js carregado");
console.log(desafioModel.listarTodas());

module.exports = desafioModel;
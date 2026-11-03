const db = require('../config/connection.js');

class desafioModel {
  static  listarTodas(){
    const sql = "SELECT * FROM DesafiosDiarios";

    return db.prepare(sql).all();
  }

  static buscarPorId(id){
    const sql = "SELECT * FROM DesafiosDiarios WHERE ID = ?";

    return db.prepare(sql).get(id);
  }

  static buscarPorDia(data){
    const sql = 'SELECT * FROM DesafiosDiarios WHERE Date = ?';

    return db.prepare(sql).get(data)
  }

  static criar(cartaid){
    const dia = new Date()
    const sql = `
    INSERT INTO DesafiosDiarios(Date, CartaID)
    VALUES (?, ?)
    `;

    return db.prepare(sql).run(dia, cartaid);
  }


  static atualizar(id, novadata, novacartaId){
    const sql =`
    UPDATE DesafiosDiarios
    SET Date = ?, CartaID = ?
    WHERE ID = ?
    `;

    return db.prepare(sql).run(novadata, novacartaId, id);
  }

  static excluir(id){
    const sql = 'DELETE FROM DesafiosDiarios WHERE ID = ?';

    return db.prepare(sql).run(id);
  }
}


console.log("[DEBUG]desafioModel.js carregado");
console.log(desafioModel.listarTodas());

module.exports = desafioModel;
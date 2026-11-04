const db = require('../config/connection.js');

class tribosModel {
  static  listarTodas(){
    const sql = "SELECT * FROM Tribos";

    return db.prepare(sql).all();
  }

  static buscarPorId(id){
    const sql = "SELECT * FROM Tribos WHERE ID = ?";

    return db.prepare(sql).get(id);
  }

  static criar(nome, descricao){
    const sql = `
    INSERT INTO Tribos(Name, Description)
    VALUES (?, ?)
    `;

    return db.prepare(sql).run(nome, descricao);
  }


  static atualizar(id, novonome, novadescricao){
    const sql =`
    UPDATE Tribos
    SET Name = ?, Description = ?
    WHERE ID = ?
    `;

    return db.prepare(sql).run(novonome, novadescricao, id);
  }

  static excluir(id){
    const sql = 'DELETE FROM Tribos WHERE ID = ?';

    return db.prepare(sql).run(id);
  }
}

console.log("[DEBUG]tribosModel.js carregado");
console.log(tribosModel.listarTodas());

module.exports = tribosModel;
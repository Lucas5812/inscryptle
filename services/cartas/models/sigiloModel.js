const db = require('../config/connection.js');

class sigiloModel {
  static  listarTodas(){
    const sql = 'SELECT * FROM Sigilos';

    return db.prepare(sql).all();
  }

  static buscarPorId(id){
    const sql = 'SELECT * FROM Sigilos WHERE ID = ?';

    return db.prepare(sql).get(id);
  }

  static criar(nome, descricao){
    const sql = `
    INSERT INTO Sigilos(Name, Description)
    VALUES (?, ?)
    `;

    return db.prepare(sql).run(nome, descricao);
  }


  static atualizar(id, novonome, novadescricao){
    const sql =`
    UPDATE Sigilos
    SET Name = ?, Description = ?
    WHERE ID = ?
    `;

    return db.prepare(sql).run(novonome, novadescricao, id);
  }

  static excluir(id){
    const sql = 'DELETE FROM Sigilos WHERE ID = ?';

    return db.prepare(sql).run(id);
  }
}


console.log("[DEBUG]sigiloModel.js carregado");
console.log(sigiloModel.listarTodas());

module.exports = sigiloModel;
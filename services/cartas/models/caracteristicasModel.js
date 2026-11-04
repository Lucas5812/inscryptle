const db = require('../config/connection.js');

class CaracteristicaModel{
  //Lista todas as características
  static  listarTodas(){
    const sql = 'SELECT * FROM Caracteristicas';

    return db.prepare(sql).all();
  }

  //busca uma caracteristica pelo id
  static buscarPorId(id){
    const sql = 'SELECT * FROM Caracteristicas WHERE ID = ? ';

  return db.prepare(sql).get(id);
  }

  //Cria uma nova característica a partir das informações de nome e descricao
  static criar(nome, descricao){
    const sql = `
    INSERT INTO Caracteristicas(Name, Description)
    VALUES (?, ?)
    `;

    return db.prepare(sql).run(nome, descricao);
  }

  //Edita uma tabela a partir de um id
  static atualizar(id, novonome, novadescricao){
    const sql = `
    UPDATE Caracteristicas
    SET Name = ?, Description = ?
    WHERE Id = ?
    `;

    return db.prepare(sql).run(novonome, novadescricao, id);
  }

  static excluir(id){
    const sql='DELETE FROM Caracteristicas WHERE id = ?';

    return db.prepare(sql).run(id)
  };
}

console.log("[DEBUG]Características.js Carregado");

console.log(CaracteristicaModel.listarTodas());

module.exports = CaracteristicaModel;
const db = require('../config/connection');

class CartaModel {

    // Consultar todas as cartas
    static listarTodas() {
        const sql = 'SELECT * FROM Cartas';

        return db.prepare(sql).all();
    }

    // Consultar uma carta pelo ID
    static buscarPorId(id) {
        const sql = 'SELECT * FROM Cartas WHERE ID = ?';

        return db.prepare(sql).get(id);
    }

    // Cadastrar uma carta
    static criar(nome, poder, vida, custo, tipocusto) {
        const sql = `
            INSERT INTO Cartas (Name, Power, Health, CostAmount, CostType)
            VALUES (?, ?, ?, ?, ?)
        `;

        return db.prepare(sql).run(nome, poder, vida, custo, tipocusto);
    }

    // Atualizar uma carta
    static atualizar(id, nome, poder, vida, custo, tipocusto) {
        const sql = `
            UPDATE Cartas
            SET Name = ?, Power = ?, Health = ?, CostAmount = ?, CostType = ?
            WHERE ID = ?
        `;

        return db.prepare(sql).run(nome, poder, vida, custo, tipocusto, id);
    }

    // Excluir uma carta
    static excluir(id) {
        const sql = 'DELETE FROM Cartas WHERE ID = ?';

        return db.prepare(sql).run(id);
    }

    static adicionarSigilo(cartaID, sigiloID) {
    const sql = `
        INSERT INTO Carta_Sigilo (CartaID, SigiloID)
        VALUES (?, ?)
    `;

    return db.prepare(sql).run(cartaID, sigiloID);
    }
}

console.log("[DEBUG]cartamodel.js carregado");
console.log(CartaModel.listarTodas());

module.exports = CartaModel;
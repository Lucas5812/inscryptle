const db = require('../config/connection');

function agruparPorCarta(linhas) {
    const mapa = new Map();
    for (const linha of linhas) {
        if (!mapa.has(linha.CartaID)) {
            mapa.set(linha.CartaID, []);
        }
        mapa.get(linha.CartaID).push(linha.Name);
    }
    return mapa;
}

function converterPoder(power) {
    const numero = Number(power);
    return Number.isNaN(numero) ? power : numero;
}

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

    static listarCompletas() {
        const cartas = db.prepare('SELECT * FROM Cartas ORDER BY ID').all();

        const tribos = agruparPorCarta(db.prepare(`
            SELECT ct.CartaID, t.Name
            FROM Carta_Tribo ct
            JOIN Tribos t ON t.ID = ct.TriboID
            ORDER BY t.ID
        `).all());

        const sigilos = agruparPorCarta(db.prepare(`
            SELECT cs.CartaID, s.Name
            FROM Carta_Sigilo cs
            JOIN Sigilos s ON s.ID = cs.SigiloID
            ORDER BY s.ID
        `).all());

        const tracos = agruparPorCarta(db.prepare(`
            SELECT cc.CartaID, c.Name
            FROM Carta_Caracteristica cc
            JOIN Caracteristicas c ON c.ID = cc.CaracteristicaID
            ORDER BY c.ID
        `).all());

        return cartas.map(function (c) {
            return {
                id: c.ID,
                nome: c.Name,
                power: converterPoder(c.Power),
                health: c.Health,
                costAmount: c.CostAmount,
                costType: c.CostType,
                tribes: tribos.get(c.ID) || [],
                sigils: sigilos.get(c.ID) || [],
                traits: tracos.get(c.ID) || [],
            };
        });
    }
    
    static buscarCompletaPorId(id) {
        return CartaModel.listarCompletas().find(function (c) {
            return c.id === id;
        });
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
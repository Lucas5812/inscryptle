
const express = require('express');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const db = new DatabaseSync('db/dados_antigos.db');

// Rota para consultar todas as cartas
app.get('/cartas', (req, res) => {
    const cartas = db.prepare(
        'SELECT * FROM Cartas'
    ).all();

    res.json(cartas);
});

// Inicializa o servidor
app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});

const { DatabaseSync } = require('node:sqlite');

// Abre o banco de dados
const db = new DatabaseSync('db/dados_antigos.db');

console.log("Banco conectado!");

// Teste: consulta todas as tabelas existentes
const tabelas = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
`).all();

console.log(tabelas);

const cartas = db.prepare(
    'SELECT * FROM Cartas'
).all();

console.log(cartas);
module.exports = db;
// Fecha a conexão quando terminar de utilizar
//db.close();

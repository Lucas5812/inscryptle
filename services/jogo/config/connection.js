const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

// Este serviço só enxerga o banco do jogo (carta do dia)
const db = new DatabaseSync(path.join(__dirname, '..', '..', '..', 'db', 'jogo.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS DesafiosDiarios (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Date TEXT NOT NULL UNIQUE,
    CartaID INTEGER NOT NULL
  )
`);

module.exports = db;
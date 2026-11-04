const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const pastaDb = path.join(__dirname, '..', 'db');
const origem = path.join(pastaDb, 'dados_antigos.db');
const destinoCartas = path.join(pastaDb, 'cartas.db');
const destinoJogo = path.join(pastaDb, 'jogo.db');

// Não sobrescreve nada sem querer
for (const arquivo of [destinoCartas, destinoJogo]) {
  if (fs.existsSync(arquivo)) {
    console.error(arquivo + ' já existe. Apague-o se quiser refazer.');
    process.exit(1);
  }
}

// 1) Lê os desafios que já existem no banco único
const banco = new DatabaseSync(origem);
const desafios = banco.prepare('SELECT Date, CartaID FROM DesafiosDiarios').all();
banco.close();

// 2) cartas.db = cópia do banco, sem a tabela de desafios
fs.copyFileSync(origem, destinoCartas);
const cartas = new DatabaseSync(destinoCartas);
cartas.exec('DROP TABLE IF EXISTS DesafiosDiarios');
cartas.exec('VACUUM');
cartas.close();

// 3) jogo.db = só os desafios (sem chave estrangeira para Cartas)
const jogo = new DatabaseSync(destinoJogo);
jogo.exec(`
  CREATE TABLE DesafiosDiarios (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Date TEXT NOT NULL UNIQUE,
    CartaID INTEGER NOT NULL
  )
`);
const inserir = jogo.prepare('INSERT INTO DesafiosDiarios (Date, CartaID) VALUES (?, ?)');
for (const d of desafios) {
  inserir.run(d.Date, d.CartaID);
}
jogo.close();

console.log('cartas.db criado e jogo.db criado (' + desafios.length + ' desafio(s) copiado(s)).');
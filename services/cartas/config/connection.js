const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync(path.join(__dirname, '..', '..', '..', 'db', 'cartas.db'));

module.exports = db;
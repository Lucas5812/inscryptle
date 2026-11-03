const path = require('node:path');
const express = require('express');
const cartaRoutes = require('./src/routes/cartaRoutes.js');
const jogoRoutes = require('./src/routes/jogoRoutes.js');

const app = express();
const PORTA = 3000;

// Permite ler JSON enviado no corpo das requisições (req.body)
app.use(express.json());

// Serve o front-end (index.html, script.js, style.css, fontes)
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/cartas', cartaRoutes);
app.use('/palpite', jogoRoutes);

app.listen(PORTA, () => {
  console.log('Servidor iniciado em http://localhost:' + PORTA);
});
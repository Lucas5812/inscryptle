const express = require('express');
const jogoRoutes = require('./routes/jogoRoutes.js');

const app = express();
const porta = process.env.PORT || 3002;

app.use(express.json());
app.use('/palpite', jogoRoutes);

app.listen(porta, () => {
  console.log('Serviço de Jogo em http://localhost:' + porta);
});
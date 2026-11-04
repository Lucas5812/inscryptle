const express = require('express');
const cartaRoutes = require('./routes/cartaRoutes.js');

const app = express();
const porta = process.env.PORT || 3001;

app.use('/cartas', cartaRoutes);

app.listen(porta, (erro) => {
  if (erro) {
    console.error('Não foi possível iniciar o serviço:', erro.message);
    process.exit(1);
  }
  console.log('Serviço de Cartas em http://localhost:' + porta);
});
const path = require('node:path');
const express = require('express');

const app = express()
const porta = process.env.PORT || 3000;
const cartasUrl = process.env.cartasUrl || 'http://localhost:3001';
const jogoUrl = process.env.jogoUrl || 'http://localhost:3002';

function encaminhar(urlBase) {
    return async function (req, res) {
        try {
            const existe = req.method !== 'GET' && req.method !== 'HEAD';
            const resposta = await fetch(urlBase + req.originalUrl, {
                method: req.method,
                headers: {'Content-Type' : 'application/json'},
                body: existe ? JSON.stringify(req.body) : undefined,
            });
            const dados = await resposta.json();
            res.status(resposta.status).json(dados);
        } catch (erro) {
            console.error('Gateway: falha ao falar com ' + urlBase + ':', erro.message);
            res.status(502).json({erro : 'Serviço indisponível.'});
        }
    };
}
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/cartas', encaminhar(cartasUrl));
app.use('/palpite', encaminhar(jogoUrl));

app.listen(porta, (erro) => {
  if (erro) {
    console.error('Não foi possível iniciar o servidor:', erro.message);
    process.exit(1);
  }
  console.log('Servidor iniciado em http://localhost:' + porta);
});
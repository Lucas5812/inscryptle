const { spawn } = require('node:child_process');
const path = require('node:path');

const servicos = [
  { nome: 'cartas', arquivo: 'services/cartas/server.js' },
  { nome: 'jogo', arquivo: 'services/jogo/server.js' },
  { nome: 'gateway', arquivo: 'gateway/server.js' },
];

const processos = [];
let encerrando = false;

function prefixar(nome, stream, destino) {
  let resto = '';
  stream.on('data', function (dados) {
    const linhas = (resto + dados.toString()).split('\n');
    resto = linhas.pop();
    for (const linha of linhas) {
      destino.write('[' + nome + '] ' + linha + '\n');
    }
  });
}

function encerrarTodos(codigo) {
  if (encerrando) {
    return;
  }
  encerrando = true;
  for (const p of processos) {
    p.kill();
  }
  setTimeout(function () {
    process.exit(codigo);
  }, 300);
}

for (const servico of servicos) {
  const p = spawn(process.execPath, [path.join(__dirname, servico.arquivo)], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  prefixar(servico.nome, p.stdout, process.stdout);
  prefixar(servico.nome, p.stderr, process.stderr);

  p.on('exit', function (codigo) {
    if (!encerrando) {
      console.error('[' + servico.nome + '] encerrou (código ' + codigo + '). Encerrando os demais...');
      encerrarTodos(codigo || 1);
    }
  });

  processos.push(p);
}

process.on('SIGINT', function () {
  console.log('\nEncerrando todos os serviços...');
  encerrarTodos(0);
});
process.on('SIGTERM', function () {
  encerrarTodos(0);
});
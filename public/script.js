function semAcento(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalizar(s) {
  return semAcento(s).toLowerCase();
}

async function buscarCartas() {
  const resposta = await fetch('/cartas');
  if (!resposta.ok) {
    throw new Error('Falha ao carregar as cartas');
  }
  return resposta.json();
}

async function enviarPalpite(id) {
  const resposta = await fetch('/palpite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id }),
  });
  if (!resposta.ok) {
    throw new Error('Falha ao enviar o palpite');
  }
  return resposta.json();
}

const input = document.getElementById('ReqCarta');
const sugestoes = document.getElementById('sugestoes');
const botao = document.getElementById('AdvBtn');
const mensagem = document.getElementById('mensagem');
const tbody = document.querySelector('#HistoricoTable tbody');

let cartas = [];
let idSelecionado = null;
let jogoTerminado = false;
const jaChutados = new Set();

// ---------- autocomplete ----------
function selecionarCarta(c) {
  input.value = semAcento(c.nome);
  idSelecionado = c.id;
  sugestoes.style.display = 'none';
}

function mostrarSugestoes() {
  idSelecionado = null;
  sugestoes.innerHTML = '';
  const termo = normalizar(input.value.trim());
  if (!termo) {
    sugestoes.style.display = 'none';
    return;
  }

  const filtradas = cartas.filter(function (c) {
    return normalizar(c.nome).includes(termo) && !jaChutados.has(c.id);
  });

  filtradas.forEach(function (c) {
    const div = document.createElement('div');
    const stats = typeof c.power === 'number' ? c.power : 'Var';
    div.textContent = semAcento(c.nome + ' (' + stats + '/' + c.health + ')');

    div.addEventListener('click', function () {
      selecionarCarta(c);
    });

    sugestoes.appendChild(div);
  });

  sugestoes.style.display = filtradas.length ? 'block' : 'none';
}

function fecharSugestoes(e) {
  if (e.target !== input) {
    sugestoes.style.display = 'none';
  }
}

input.addEventListener('input', mostrarSugestoes);
document.addEventListener('click', fecharSugestoes);

// ---------- tabela ----------
function celula(texto, classe) {
  const td = document.createElement('td');
  td.textContent = semAcento(texto);
  if (classe) {
    td.className = classe;
  }
  return td;
}

function textoNumero(valor, status) {
  const base = String(valor);
  if (status === 'maior') {
    return base + ' ▲';
  }
  if (status === 'menor') {
    return base + ' ▼';
  }
  return base;
}
function textoLista(lista) {
  return lista.length ? lista.join(', ') : '-';
}

function adicionarLinha(dados) {
  const carta = dados.carta;
  const resultado = dados.resultado;

  const tr = document.createElement('tr');
  tr.appendChild(celula(carta.nome));
  tr.appendChild(celula(textoNumero(carta.power, resultado.power), resultado.power));
  tr.appendChild(celula(textoNumero(carta.health, resultado.health), resultado.health));
  tr.appendChild(celula(textoNumero(carta.costAmount, resultado.costAmount), resultado.costAmount));
  tr.appendChild(celula(carta.costType, resultado.costType));
  tr.appendChild(celula(textoLista(carta.tribes), resultado.tribes));
  tr.appendChild(celula(textoLista(carta.sigils), resultado.sigils));
  tr.appendChild(celula(textoLista(carta.traits), resultado.traits));
  tbody.prepend(tr);
}

function terminarJogo(carta) {
  jogoTerminado = true;
  input.disabled = true;
  botao.disabled = true;
  sugestoes.style.display = 'none';
  mensagem.textContent = 'Você acertou! A carta era ' + semAcento(carta.nome) + '.';
}

async function adivinhar() {
  if (jogoTerminado) {
    return;
  }

  mensagem.textContent = '';
  const id = idSelecionado;

  if (id === null) {
    mensagem.textContent = 'Escolha uma carta da lista.';
    return;
  }
  if (jaChutados.has(id)) {
    mensagem.textContent = 'Você já tentou essa carta.';
    return;
  }

  jaChutados.add(id);
  idSelecionado = null;

  let dados;
  try {
    dados = await enviarPalpite(id);
  } catch (erro) {
    jaChutados.delete(id);
    mensagem.textContent = 'Erro ao enviar o palpite. Tente de novo.';
    return;
  }
  adicionarLinha(dados);

  if (dados.acertou) {
    terminarJogo(dados.carta);
  }
}

function aoApertarTecla(e) {
  if (e.key === 'Enter') {
    adivinhar();
  }
}

botao.addEventListener('click', adivinhar);
input.addEventListener('keydown', aoApertarTecla);

// ---------- início ----------
async function iniciar() {
  try {
    cartas = await buscarCartas();
  } catch (erro) {
    mensagem.textContent = 'Não foi possível carregar as cartas.';
  }
}
iniciar();
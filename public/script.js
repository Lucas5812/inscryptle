const AdvBtn = document.getElementById("AdvBtn");

AdvBtn.addEventListener("click", function tentar(){
    document.getElementById("retorno").textContent = "[ERRO]Banco de dados não conectado";
})

const usarCartas = true;

const cartasFalsas = [
  {id: 1, nome: 'Víbora', power: 1, health: 1, costAmount: 2, costType: 'sangue', tribes: ['Réptil'], sigils: ['Toque da Morte'], traits: ['Mata Sobreviventes']},
  {id: 2, nome: 'Lobo Alfa', power: 1, health: 2, costAmount: 5, costType: 'ossos', tribes: ['Canídeo'], sigils: ['Líder'], traits: []},
  {id: 33, nome: 'Homem-toupeira', power: 0, health: 6, costAmount: 1, costType: 'sangue', tribes: [], sigils: ['Escavador', 'Salto Pujante'], traits: []},
  {id: 55, nome: 'Espinha-de-Caribu', power: 1, health: 2, costAmount: 4, costType: 'ossos', tribes: ['Ungulado'], sigils: ['Veloz', 'Toque da Morte'], traits: ['Mata Sobreviventes']},
  {id: 61, nome: 'Arminho', power: 1, health: 3, costAmount: 1, costType: 'sangue', tribes: [], sigils: [], traits: []},
];

function sorteia(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

const cartaCerta = sorteia(cartasFalsas);
console.log('Carta certa:', cartaCerta.nome);

function comparaNumero(palpite, certa) {
  if (palpite === certa) {
    return 'certo';
  }
  if (palpite === null || certa === null) {
    return 'errado';
  }
  return palpite < certa ? 'maior' : 'menor';
}

function comparaLista(a, b) {
  const emComum = a.filter(function (x) {
    return b.includes(x);
  });
  if (a.length === b.length && emComum.length === a.length) {
    return 'certo';
  }
  return emComum.length ? 'parcial' : 'errado';
}

function semAcento(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalizar(s) {
  return semAcento(s).toLowerCase();
}

async function buscarCartas() {
  if (usarCartas) {
    return cartasFalsas;
  }
}

async function enviarPalpite(id) {
  if (usarCartas) {
    const carta = cartasFalsas.find(function (c) {
      return c.id === id;
    });
    const s = cartaCerta;
    return {
      acertou: carta.id === s.id,
      carta: carta,
      resultado: {
        power: comparaNumero(carta.power, s.power),
        health: comparaNumero(carta.health, s.health),
        costAmount: comparaNumero(carta.costAmount, s.costAmount),
        costType: carta.costType === s.costType ? 'certo' : 'errado',
        tribes: comparaLista(carta.tribes, s.tribes),
        sigils: comparaLista(carta.sigils, s.sigils),
        traits: comparaLista(carta.traits, s.traits),
      },
    };
  }
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
    const stats = c.power === null ? 'Var' : c.power;
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
  const base = valor === null ? 'Variável' : String(valor);
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
  const dados = await enviarPalpite(id);
  adicionarLinha(dados);
  input.value = '';

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
  cartas = await buscarCartas();
}

iniciar();
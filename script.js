// Exibir o preloader antes de carregar o painel
window.addEventListener("load", () => {
  const carregando = document.getElementById("carregando");
  const painel = document.getElementById("painel");
  setTimeout(() => {
    carregando.style.display = "none";
    painel.classList.remove("oculto");
  }, 1500);
});

let dados = JSON.parse(localStorage.getItem("dadosHabitos")) || {
  xp: 0,
  xpTotal: 100,
  nivel: 1,
  habitos: []
};

const xpAtual = document.getElementById("xp-atual");
const xpTotal = document.getElementById("xp-total");
const nivel = document.getElementById("nivel");
const barraXp = document.getElementById("barra-xp");
const listaHabitos = document.getElementById("lista-habitos");
const botaoResetar = document.getElementById("resetar");

document.getElementById("adicionar-habito").addEventListener("click", adicionarHabito);
botaoResetar.addEventListener("click", resetarProgresso);

function salvar() {
  localStorage.setItem("dadosHabitos", JSON.stringify(dados));
}

function atualizarPainel() {
  xpAtual.textContent = dados.xp;
  xpTotal.textContent = dados.xpTotal;
  nivel.textContent = dados.nivel;
  barraXp.style.width = `${(dados.xp / dados.xpTotal) * 100}%`;
  mostrarHabitos();
}

function adicionarHabito() {
  const input = document.getElementById("novo-habito");
  const nome = input.value.trim();
  if (!nome) return alert("Digite um hábito!");

  const agora = new Date();
  const dataHora = agora.toLocaleDateString("pt-BR") + " " + agora.toLocaleTimeString("pt-BR");

  dados.habitos.push({ nome, dataHora, concluido: false });
  input.value = "";
  salvar();
  atualizarPainel();
}

function mostrarHabitos() {
  listaHabitos.innerHTML = "";
  dados.habitos.forEach((h, i) => {
    const li = document.createElement("li");
    li.classList.toggle("concluido", h.concluido);
    li.innerHTML = `
      <div>
        <span>${h.nome}</span><br>
        <small>${h.dataHora}</small>
      </div>
      <div>
        ${!h.concluido ? `<button class="botao-concluir" onclick="concluirHabito(${i})">Concluir</button>` : ""}
        <button class="botao-remover" onclick="removerHabito(${i})">Remover</button>
      </div>
    `;
    listaHabitos.appendChild(li);
  });
}

function concluirHabito(i) {
  const habito = dados.habitos[i];
  if (habito.concluido) return;

  habito.concluido = true;
  dados.xp += 20;

  if (dados.xp >= dados.xpTotal) {
    dados.xp -= dados.xpTotal;
    dados.nivel++;
    dados.xpTotal = Math.floor(dados.xpTotal * 1.3);
    alert(`🎉 Parabéns! Você alcançou o nível ${dados.nivel}!`);
  }

  salvar();
  atualizarPainel();
}

function removerHabito(i) {
  if (!confirm("Deseja realmente remover este hábito?")) return;
  dados.habitos.splice(i, 1);
  salvar();
  atualizarPainel();
}

function resetarProgresso() {
  if (!confirm("Deseja realmente apagar todos os dados e recomeçar?")) return;
  dados = { xp: 0, xpTotal: 100, nivel: 1, habitos: [] };
  salvar();
  atualizarPainel();
}

atualizarPainel();

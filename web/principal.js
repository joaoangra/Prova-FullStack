const API_BASE_URL = 'http://localhost:3000';
let usuario = null;
let equipamentoSelecionado = null;
let perfil = null;

function getUsuarioLogado() {
  if (!usuario) {
    const userStr = sessionStorage.getItem('usuario');
    if (userStr) usuario = JSON.parse(userStr);
  }
  return usuario;
}

function setUsuarioLogado(user) {
  usuario = user;
  sessionStorage.setItem('usuario', JSON.stringify(user));
}

document.addEventListener('DOMContentLoaded', () => {
  usuario = getUsuarioLogado();
  if (!usuario) {
    window.location.href = 'index.html';
    return;
  }
  perfil = usuario.perfil;
  configurarInterfacePorPerfil();
  carregarEquipamentos();
  setupEventListeners();
  preencherSelectImagens();
});

function preencherSelectImagens() {
  const imagens = [
    'Intel_Core_i9.png',
    'Monitor_Dell.png',
    'Mouse_Razer.png',
    'Teclado_Microsoft.png',
    'Torno_Mecanico_500mm.png'
  ];
  const select = document.getElementById('imagemEquipamento');
  select.innerHTML = '';
  imagens.forEach(img => {
    const opt = document.createElement('option');
    opt.value = img;
    opt.textContent = img;
    select.appendChild(opt);
  });
}

function configurarInterfacePorPerfil() {
  const btnNovo = document.getElementById('novoEquipamentoBtn');
  if (perfil === 'Administrador' || perfil === 'Tecnico' || perfil === 'Gerente') {
    btnNovo.style.display = 'inline-block';
  } else {
    btnNovo.style.display = 'none';
  }
}

function podeGerenciarEquipamento() {
  if (!perfil) return false;
  const p = perfil.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return (
    p === 'administrador' ||
    p === 'tecnico' ||
    p === 'gerente'
  );
}

function setupEventListeners() {
  document.getElementById('logoutBtn').onclick = () => {
    sessionStorage.removeItem('usuario');
    window.location.href = 'index.html';
  };
  document.getElementById('novoEquipamentoBtn').onclick = () => mostrarModal('novoEquipamentoModal');
  document.getElementById('closeNovoEquipamento').onclick = () => esconderModal('novoEquipamentoModal');
  document.getElementById('cadastrarEquipamentoBtn').onclick = cadastrarEquipamento;
  document.getElementById('closeComentarios').onclick = () => esconderModal('comentariosModal');
  document.getElementById('adicionarComentarioBtn').onclick = () => mostrarModal('novoComentarioModal');
  document.getElementById('closeNovoComentario').onclick = () => esconderModal('novoComentarioModal');
  document.getElementById('cadastrarComentarioBtn').onclick = cadastrarComentario;
  document.getElementById('closeExcluirEquipamento').onclick = () => esconderModal('excluirEquipamentoModal');
  document.getElementById('confirmarExcluirBtn').onclick = confirmarExcluirEquipamento;
}

async function carregarEquipamentos() {
  const resp = await fetch(`${API_BASE_URL}/equipamentos`);
  const equipamentos = await resp.json();
  const lista = document.getElementById('equipamentoList');
  lista.innerHTML = '';
  equipamentos.filter(eq => eq.ativo).forEach(eq => {
    const card = document.createElement('div');
    card.className = 'equipamento-card';
    card.innerHTML = `
<img src="img/${eq.imagem || 'placeholder.png'}" class="equipamento-img" alt="Imagem do equipamento">
      <div class="equipamento-info">
        <div class="equipamento-nome">${eq.equipamento}</div>
        <div class="equipamento-desc">${eq.descricao || ''}</div>
        <div class="equipamento-actions">
          <button title="Comentários" onclick="abrirComentarios(${eq.id})">
            <img src="img/comentario.png" alt="Comentários" style="width:24px;height:24px;vertical-align:middle;">
          </button>
          ${podeGerenciarEquipamento() ? `<button title="Excluir" onclick="abrirExcluirEquipamento(${eq.id})"><img src="img/deletar.png" alt="Excluir" style="width:24px;height:24px;vertical-align:middle;"></button>` : ''}
        </div>
      </div>
    `;
    lista.appendChild(card);
  });
}

window.abrirComentarios = async function(equipamentoId) {
  equipamentoSelecionado = equipamentoId;
  mostrarModal('comentariosModal');
  const resp = await fetch(`${API_BASE_URL}/comentarios`);
  const comentarios = await resp.json();
  const container = document.getElementById('comentariosContainer');
  container.innerHTML = '';
  comentarios.filter(c => c.equipamentoId === equipamentoId).sort((a,b)=>new Date(b.data)-new Date(a.data)).forEach(c => {
    const div = document.createElement('div');
    div.className = 'comentario';
    div.innerHTML = `<span class="comentario-autor">${c.usuario.perfil.perfil}</span> - <span class="comentario-data">${new Date(c.data).toLocaleDateString()}</span><br>${c.comentario}`;
    container.appendChild(div);
  });
};

async function cadastrarComentario() {
  const texto = document.getElementById('novoComentarioTexto').value.trim();
  if (!texto) return;
  await fetch(`${API_BASE_URL}/comentarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comentario: texto, equipamentoId: equipamentoSelecionado, usuarioId: usuario.id })
  });
  document.getElementById('novoComentarioTexto').value = '';
  esconderModal('novoComentarioModal');
  abrirComentarios(equipamentoSelecionado);
}

async function cadastrarEquipamento() {
  if (!podeGerenciarEquipamento()) {
    alert('Você não tem permissão para adicionar equipamentos.');
    return;
  }
  const nome = document.getElementById('nomeEquipamento').value.trim();
  const imagem = document.getElementById('imagemEquipamento').value;
  const descricao = document.getElementById('descricaoEquipamento').value.trim();
  const ativo = document.getElementById('ativoEquipamento').checked;
  if (!nome) return;
  const resp = await fetch(`${API_BASE_URL}/equipamentos`);
  const equipamentos = await resp.json();
  if (equipamentos.some(eq => eq.equipamento.toLowerCase() === nome.toLowerCase())) {
    alert('Já existe um equipamento com esse nome!');
    return;
  }
  await fetch(`${API_BASE_URL}/equipamentos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ equipamento: nome, imagem, descricao, ativo })
  });
  esconderModal('novoEquipamentoModal');
  carregarEquipamentos();
}

window.abrirExcluirEquipamento = function(equipamentoId) {
  equipamentoSelecionado = equipamentoId;
  mostrarModal('excluirEquipamentoModal');
};

async function confirmarExcluirEquipamento() {
  if (!podeGerenciarEquipamento()) {
    alert('Você não tem permissão para excluir equipamentos.');
    esconderModal('excluirEquipamentoModal');
    return;
  }
  await fetch(`${API_BASE_URL}/equipamentos/${equipamentoSelecionado}`, { method: 'DELETE' });
  esconderModal('excluirEquipamentoModal');
  carregarEquipamentos();
}

function mostrarModal(id) {
  document.getElementById(id).classList.remove('hidden');
}
function esconderModal(id) {
  document.getElementById(id).classList.add('hidden');
}

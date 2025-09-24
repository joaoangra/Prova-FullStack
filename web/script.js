const API_BASE_URL = 'http://localhost:3000';
let senha = '';

const senhaInput = document.getElementById('senha');
const teclas = document.querySelectorAll('.tecla');
const clearBtn = document.getElementById('clearBtn');
const enterBtn = document.getElementById('enterBtn');
const erroDiv = document.getElementById('erro');

teclas.forEach(btn => {
  btn.addEventListener('click', () => {
    if (senha.length < 6) {
      senha += btn.dataset.num;
      atualizarSenha();
    }
  });
});

clearBtn.addEventListener('click', () => {
  senha = '';
  atualizarSenha();
  erroDiv.textContent = '';
});

function atualizarSenha() {
  senhaInput.value = '*'.repeat(senha.length);
  enterBtn.disabled = senha.length !== 6;
}

enterBtn.addEventListener('click', async () => {
  if (senha.length !== 6) return;
  erroDiv.textContent = '';
  try {
    const resp = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha })
    });
    const data = await resp.json();
        if (resp.ok) {
            sessionStorage.setItem('usuario', JSON.stringify(data));
            window.location.href = 'principal.html';
        } else {
            erroDiv.textContent = data.error || 'Senha incorreta';
            senha = '';
            atualizarSenha();
        }
  } catch (e) {
    erroDiv.textContent = 'Erro de conexão com o servidor';
  }
});
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    if (screenName === 'login') {
        loginScreen.classList.add('active');
    } else if (screenName === 'equipment') {
        equipmentScreen.classList.add('active');
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    
    if (modalId === 'addCommentModal') {
        document.getElementById('commentText').value = '';
        document.getElementById('saveCommentBtn').disabled = true;
    } else if (modalId === 'newEquipmentModal') {
        document.getElementById('equipmentForm').reset();
        document.getElementById('equipmentActive').checked = true;
        document.getElementById('saveEquipmentBtn').disabled = true;
    }
}

async function loadEquipments() {
    try {
        const response = await fetch(`${API_BASE_URL}/equipamentos`);
        const equipamentos = await response.json();

        const activeEquipments = equipamentos.filter(eq => eq.ativo);

        displayEquipments(activeEquipments);
    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
    }
}

function displayEquipments(equipamentos) {
    equipmentList.innerHTML = '';

    equipamentos.forEach(equipamento => {
        const card = createEquipmentCard(equipamento);
        equipmentList.appendChild(card);
    });
}

function createEquipmentCard(equipamento) {
    const isAdmin = currentUser.perfil.perfil === 'Administrador';
    
    const card = document.createElement('div');
    card.className = 'equipment-card';
    
    card.innerHTML = `
        <div class="equipment-image">
            ${equipamento.imagem ? `Imagem: ${equipamento.imagem}` : 'Sem imagem'}
        </div>
        <div class="equipment-name">${equipamento.equipamento}</div>
        <div class="equipment-description">${equipamento.descricao || 'Sem descrição'}</div>
        <div class="equipment-actions">
            <button class="action-btn comments-btn" onclick="showComments(${equipamento.id})">
                💬 Comentários
            </button>
            ${isAdmin ? `
                <button class="action-btn delete-btn" onclick="confirmDeleteEquipment(${equipamento.id})">
                    🗑️ Excluir
                </button>
            ` : ''}
        </div>
    `;

    return card;
}

// Comentários
async function showComments(equipmentId) {
    currentEquipmentId = equipmentId;
    
    try {
        const response = await fetch(`${API_BASE_URL}/equipamentos/${equipmentId}`);
        const equipamento = await response.json();

        displayComments(equipamento.comentarios);
        showModal('commentsModal');
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
    }
}

function displayComments(comentarios) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';

    if (comentarios.length === 0) {
        commentsList.innerHTML = '<p class="text-center">Nenhum comentário encontrado.</p>';
        return;
    }

    const sortedComments = comentarios.sort((a, b) => new Date(b.data) - new Date(a.data));

    sortedComments.forEach(comentario => {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        
        const date = new Date(comentario.data).toLocaleString('pt-BR');
        
        commentItem.innerHTML = `
            <div class="comment-header">
                <span class="comment-profile">${comentario.perfil.perfil}</span>
                <span class="comment-date">${date}</span>
            </div>
            <div class="comment-text">${comentario.comentario}</div>
        `;
        
        commentsList.appendChild(commentItem);
    });
}

async function saveComment() {
    const commentText = document.getElementById('commentText').value.trim();
    
    if (!commentText) return;

    try {
        const response = await fetch(`${API_BASE_URL}/comentarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comentario: commentText,
                equipamentoId: currentEquipmentId,
                perfilId: currentUser.perfilId
            })
        });

        if (response.ok) {
            hideModal('addCommentModal');
            showSuccessMessage('Sucesso! Comentário cadastrado para o equipamento.');
        } else {
            console.error('Erro ao salvar comentário');
        }
    } catch (error) {
        console.error('Erro ao salvar comentário:', error);
    }
}

function validateEquipmentForm() {
    const name = document.getElementById('equipmentName').value.trim();
    const image = document.getElementById('equipmentImage').value.trim();
    const description = document.getElementById('equipmentDescription').value.trim();
    
    const saveBtn = document.getElementById('saveEquipmentBtn');
    saveBtn.disabled = !(name && image && description);
}

async function saveEquipment() {
    const name = document.getElementById('equipmentName').value.trim();
    const image = document.getElementById('equipmentImage').value.trim();
    const description = document.getElementById('equipmentDescription').value.trim();
    const active = document.getElementById('equipmentActive').checked;

    try {
        const response = await fetch(`${API_BASE_URL}/equipamentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                equipamento: name,
                imagem: image,
                descricao: description,
                ativo: active
            })
        });

        if (response.ok) {
            hideModal('newEquipmentModal');
            showSuccessMessage('Sucesso! Equipamento cadastrado.');
        } else {
            console.error('Erro ao salvar equipamento');
        }
    } catch (error) {
        console.error('Erro ao salvar equipamento:', error);
    }
}

function confirmDeleteEquipment(equipmentId) {
    equipmentToDelete = equipmentId;
    showModal('confirmDeleteModal');
}

async function confirmDelete() {
    if (!equipmentToDelete) return;

    try {
        const response = await fetch(`${API_BASE_URL}/equipamentos/${equipmentToDelete}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            hideModal('confirmDeleteModal');
            showSuccessMessage('Equipamento excluído com sucesso.');
            equipmentToDelete = null;
        } else {
            console.error('Erro ao excluir equipamento');
        }
    } catch (error) {
        console.error('Erro ao excluir equipamento:', error);
    }
}

function showError(message) {
    errorMessage.textContent = message;
}

function showSuccessMessage(message) {
    document.getElementById('successMessage').textContent = message;
    showModal('successModal');
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});


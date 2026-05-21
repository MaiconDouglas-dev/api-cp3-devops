const BASE = '/produtos';

let produtos = [];
let produtosFiltrados = [];

const formatarMoeda = (valor) => {
  if (valor === 0) return "Inestimável";
  return Number(valor).toLocaleString('pt-BR') + " Ag";
};

function mostrarToast(mensagem, isError = false) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';

  if (isError) {
    toast.style.borderLeftColor = 'var(--text-muted)';
    toast.style.backgroundColor = '#1a1a1a';
  }

  toast.textContent = mensagem;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function atualizarContador() {
  const label = document.getElementById('count-label');
  label.innerHTML = `<span style="color: var(--blood-light)">${produtosFiltrados.length}</span> equipamentos forjados`;
}

function renderTabela() {
  const container = document.getElementById('table-container');
  atualizarContador();

  if (!produtosFiltrados || produtosFiltrados.length === 0) {
    container.innerHTML = `<div class="empty-state">O abismo está vazio. Nenhum equipamento encontrado.</div>`;
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>Equipamento</th>
          <th>Valor</th>
          <th>Estoque</th>
          <th style="text-align: right">Sacrifício (Ações)</th>
        </tr>
      </thead>
      <tbody>
  `;

  produtosFiltrados.forEach(prod => {
    html += `
      <tr>
        <td>
          <div class="item-name">${escapeHtml(prod.nome ?? '')}</div>
          <div class="item-desc">${escapeHtml(prod.descricao ?? '')}</div>
        </td>
        <td style="font-family: var(--font-title); font-weight: bold; color: var(--text-bone)">
          ${formatarMoeda(prod.preco ?? 0)}
        </td>
        <td>${Number(prod.quantidade ?? 0)} un.</td>
        <td>
          <div class="actions" style="justify-content: flex-end">
            <button class="btn btn-ghost" onclick="abrirModal(${prod.id})" title="Alterar">✏️</button>
            <button class="btn btn-danger" onclick="excluirProduto(${prod.id})" title="Descartar">✖</button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function filtrarTabela() {
  const termo = (document.getElementById('search')?.value ?? '').toLowerCase();
  if (!termo) {
    produtosFiltrados = [...produtos];
  } else {
    produtosFiltrados = produtos.filter(p =>
      (p.nome ?? '').toLowerCase().includes(termo) ||
      (p.descricao ?? '').toLowerCase().includes(termo)
    );
  }
  renderTabela();
}

async function requestJson(url, options = {}) {
  const resp = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  // tenta extrair mensagem do backend (Spring pode retornar texto/JSON dependendo do erro)
  if (!resp.ok) {
    let detalhe = '';
    try {
      const ct = resp.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const body = await resp.json();
        detalhe = body?.message || body?.error || JSON.stringify(body);
      } else {
        detalhe = await resp.text();
      }
    } catch (_) {}

    throw new Error(detalhe || `Falha HTTP ${resp.status}`);
  }

  // 204 No Content
  if (resp.status === 204) return null;

  // pode vir JSON
  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) return await resp.json();

  // fallback
  return await resp.text();
}

async function carregarProdutos() {
  try {
    const data = await requestJson(BASE, { method: 'GET' });
    // garante array
    produtos = Array.isArray(data) ? data : [];
    produtosFiltrados = [...produtos];
    filtrarTabela(); // respeita o termo digitado se tiver
  } catch (e) {
    mostrarToast(`Erro ao carregar do servidor: ${e.message}`, true);
    produtos = [];
    produtosFiltrados = [];
    renderTabela();
  }
}

async function criarProduto() {
  const nome = document.getElementById('inp-nome').value.trim();
  const descricao = document.getElementById('inp-descricao').value.trim();
  const preco = parseFloat(document.getElementById('inp-preco').value);
  const quantidade = parseInt(document.getElementById('inp-quantidade').value);

  if (!nome || !descricao || isNaN(preco) || isNaN(quantidade)) {
    mostrarToast("Faltam recursos! Preencha Nome, Descrição, Preço e Quantidade.", true);
    return;
  }

  const payload = { nome, descricao, preco, quantidade };

  try {
    await requestJson(BASE, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    // Limpar inputs
    document.getElementById('inp-nome').value = '';
    document.getElementById('inp-descricao').value = '';
    document.getElementById('inp-preco').value = '';
    document.getElementById('inp-quantidade').value = '';

    await carregarProdutos();
    mostrarToast("Novo equipamento forjado no fogo e sangue!");
  } catch (e) {
    mostrarToast(`Erro ao forjar equipamento: ${e.message}`, true);
  }
}

async function excluirProduto(id) {
  if (!id) return;

  try {
    await requestJson(`${BASE}/${id}`, { method: 'DELETE' });
    await carregarProdutos();
    mostrarToast("Equipamento consumido pelo Abismo.");
  } catch (e) {
    mostrarToast(`Erro ao descartar: ${e.message}`, true);
  }
}

function abrirModal(id) {
  const prod = produtos.find(p => Number(p.id) === Number(id));
  if (!prod) {
    mostrarToast("Equipamento não encontrado na lista.", true);
    return;
  }

  document.getElementById('edit-id').value = prod.id;
  document.getElementById('edit-nome').value = prod.nome ?? '';
  document.getElementById('edit-descricao').value = prod.descricao ?? '';
  document.getElementById('edit-preco').value = prod.preco ?? 0;
  document.getElementById('edit-quantidade').value = prod.quantidade ?? 0;

  document.getElementById('modal').classList.add('active');
}

function fecharModal() {
  document.getElementById('modal').classList.remove('active');
}

async function salvarEdicao() {
  const id = parseInt(document.getElementById('edit-id').value);
  const nome = document.getElementById('edit-nome').value.trim();
  const descricao = document.getElementById('edit-descricao').value.trim();
  const preco = parseFloat(document.getElementById('edit-preco').value);
  const quantidade = parseInt(document.getElementById('edit-quantidade').value);

  if (!id || !nome || !descricao || isNaN(preco) || isNaN(quantidade)) {
    mostrarToast("Dados inválidos. O ferreiro exige precisão.", true);
    return;
  }

  const payload = { nome, descricao, preco, quantidade };

  try {
    await requestJson(`${BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    fecharModal();
    await carregarProdutos();
    mostrarToast("Equipamento reforjado com sucesso.");
  } catch (e) {
    mostrarToast(`Erro ao reforjar: ${e.message}`, true);
  }
}

window.onload = async () => {
  renderTabela();      // mostra “vazio” enquanto carrega
  await carregarProdutos();
};
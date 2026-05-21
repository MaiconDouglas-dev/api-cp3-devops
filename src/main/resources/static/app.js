const BASE = '/produtos';
// Estado da aplicação (Simulando um banco de dados temático)
    let produtos = [
        { id: 1, nome: "Dragon Slayer", descricao: "Massa de ferro pesada e bruta. Capaz de matar apóstolos.", preco: 15000, quantidade: 1 },
        { id: 2, nome: "Behelit Carmesim", descricao: "O Ovo do Rei Conquistador. A chave para o sacrifício.", preco: 0, quantidade: 1 },
        { id: 3, nome: "Facas de Arremesso", descricao: "Pequenas, letais e silenciosas. Fáceis de esconder.", preco: 15, quantidade: 45 },
        { id: 4, nome: "Armadura Berserker", descricao: "Forjada por anões. Remove os limites do corpo humano.", preco: 99999, quantidade: 1 }
    ];

    let produtosFiltrados = [...produtos];

    const formatarMoeda = (valor) => {
        if(valor === 0) return "Inestimável";
        return valor.toLocaleString('pt-BR') + " Ag"; // Ag = Prata (Silver)
    };

    function atualizarContador() {
        const label = document.getElementById('count-label');
        label.innerHTML = `<span style="color: var(--blood-light)">${produtos.length}</span> equipamentos forjados`;
    }

    function renderTabela() {
        const container = document.getElementById('table-container');
        atualizarContador();

        if (produtosFiltrados.length === 0) {
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
                        <div class="item-name">${prod.nome}</div>
                        <div class="item-desc">${prod.descricao}</div>
                    </td>
                    <td style="font-family: var(--font-title); font-weight: bold; color: var(--text-bone)">
                        ${formatarMoeda(prod.preco)}
                    </td>
                    <td>${prod.quantidade} un.</td>
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

    function criarProduto() {
        const nome = document.getElementById('inp-nome').value.trim();
        const descricao = document.getElementById('inp-descricao').value.trim();
        const preco = parseFloat(document.getElementById('inp-preco').value);
        const quantidade = parseInt(document.getElementById('inp-quantidade').value);

        if (!nome || isNaN(preco) || isNaN(quantidade)) {
            mostrarToast("Faltam recursos! Preencha Nome, Preço e Quantidade.", true);
            return;
        }

        const novoProduto = {
            id: Date.now(),
            nome,
            descricao,
            preco,
            quantidade
        };

        produtos.unshift(novoProduto);
        
        // Limpar inputs
        document.getElementById('inp-nome').value = '';
        document.getElementById('inp-descricao').value = '';
        document.getElementById('inp-preco').value = '';
        document.getElementById('inp-quantidade').value = '';

        filtrarTabela();
        mostrarToast("Novo equipamento forjado no fogo e sangue!");
    }

    function excluirProduto(id) {
        // Confirm temático visual
        produtos = produtos.filter(p => p.id !== id);
        filtrarTabela();
        mostrarToast("Equipamento consumido pelo Abismo.");
    }

    function abrirModal(id) {
        const prod = produtos.find(p => p.id === id);
        if (!prod) return;

        document.getElementById('edit-id').value = prod.id;
        document.getElementById('edit-nome').value = prod.nome;
        document.getElementById('edit-descricao').value = prod.descricao;
        document.getElementById('edit-preco').value = prod.preco;
        document.getElementById('edit-quantidade').value = prod.quantidade;

        document.getElementById('modal').classList.add('active');
    }

    function fecharModal() {
        document.getElementById('modal').classList.remove('active');
    }

    function salvarEdicao() {
        const id = parseInt(document.getElementById('edit-id').value);
        const nome = document.getElementById('edit-nome').value.trim();
        const descricao = document.getElementById('edit-descricao').value.trim();
        const preco = parseFloat(document.getElementById('edit-preco').value);
        const quantidade = parseInt(document.getElementById('edit-quantidade').value);

        if (!nome || isNaN(preco) || isNaN(quantidade)) {
            mostrarToast("Dados inválidos. O ferreiro exige precisão.", true);
            return;
        }

        const index = produtos.findIndex(p => p.id === id);
        if (index !== -1) {
            produtos[index] = { ...produtos[index], nome, descricao, preco, quantidade };
            fecharModal();
            filtrarTabela();
            mostrarToast("Equipamento reforjado com sucesso.");
        }
    }

    function filtrarTabela() {
        const termo = document.getElementById('search').value.toLowerCase();
        produtosFiltrados = produtos.filter(p => 
            p.nome.toLowerCase().includes(termo) || 
            p.descricao.toLowerCase().includes(termo)
        );
        renderTabela();
    }

    function mostrarToast(mensagem, isError = false) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        if(isError) {
            toast.style.borderLeftColor = 'var(--text-muted)';
            toast.style.backgroundColor = '#1a1a1a';
        }

        toast.textContent = mensagem;
        container.appendChild(toast);

        // Remove o toast depois de 3 segundos
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    window.onload = () => {
        renderTabela();
    };
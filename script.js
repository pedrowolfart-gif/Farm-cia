let valorFreteGlobal = 0; // Guarda o valor do frete calculado

// 1. Adicionar produto ao carrinho
function adicionarAoCarrinho(imagem, nome, preco) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];
    let precoNumerico = parseFloat(preco);
    let produtoExistente = carrinho.find(item => item.nome === nome);

    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({
            imagem: imagem,
            nome: nome,
            preco: precoNumerico,
            quantidade: 1
        });
    }

    localStorage.setItem('carrinhoFarmaClick', JSON.stringify(carrinho));
    alert(`${nome} foi adicionado ao seu carrinho!`);
    atualizarContadorCarrinho();
}

// 2. Desenhar a tabela dentro do carrinho.html
function renderizarCarrinho() {
    const tabelaBody = document.getElementById('lista-carrinho');
    const elementoTotal = document.getElementById('valor-total');
    const msgFrete = document.getElementById('mensagem-frete');

    if (!tabelaBody) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];

    // Se o carrinho estiver vazio
    if (carrinho.length === 0) {
        tabelaBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">Seu carrinho está vazio.</td>
            </tr>
        `;
        if (elementoTotal) elementoTotal.innerText = "R$ 0,00";
        if (msgFrete) msgFrete.innerText = "";
        valorFreteGlobal = 0;
        return;
    }

    tabelaBody.innerHTML = '';
    let subtotalGeral = 0;

    carrinho.forEach((produto, index) => {
        let precoValido = Number(produto.preco) || 0;
        let subtotal = precoValido * produto.quantidade;
        subtotalGeral += subtotal;

        let imagemSrc = produto.imagem || '../img/logo da farmácia.jpg';

        tabelaBody.innerHTML += `
            <tr>
                <td>
                    <img src="${imagemSrc}" alt="${produto.nome}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                </td>
                <td><strong>${produto.nome}</strong></td>
                <td>R$ ${precoValido.toFixed(2).replace('.', ',')}</td>
                <td>
                    <input type="number" min="1" value="${produto.quantidade}" onchange="alterarQuantidade(${index}, this.value)">
                </td>
                <td>R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
                <td>
                    <button type="button" onclick="removerItem(${index})">Remover</button>
                </td>
            </tr>
        `;
    });

    let totalComFrete = subtotalGeral + valorFreteGlobal;

    if (elementoTotal) {
        elementoTotal.innerText = `R$ ${totalComFrete.toFixed(2).replace('.', ',')}`;
    }
}

// 3. Alterar quantidade e remover item do carrinho
function alterarQuantidade(index, novaQtd) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];
    let quantidade = parseInt(novaQtd);

    if (quantidade > 0) {
        carrinho[index].quantidade = quantidade;
        localStorage.setItem('carrinhoFarmaClick', JSON.stringify(carrinho));
        renderizarCarrinho();
        atualizarContadorCarrinho();
    }
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinhoFarmaClick', JSON.stringify(carrinho));
    renderizarCarrinho();
    atualizarContadorCarrinho();
}

// 4. Calcular Frete (Com mensagens visuais no HTML)
function calcularFrete() {
    const inputCep = document.getElementById('cep');
    const msgFrete = document.getElementById('mensagem-frete');

    if (!inputCep || !inputCep.value) {
        if (msgFrete) {
            msgFrete.style.color = "red";
            msgFrete.innerText = "Por favor, informe um CEP válido.";
        } else {
            alert("Por favor, digite um CEP válido.");
        }
        return;
    }

    let cepLimpo = inputCep.value.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        if (msgFrete) {
            msgFrete.style.color = "red";
            msgFrete.innerText = "O CEP deve conter 8 dígitos (ex: 88000-000).";
        } else {
            alert("Por favor, digite um CEP com 8 dígitos.");
        }
        return;
    }

    valorFreteGlobal = 10.00; // Frete fixo para Florianópolis

    if (msgFrete) {
        msgFrete.style.color = "green";
        msgFrete.innerText = "Frete para Florianópolis: R$ 10,00 (Entrega no mesmo dia!)";
    }

    renderizarCarrinho();
}

// 5. Filtrar produtos na busca de produtos.html
function filtrarProdutos() {
    const inputBusca = document.getElementById('campo-busca');
    if (!inputBusca) return;

    const termo = inputBusca.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.card-produto');

    cards.forEach(card => {
        const titulo = card.querySelector('h3') ? card.querySelector('h3').innerText.toLowerCase() : '';
        const categoria = card.querySelector('.categoria-tag') ? card.querySelector('.categoria-tag').innerText.toLowerCase() : '';

        if (titulo.includes(termo) || categoria.includes(termo)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

// 6. Enviar formulário de Receita
function enviarReceita(event) {
    event.preventDefault();

    const nomeInput = document.getElementById('nome');
    const nome = nomeInput ? nomeInput.value : 'Cliente';

    alert(`Obrigado, ${nome}! Sua receita foi enviada com sucesso. Nossa equipe entrará em contato via WhatsApp para passar o orçamento.`);

    event.target.reset();
}

// 7. Atualizar contador de itens no menu
function atualizarContadorCarrinho() {
    const elementoContador = document.getElementById('contador-carrinho');
    if (!elementoContador) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];
    let totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    elementoContador.innerText = `(${totalItens})`;
}

// 8. Finalizar Compra e Redirecionar
function finalizarCompra() {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! Adicione produtos antes de finalizar.");
        return;
    }

    alert("Pedido realizado com sucesso! Obrigado por comprar na Farma Click.");
    localStorage.removeItem('carrinhoFarmaClick');
    valorFreteGlobal = 0;

    // Redireciona o usuário para a página inicial
    window.location.href = "produtos.html";
}

// Inicializações automáticas
document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrinho();
    atualizarContadorCarrinho();
});
let valorFreteGlobal = 0;

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

function renderizarCarrinho() {
    const tabelaBody = document.getElementById('lista-carrinho');
    const elemSubtotal = document.getElementById('subtotal-produtos');
    const elemDesconto = document.getElementById('valor-desconto');
    const elemFreteDisplay = document.getElementById('valor-frete-display');
    const elementoTotal = document.getElementById('valor-total');
    const msgFrete = document.getElementById('mensagem-frete');

    if (!tabelaBody) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];

    if (carrinho.length === 0) {
        tabelaBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">Seu carrinho está vazio.</td>
            </tr>
        `;
        if (elemSubtotal) elemSubtotal.innerText = "R$ 0,00";
        if (elemDesconto) elemDesconto.innerText = "- R$ 0,00";
        if (elemFreteDisplay) elemFreteDisplay.innerText = "R$ 0,00";
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

        let imagemSrc = produto.imagem || '../img/logo_da_farmácia-removebg-preview.png';

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

    let valorDesconto = 0;

    if (subtotalGeral >= 100) {
        valorDesconto = subtotalGeral * 0.10;
    } else {
        valorDesconto = 0;
    }

    let totalComFreteEDesconto = (subtotalGeral - valorDesconto) + valorFreteGlobal;

    if (elemSubtotal) elemSubtotal.innerText = `R$ ${subtotalGeral.toFixed(2).replace('.', ',')}`;
    if (elemDesconto) elemDesconto.innerText = `- R$ ${valorDesconto.toFixed(2).replace('.', ',')}`;
    if (elemFreteDisplay) elemFreteDisplay.innerText = `R$ ${valorFreteGlobal.toFixed(2).replace('.', ',')}`;
    if (elementoTotal) elementoTotal.innerText = `R$ ${totalComFreteEDesconto.toFixed(2).replace('.', ',')}`;
}

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

    valorFreteGlobal = 10.00;

    if (msgFrete) {
        msgFrete.style.color = "green";
        msgFrete.innerText = "Frete para Florianópolis: R$ 10,00 (Entrega no mesmo dia!)";
    }

    renderizarCarrinho();
}

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

function aplicarFiltroCategoriaURL() {
    const params = new URLSearchParams(window.location.search);
    const categoriaUrl = params.get('categoria');

    if (!categoriaUrl) return;

    const cards = document.querySelectorAll('.card-produto');
    const inputBusca = document.getElementById('campo-busca');
    const termoBusca = categoriaUrl.toLowerCase();

    cards.forEach(card => {
        const categoriaTag = card.querySelector('.categoria-tag') ? card.querySelector('.categoria-tag').innerText.toLowerCase() : '';
        const titulo = card.querySelector('h3') ? card.querySelector('h3').innerText.toLowerCase() : '';

        if (categoriaTag.includes(termoBusca) || titulo.includes(termoBusca)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });

    if (inputBusca) {
        inputBusca.value = categoriaUrl;
    }
}

function enviarReceita(event) {
    event.preventDefault();

    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    const arquivoInput = document.getElementById('arquivo-receita');

    const nome = nomeInput ? nomeInput.value.trim() : '';
    const telefone = telefoneInput ? telefoneInput.value.trim() : '';

    if (nome === "" || telefone === "") {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    if (!arquivoInput || arquivoInput.files.length === 0) {
        alert("Por favor, selecione o arquivo da sua receita médica.");
        return;
    }

    alert(`Obrigado, ${nome}! Sua receita foi enviada com sucesso. Nossa equipe entrará em contato via WhatsApp (${telefone}) para enviar o orçamento.`);

    event.target.reset();
}

function atualizarContadorCarrinho() {
    const elementoContador = document.getElementById('contador-carrinho');
    if (!elementoContador) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];
    let totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    elementoContador.innerText = `${totalItens}`;
}

function finalizarCompra() {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! Adicione produtos antes de finalizar.");
        return;
    }

    alert("Pedido realizado com sucesso! Obrigado por comprar na Farma Click.");
    localStorage.removeItem('carrinhoFarmaClick');
    valorFreteGlobal = 0;

    window.location.href = "produtos.html";
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrinho();
    atualizarContadorCarrinho();
    aplicarFiltroCategoriaURL();
});

function fazerLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    alert(`Login efetuado com sucesso para ${email}!`);
    window.location.href = "index.html";
}

function cadastrarUsuario(event) {
    event.preventDefault();
    const nome = document.getElementById('cad-nome').value;
    alert(`Cadastro realizado com sucesso! Seja bem-vindo(a), ${nome}.`);
    window.location.href = "index.html";
}


function adicionarAoCarrinho(nome, preco) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];

    let precoNumerico = parseFloat(preco);

    let produtoExistente = carrinho.find(item => item.nome === nome);

    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({
            nome: nome,
            preco: precoNumerico,
            quantidade: 1
        });
    }

    localStorage.setItem('carrinhoFarmaClick', JSON.stringify(carrinho));
    alert(`${nome} foi adicionado ao seu carrinho!`);
}

function renderizarCarrinho() {
    const tabelaBody = document.getElementById('lista-carrinho');
    const elementoTotal = document.getElementById('valor-total');

    if (!tabelaBody) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];

    if (carrinho.length === 0) {
        tabelaBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px;">Seu carrinho está vazio.</td>
            </tr>
        `;
        if (elementoTotal) elementoTotal.innerText = "R$ 0,00";
        return;
    }

    tabelaBody.innerHTML = '';
    let totalGeral = 0;

    carrinho.forEach((produto, index) => {
        let precoValido = Number(produto.preco) || 0;
        let subtotal = precoValido * produto.quantidade;
        totalGeral += subtotal;

        tabelaBody.innerHTML += `
            <tr>
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

    if (elementoTotal) {
        elementoTotal.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    }
}

function alterarQuantidade(index, novaQtd) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];
    let quantidade = parseInt(novaQtd);

    if (quantidade > 0) {
        carrinho[index].quantidade = quantidade;
        localStorage.setItem('carrinhoFarmaClick', JSON.stringify(carrinho));
        renderizarCarrinho();
    }
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinhoFarmaClick', JSON.stringify(carrinho));
    renderizarCarrinho();
}

function finalizarCompra() {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoFarmaClick')) || [];

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    alert("Pedido realizado com sucesso! Obrigado por comprar na Farma Click.");
    localStorage.removeItem('carrinhoFarmaClick');
    renderizarCarrinho();
}

document.addEventListener("DOMContentLoaded", renderizarCarrinho);
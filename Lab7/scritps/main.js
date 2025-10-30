// Limpa a chave carrinho antiga e garante produtos-selecionados
localStorage.removeItem("carrinho");
if (!localStorage.getItem("produtos-selecionados")) {
  localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

// Função principal para carregar produtos via fetch da API
document.addEventListener("DOMContentLoaded", function () {
  fetch("https://deisishop.pythonanywhere.com/products/")
    .then(response => {
      return response.json();
    })
    .then(produtos => {
      carregarProdutos(produtos);
      atualizaCesto();
    })
    .catch(error => {
      console.error("Erro ao buscar produtos:", error);
    });
});


function carregarProdutos(produtos) {
  const container = document.getElementById("produtos");

  if (!container) {
    console.error('Elemento com id="produtos" não encontrado.');
    return;
  }

  container.innerHTML = "";
  produtos.forEach((produto) => {
    const artigo = criarProduto(produto);
    container.appendChild(artigo);
  });
}

function criarProduto(produto) {
  const artigo = document.createElement("article");

  const titulo = document.createElement("h2");
  const imagem = document.createElement("img");
  const descricao = document.createElement("p");
  const preco = document.createElement("span");
  const botao = document.createElement("button");

  titulo.textContent = produto.title;
  imagem.src = produto.image;
  imagem.alt = produto.title;
  descricao.textContent = produto.description;
  preco.textContent = `Preço: €${produto.price.toFixed(2)}`;
  botao.textContent = "+ Adicionar ao cesto";

  botao.addEventListener("click", () => {
    adicionarAoCesto(produto);
  });

  artigo.append(titulo, imagem, descricao, preco, botao);
  return artigo;
}

function adicionarAoCesto(produto) {
  let lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
  lista.push(produto);
  localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
  console.log(`✅ Produto "${produto.title}" adicionado ao cesto!`);
  atualizaCesto();
}


function atualizaCesto() {
  const containerCesto = document.getElementById("cesto");
  containerCesto.innerHTML = "";

  const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];

  if (lista.length === 0) {
    const vazio = document.createElement("p");
    vazio.textContent = "O cesto está vazio.";
    containerCesto.appendChild(vazio);
    return;
  }

  lista.forEach((produto, index) => {
    const artigoCesto = criaProdutoCesto(produto, index);
    containerCesto.appendChild(artigoCesto);
  });

  const total = lista.reduce((soma, p) => soma + p.price, 0);
  const totalElem = document.createElement("p");
  totalElem.textContent = `💰 Total: €${total.toFixed(2)}`;
  totalElem.style.fontWeight = "bold";
  containerCesto.appendChild(totalElem);
}

function criaProdutoCesto(produto, index) {
  const artigo = document.createElement("article");

  const titulo = document.createElement("h3");
  const preco = document.createElement("span");
  const botaoRemover = document.createElement("button");

  titulo.textContent = produto.title;
  preco.textContent = `€${produto.price.toFixed(2)}`;
  botaoRemover.textContent = "Remover";

  botaoRemover.addEventListener("click", () => {
    let lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
    lista.splice(index, 1);
    localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
    atualizaCesto();
  });

  artigo.append(titulo, preco, botaoRemover);
  artigo.style.border = "1px solid #ddd";
  artigo.style.padding = "8px";
  artigo.style.margin = "5px 0";
  artigo.style.borderRadius = "5px";

  return artigo;
}

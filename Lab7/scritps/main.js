// main.js

localStorage.removeItem("carrinho");
if (!localStorage.getItem("produtos-selecionados")) {
  localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

// 2️⃣ Quando o DOM estiver pronto, carrega os produtos
document.addEventListener("DOMContentLoaded", function () {
  carregarProdutos(produtos);
});

/* ==========================================================
   CARREGAR PRODUTOS
========================================================== */
function carregarProdutos(produtos) {
  const container = document.getElementById("produtos");

  if (!container) {
    console.error('Elemento com id="produtos" não encontrado.');
    return;
  }

  container.innerHTML = ""; // Limpa os produtos antigos antes de adicionar

  produtos.forEach((produto) => {
    const artigo = criarProduto(produto);
    container.appendChild(artigo);
  });
}

/* ==========================================================
   CRIAR PRODUTO (com botão "+ Adicionar ao cesto")
========================================================== */
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

  // ➕ Event listener para adicionar o produto ao localStorage
  botao.addEventListener("click", () => {
    adicionarAoCesto(produto);
  });

  artigo.append(titulo, imagem, descricao, preco, botao);
  return artigo;
}

/* ==========================================================
   ADICIONAR AO CESTO (guardar no localStorage)
========================================================== */
function adicionarAoCesto(produto) {
  // Buscar a lista atual de produtos selecionados
  let lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];

  // Adicionar o novo produto
  lista.push(produto);

  // Atualizar o localStorage
  localStorage.setItem("produtos-selecionados", JSON.stringify(lista));

  console.log(`✅ Produto "${produto.title}" adicionado ao cesto!`);
}

function atualizaCesto() {
  const containerCesto = document.getElementById("cesto");
  containerCesto.innerHTML = ""; // limpa antes de atualizar

  const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];

  if (lista.length === 0) {
    const vazio = document.createElement("p");
    vazio.textContent = "O cesto está vazio.";
    containerCesto.appendChild(vazio);
    return;
  }

  // Percorre cada produto e cria um <article> com botão de remover
  lista.forEach((produto, index) => {
    const artigoCesto = criaProdutoCesto(produto, index);
    containerCesto.appendChild(artigoCesto);
  });

  // Calcular e mostrar preço total
  const total = lista.reduce((soma, p) => soma + p.price, 0);
  const totalElem = document.createElement("p");
  totalElem.textContent = `💰 Total: €${total.toFixed(2)}`;
  totalElem.style.fontWeight = "bold";
  containerCesto.appendChild(totalElem);
}

/* ==========================================================
   CRIAR PRODUTO NO CESTO
========================================================== */
function criaProdutoCesto(produto, index) {
  const artigo = document.createElement("article");

  const titulo = document.createElement("h3");
  const preco = document.createElement("span");
  const botaoRemover = document.createElement("button");

  titulo.textContent = produto.title;
  preco.textContent = `€${produto.price.toFixed(2)}`;
  botaoRemover.textContent = "Remover";

  // Event listener para remover produto do cesto
  botaoRemover.addEventListener("click", () => {
    // 1️⃣ Buscar lista atual
    let lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];

    // 2️⃣ Remover o produto usando o índice
    lista.splice(index, 1);

    // 3️⃣ Atualizar localStorage
    localStorage.setItem("produtos-selecionados", JSON.stringify(lista));

    // 4️⃣ Atualizar visualmente o cesto
    atualizaCesto();
  });

  artigo.append(titulo, preco, botaoRemover);
  artigo.style.border = "1px solid #ddd";
  artigo.style.padding = "8px";
  artigo.style.margin = "5px 0";
  artigo.style.borderRadius = "5px";

  return artigo;
}

/* ==========================================================
   MODIFICAÇÕES NA FUNÇÃO adicionarAoCesto
========================================================== */
function adicionarAoCesto(produto) {
  let lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
  lista.push(produto);
  localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
  console.log(`✅ Produto "${produto.title}" adicionado ao cesto!`);

  // Atualiza o cesto visualmente
  atualizaCesto();
}

/* ==========================================================
   CHAMAR ATUALIZAÇÃO DO CESTO AO CARREGAR A PÁGINA
========================================================== */
document.addEventListener("DOMContentLoaded", function () {
  carregarProdutos(produtos);
  atualizaCesto(); // Mostra o cesto ao iniciar
});
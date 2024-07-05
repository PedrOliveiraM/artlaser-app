const addProductBtn = document.getElementById("add-product-btn");
const altProductBtn = document.getElementById("alt-product-btn");
const delProductBtn = document.getElementById("del-product-btn");
const painelMain = document.getElementById("main");
const title = document.getElementById("title");
addProductBtn.addEventListener("click", () => {
  painelMain.classList.remove("hidden");
  painelMain.classList.add("flex");
});


altProductBtn.addEventListener("click", () => {
  title.innerText = "Alterar Produto";

  painelMain.classList.remove("hidden");
  painelMain.classList.add("flex");
});

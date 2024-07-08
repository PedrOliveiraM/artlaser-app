document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pictureForm");
  const imageInput = document.getElementById("image");
  const imagePreviewContainer = document.getElementById(
    "imagePreviewContainer"
  );
  const imagePreview = document.getElementById("imagePreview");
  const cropImageBtn = document.getElementById("cropImageBtn");
  const selectionBox = document.getElementById("selectionBox");
  const cropWidth = 160;
  const cropHeight = 190;

  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  // Exibir o preview da imagem selecionada
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreviewContainer.classList.remove("hidden");
        resetSelectionBox();
      };
      reader.readAsDataURL(file);
    }
  });

  // Função para resetar a seleção da caixa
  function resetSelectionBox() {
    const imageRect = imagePreview.getBoundingClientRect();
    selectionBox.style.width = `${cropWidth}px`;
    selectionBox.style.height = `${cropHeight}px`;
    selectionBox.style.top = `${(imageRect.height - cropHeight) / 2}px`;
    selectionBox.style.left = `${(imageRect.width - cropWidth) / 2}px`;
  }

  // Eventos de arrastar a caixa de seleção
  selectionBox.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - selectionBox.offsetLeft;
    offsetY = e.clientY - selectionBox.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const imageRect = imagePreview.getBoundingClientRect();
      let newLeft = e.clientX - offsetX - imageRect.left;
      let newTop = e.clientY - offsetY - imageRect.top;

      // Limitar a caixa de seleção dentro dos limites da imagem
      newLeft = Math.max(
        0,
        Math.min(newLeft, imageRect.width - selectionBox.offsetWidth)
      );
      newTop = Math.max(
        0,
        Math.min(newTop, imageRect.height - selectionBox.offsetHeight)
      );

      selectionBox.style.left = `${newLeft}px`;
      selectionBox.style.top = `${newTop}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Evento de clique no botão de cortar imagem
  cropImageBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = function () {
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Calcular a escala da imagem carregada para o preview exibido
      const scaleFactor = imagePreview.width / imagePreview.naturalWidth;

      // Obter as coordenadas do canto superior esquerdo da seleção
      const selectionX =
        (selectionBox.offsetLeft - imagePreview.offsetLeft) / scaleFactor;
      const selectionY =
        (selectionBox.offsetTop - imagePreview.offsetTop) / scaleFactor;

      // Desenhar a região selecionada no canvas
      ctx.drawImage(
        img,
        selectionX,
        selectionY,
        cropWidth / scaleFactor,
        cropHeight / scaleFactor,
        0,
        0,
        cropWidth,
        cropHeight
      );

      // Exibir a imagem cortada para o usuário
      const croppedUrl = canvas.toDataURL("image/jpeg");
      imagePreview.src = croppedUrl;

      // Fechar a visualização da imagem
      imagePreviewContainer.classList.add("hidden");
    };
    img.src = imagePreview.src;
  });

  // Evento de envio do formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Verificar se todos os campos do formulário estão preenchidos
    if (!form.checkValidity()) {
      alert("Por favor, preencha todos os campos do formulário.");
      return;
    }

    // Criar FormData com os dados do formulário
    const formData = new FormData(form);

    // Adicionar a imagem cortada ao FormData
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    ctx.drawImage(imagePreview, 0, 0, cropWidth, cropHeight);
    canvas.toBlob(function (blob) {
      const croppedFile = new File([blob], "cropped-image.jpg", {
        type: "image/jpeg",
      });
      formData.set("image", croppedFile); // Substituir o arquivo original pelo arquivo cortado

      // Enviar formData para o servidor via fetch ou XMLHttpRequest
      const endpoint = "http://localhost:4000/pictures/";
      fetch(endpoint, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao enviar formulário");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Dados salvos com sucesso:", data);
          alert("Imagem enviada com sucesso!");
          form.reset(); // Limpar o formulário após o envio bem-sucedido
        })
        .catch((error) => {
          console.error("Erro ao enviar formulário:", error);
          alert(
            "Erro ao enviar formulário. Verifique o console para mais detalhes."
          );
        });
    }, "image/jpeg");
  });
});

// READY: MOSTRAR BOTOES DE OPCOES
const btnOptionsProducts = document.getElementById("btnOptionsProducts");
const menuOptionsProducts = document.getElementById("menuOptionsProducts");

const btnOptionsBanner = document.getElementById("btnOptionsBanners");
const menuOptionsBanner = document.getElementById("menuOptionsBanners");

btnOptionsProducts.addEventListener("click", () => {
  menuOptionsProducts.classList.toggle("hidden");
  menuOptionsProducts.classList.toggle("flex");
});

btnOptionsBanner.addEventListener("click", () => {
  menuOptionsBanner.classList.toggle("hidden");
  menuOptionsBanner.classList.toggle("flex");
});

//READY: MOSTRAR TELA DE ADIÇÃO DE PRODUTO
const addProductBtn = document.getElementById("addProductBtn");
const formAddProduct = document.getElementById("formAddProduct");
addProductBtn.addEventListener("click", () => {
  formAddProduct.classList.toggle("hidden");
});

//TODO: MOSTRAR TELA DE ADIÇÃO DE BANNER
const addBannerBtn = document.getElementById("addBannerBtn");
const formAddBanner = document.getElementById("formAddBanner");
addBannerBtn.addEventListener("click", () => {
  formAddBanner.classList.toggle("hidden");
});

//TODO: FUNÇÃO PARA ENVIAR BANNER PARA O SERVIDOR
// Adicione um listener para o evento de envio do formulário
document
  .getElementById("bannerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar o envio padrão do formulário

    // Criar FormData a partir do formulário
    const formData = new FormData(this);

    // Endpoint para enviar os dados
    const endpoint = "http://localhost:4000/banner/";

    // Enviar requisição fetch
    fetch(endpoint, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao enviar formulário");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Dados salvos com sucesso:", data);
        alert("Imagem enviada com sucesso!");
        this.reset(); // Limpar o formulário após o envio bem-sucedido
      })
      .catch((error) => {
        console.error("Erro ao enviar formulário:", error);
        alert(
          "Erro ao enviar formulário. Verifique o console para mais detalhes."
        );
      });
  });

//TODO: IMPLEMENTAR ALTERAÇÃO
const altProductBtn = document.getElementById("altProductBtn");

altProductBtn.addEventListener("click", () => {
  const telaDeAlteracao = document.getElementById("telaDeAlteracao");
  telaDeAlteracao.classList.toggle("hidden");

  fetch("http://localhost:4000/pictures/")
    .then((response) => response.json())
    .then((product) => {
      console.log(product);
      showItems(product);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
    });
  function showItems(products) {
    try {
      const catalog = document.getElementById("gridContainer");

      products.forEach((product) => {
        const item = document.createElement("div");
        item.innerHTML = `
          <div class="container-item w-44 h-auto py-2 flex flex-col items-center  gap-1 mt-2 relative">
            <img id="img" class="w-40 h-48 rounded-xl" src="${product.src}" alt="imagem" />
            <h2 id="nameProduct" class="nameProduct text-center font-semibold">${product.title}</h2>
            <div class="container-buy mt-1 flex justify-center items-center">
              <button class="text-white font-bold text-sm bg-yellow-600 w-32 h-8 rounded gap-2 flex justify-center items-center" id="btnAddCart" data-id="${product._id}" >
                <i class="fa-solid fa-pen-to-square"></i> Alterar
              </button>
            </div>
            </div>  
          </div>
        `;

        catalog.appendChild(item);
      });

      const items = document.querySelectorAll(".container-item");
      let maxHeight = 0;

      items.forEach((item) => {
        const itemHeight = item.offsetHeight;
        if (itemHeight > maxHeight) {
          maxHeight = itemHeight;
        }
      });

      items.forEach((item) => {
        item.style.height = `${maxHeight}px`;
      });

      const buttons = document.querySelectorAll("#btnAddCart");

      // Adiciona um evento de clique a cada botão
      buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
          // Captura o valor do data-id
          const dataId = event.target.getAttribute("data-id");
          console.log("ID do produto:", dataId);
          // Aqui você pode adicionar a lógica que deseja realizar com o data-id

          const modal = document.getElementById("modal");
          modal.classList.toggle("hidden");

          fetch(`http://localhost:4000/pictures/${dataId}`)
            .then((response) => response.json())
            .then((product) => {
              console.log(product);
              preencherForm(product);
            })
            .catch((error) => {
              console.error("Erro ao buscar dados:", error);
            });

          function preencherForm(product) {
            // Seleciona o formulário
            const form = document.getElementById("formAltProduct");

            // Preenche os campos do formulário com os dados do produto
            form.querySelector("#productId").value = product._id;
            form.querySelector("#title").value = product.title;
            form.querySelector("#description").value = product.description;
            form.querySelector("#qtdMin").value = product.qtdMin;
            form.querySelector("#category").value = product.category;
            form.querySelector("#retail").value = product.retail;
            form.querySelector("#wholesale").value = product.wholesale;
          }
        });
      });
    } catch (error) {
      console.error("Erro ao exibir catálogo:", error);
    }
  }
});

const form = document.getElementById("formAltProduct");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Previne o comportamento padrão de envio do formulário

  const id = form.querySelector("#productId").value;
  console.log("Código do submit id:", id);

  // Função para excluir o produto do servidor
  function deleteProduct(productId) {
    const url = `http://localhost:4000/pictures/${productId}`; // URL para a requisição DELETE

    fetch(url, {
      method: "DELETE", // Método da requisição
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Se a resposta for bem-sucedida, converte para JSON
        }
        throw new Error("Erro ao excluir o produto");
      })
      .then((data) => {
        console.log("Produto excluído com sucesso:", data);
        // Atualize a interface conforme necessário
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  }

  // Função para adicionar (ou atualizar) o produto no servidor
  function addProduct(formData) {
    const url = `http://localhost:4000/pictures/`; // URL para a requisição POST

    fetch(url, {
      method: "POST", // Método da requisição
      body: formData, // Envia o FormData que contém todos os dados do formulário
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Se a resposta for bem-sucedida, converte para JSON
        }
        throw new Error("Erro ao adicionar o produto");
      })
      .then((data) => {
        console.log("Produto adicionado com sucesso:", data);
        // Atualize a interface conforme necessário
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  }

  // Criar um FormData com os dados do formulário

  const formData = new FormData(form);

  // Adicionar a imagem cortada ao FormData
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  ctx.drawImage(imagePreview, 0, 0, cropWidth, cropHeight);
  canvas.toBlob(function (blob) {
    const croppedFile = new File([blob], "cropped-image.jpg", {
      type: "image/jpeg",
    });
    formData.set("image", croppedFile); // Substituir o arquivo original pelo arquivo cortado
  }, "image/jpeg");

  if (id) {
    // Se o ID estiver presente, primeiro exclua o produto existente
    deleteProduct(id);
  }

  // Em seguida, envie o formulário com o novo produto
  addProduct(formData);
});

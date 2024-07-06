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

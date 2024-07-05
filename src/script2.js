document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://localhost:4000/pictures/"; // Substitua pela URL correta da sua API

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Erro ao executar a requisição, status ${response.status}`
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      document.getElementById("pictureTitle").innerText = data[0].title;
      document.getElementById("pictureImage").src = data[0].src;
      document.getElementById("pictureDescription").innerText =
        data[0].description;
      //document.getElementById("pictureQtdmin").innerText = data[0].qtdmin;
      //document.getElementById("pictureCategory").innerText = data[0].category;
      document.getElementById("pictureRetail").innerText = data[0].retail;
      document.getElementById("pictureWholesale").innerText = data[0].wholesale;
    })
    .catch((error) => {
      console.error("Erro ao buscar os dados da API:", error);
    });
});

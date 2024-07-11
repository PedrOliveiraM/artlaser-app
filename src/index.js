function showCatalog(products) {
  try {
    const catalog = document.getElementById('gridContainer');
    catalog.innerHTML = '';

    products.forEach((product) => {
      const item = document.createElement('div');
      item.innerHTML = `
        <div class="container-item w-44 h-[500px] py-2 flex flex-col items-center  gap-1 mt-2 relative">
          <img id="img" class="w-40 h-48 rounded-xl" src="${
            product.src
          }" alt="imagem" />
          <h2 id="nameProduct" class="nameProduct text-center font-semibold">${
            product.title
          }</h2>
          <p id="descripcion" class="descripcion text-sm text-center max-w-full break-words">${
            product.description
          }</p>

        <div class="container-info text-center flex flex-col justify-center items-center  absolute bottom-0">
          <div class="values text-center flex flex-col">
            <label class="retail text-sm text-center max-w-full break-wordss font-bold">
              Varejo: <span id="retail">R$ ${product.retail.toFixed(2)}</span>
            </label>
            <label class="wholesale text-sm font-bold text-center max-w-full break-words">
              Atacado: <span id="wholesale">R$ ${product.wholesale.toFixed(
                2
              )}</span>
            </label>
            <label class="qtdMin text-sm text-center max-w-full break-words">
              A partir de: <span id="qtdMin">${product.qtdMin}</span> peças
            </label>
          </div>
          <div class="quantidade bg-gray-300 rounded w-32 h-7 flex justify-between items-center">
            <button id="btnDelProduct" class="btn-minus px-3 scroll-py-10 text-black font-semibold rounded-lg">-</button>
            <input class="ml-2 text-center w-12 h-10 bg-transparent outline-none font-bold" type="number" name="quantidade" value="1" />
            <button id="btnAddProduct" class="btn-plus px-3 py-1 text-black font-semibold rounded-lg">+</button>
          </div>
          <div class="container-buy mt-1 flex justify-center items-center">
            <button class="text-white font-bold text-sm bg-[#28A745] w-32 h-8 rounded gap-2 flex justify-center items-center" id="btnAddCart" data-id="${
              product._id
            }" >
              <i class="fa-solid fa-cart-plus"></i> Adicionar
            </button>
          </div>
          </div>  
        </div>
      `;

      catalog.appendChild(item);
    });

    const items = document.querySelectorAll('.container-item');
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

    const sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.add('hidden');
  } catch (error) {
    console.error('Erro ao exibir catálogo:', error);
  }
}

const btnTodos = document.getElementById('btnTodos');
btnTodos.addEventListener('click', () => {
  fetch('http://localhost:4000/pictures/')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      showCatalog(data);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
});

fetch('http://localhost:4000/pictures/')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    showCatalog(data);
    listCategorias(data);
  })
  .catch((error) => {
    console.error('Erro ao buscar dados:', error);
  });

function alterProcutsShow(categoria) {
  fetch(`http://localhost:4000/pictures/category/${categoria}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      showCatalog(data);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
}

//TODO: Implementar banners
// Função para buscar os dados do banner

function fetchBannerData() {
  fetch('http://localhost:4000/banner/')
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetch banner', data);
      createCarousel(data);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
}
function createCarousel(banners) {
  const bannersContainer = document.getElementById('banners');

  banners.forEach((banner) => {
    const item = document.createElement('div');
    item.classList.add('carousel-item');
    item.innerHTML = `
      <img class="w-screen h-auto rounded-xl" src="${banner.src}" alt="${banner.imageName}" />
    `;
    bannersContainer.appendChild(item);
  });

  const carouselItems = document.querySelectorAll('.carousel-item');
  const totalItems = carouselItems.length;
  const itemWidth = carouselItems[0].clientWidth;

  let currentIndex = 0;

  function showSlide(index) {
    const offset = -index * itemWidth;
    bannersContainer.style.transform = `translateX(${offset}px)`;
    currentIndex = index;
  }

  // Inicia o carrossel
  showSlide(currentIndex);

  // Intervalo para avançar automaticamente
  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalItems;
    showSlide(currentIndex);
  }, 3000); // Intervalo de 3 segundos para trocar os slides
}

fetchBannerData();

const btnSideMenu = document.getElementById('btnSideMenu');
const sideMenu = document.getElementById('sideMenu');

btnSideMenu.addEventListener('click', () => {
  sideMenu.classList.toggle('hidden');
});

window.addEventListener('click', function (event) {
  const modalSideMenu = document.getElementById('sideMenu');
  if (event.target === modalSideMenu) {
    modalSideMenu.classList.toggle('hidden');
  }
});

//READY: formatar letra
function capitalizeFirstLetter(string) {
  if (!string) return ''; // Verifica se a string está vazia ou indefinida
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// TODO: Implementar categorias de produtos
function listCategorias(products) {
  const categoriasContainer = document.getElementById('containerCategorias');
  const categoriasSet = new Set();

  products.forEach((product) => {
    const category = capitalizeFirstLetter(product.category);
    if (!categoriasSet.has(category)) {
      categoriasSet.add(category);
      const item = document.createElement('div');
      item.classList.add('categoria');
      item.innerHTML = `
        <button
          id="btnCategoria"
          data-item="${category}"
          class="flex w-full items-center justify-between px-2 border-b-2 py-1 border-gray-200"
        >
          ${category}
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      `;

      categoriasContainer.appendChild(item);
    }
  });

  // Corrigido o seletor e chamado no document
  const btnCategory = document.querySelectorAll('#btnCategoria');

  btnCategory.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const categoria = event.currentTarget.dataset.item;
      alterProcutsShow(categoria); // Verifique se a função está definida corretamente
    });
  });
}

//Na hora que clicar no botao de caegoria,
// esconder a grid principal
// e mostrar a grid de categorias

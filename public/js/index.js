document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', () => {
    onScroll();
    cuadroBuscar();
    verificarColision();
    focusInputProductos();
  });
  onScroll();
  nav();
  loadProducts();
  loadRecetas();

});
function loadProducts() {
  const carouselInner = document.getElementById("carrusel");

  // Función para cargar productos desde la API
  const fetchProducts = async () => {
      try {
          const response = await fetch('/api/productos');
          const products = await response.json();

          // Limpia el contenedor antes de agregar nuevos productos
          carouselInner.innerHTML = '';

          // Itera sobre los productos y crea el HTML necesario
          products.forEach((product) => {
              const productDiv = document.createElement("div");
              productDiv.classList.add("item");

              productDiv.innerHTML = `
                  <img src="${product.imagenUrl}" alt="">
                  <p>${product.nombre} ${product.gramaje} gr.</p>
                  <p>Bs/${product.precio}</p>
                  <a href="/productos">Ver más</a>
              `;

              carouselInner.appendChild(productDiv);
          });

          // Aplicar los estilos necesarios para hacer el carrusel desplazable
          initializeCarousel();
      } catch (error) {
          console.error("Error al cargar los productos:", error);
      }
  };

  // Llama a la función para obtener productos
  fetchProducts();

  // Estilos y configuración del carrusel
  function initializeCarousel() {
      // Aplicamos un estilo CSS para hacer que el contenedor sea desplazable
      carouselInner.style.display = 'flex';
      carouselInner.style.overflowX = 'auto';
      carouselInner.style.scrollBehavior = 'smooth';

      // Opcional: Añade un padding para que los productos no estén pegados a los bordes
      carouselInner.style.padding = '0px';

      // Establecemos que los items tengan un tamaño uniforme
      const items = document.querySelectorAll('.item');
      items.forEach(item => {
          item.style.margin = '0';  // Añade espacio entre los productos
      });
  }

  // Agregar eventos a los botones
  const prevBtn = document.getElementById('prevBtn1');
  const nextBtn = document.getElementById('nextBtn1');

  // Evento para el botón izquierdo
  prevBtn.addEventListener('click', () => {
      carouselInner.scrollBy({
          top: 0,
          left: -250, // Ajusta este valor según el tamaño de tus items
          behavior: 'smooth' // Desplazamiento suave
      });
  });

  // Evento para el botón derecho
  nextBtn.addEventListener('click', () => {
      carouselInner.scrollBy({
          top: 0,
          left: 250, // Ajusta este valor según el tamaño de tus items
          behavior: 'smooth' // Desplazamiento suave
      });
  });
}
function loadRecetas() {
  const carouselInner = document.getElementById("carrusel-recetas");

  // Función para cargar recetas desde la API
  const fetchRecetas = async () => {
      try {
          const response = await fetch('/api/recetas');
          const recetas = await response.json();

          // Limpia el contenedor antes de agregar nuevas recetas
          carouselInner.innerHTML = '';

          // Itera sobre las recetas y crea el HTML necesario
          recetas.forEach((receta) => {
              const recetaDiv = document.createElement("div");
              recetaDiv.classList.add("item");

              recetaDiv.innerHTML = `
                  <img src="${receta.imagenUrl}" alt="">
                  <p>${receta.nombreReceta}</p>
                  <p>${receta.descripcion}</p>
                  <a href="/recetas">Ver más</a>
              `;

              carouselInner.appendChild(recetaDiv);
          });

          // Aplicar los estilos necesarios para hacer el carrusel desplazable
          initializeCarousel();
      } catch (error) {
          console.error("Error al cargar las recetas:", error);
      }
  };

  // Llama a la función para obtener recetas
  fetchRecetas();

  // Estilos y configuración del carrusel
  function initializeCarousel() {
      // Aplicamos un estilo CSS para hacer que el contenedor sea desplazable
      carouselInner.style.display = 'flex';
      carouselInner.style.overflowX = 'auto';
      carouselInner.style.scrollBehavior = 'smooth';

      // Opcional: Añade un padding para que las recetas no estén pegadas a los bordes
      carouselInner.style.padding = '0px';

      // Establecemos que los items tengan un tamaño uniforme
      const items = document.querySelectorAll('.item');
      items.forEach(item => {
          item.style.margin = '0';  // Añade espacio entre las recetas
      });
  }

  // Agregar eventos a los botones
  const prevBtn = document.getElementById('prevBtn2');
  const nextBtn = document.getElementById('nextBtn2');

  // Evento para el botón izquierdo
  prevBtn.addEventListener('click', () => {
      carouselInner.scrollBy({
          top: 0,
          left: -250, // Ajusta este valor según el tamaño de tus items
          behavior: 'smooth' // Desplazamiento suave
      });
  });

  // Evento para el botón derecho
  nextBtn.addEventListener('click', () => {
      carouselInner.scrollBy({
          top: 0,
          left: 250, // Ajusta este valor según el tamaño de tus items
          behavior: 'smooth' // Desplazamiento suave
      });
  });
}

function onScroll() {
  const nav = document.getElementById('nav');
  const mainSections = document.querySelectorAll('.seccion');
  const texto = document.querySelectorAll('.link');
  const nombreLogo = document.querySelector('.nombre-logo h1');
  const navBottom = nav.getBoundingClientRect().bottom;

  let isTouchingSection = false;

  mainSections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionBottom = section.getBoundingClientRect().bottom;

    // Verifica si el nav está tocando la sección
    if (navBottom >= sectionTop && navBottom <= sectionBottom) {
      isTouchingSection = true;
    }
  });

  // Si el nav toca cualquier seccion, se agrega la clase 'scrolled'
  if (isTouchingSection) {
    if (!nav.classList.contains('scrolled')) {
      nav.classList.add('scrolled');
      nombreLogo.classList.add('scrolled');
      texto.forEach(el => {
        el.classList.add('scrolled');
      });
    }
  } else {
    // Si el nav no está tocando ninguna seccion, se quita la clase 'scrolled'
    if (nav.classList.contains('scrolled')) {
      nav.classList.remove('scrolled');
      nombreLogo.classList.remove('scrolled');
      texto.forEach(el => {
        el.classList.remove('scrolled');
      });
    }
  }
}
function contacto(behaviorType = 'smooth') {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: behaviorType // 'smooth' o 'auto' para scroll instantáneo
  });
  menu();
}
function nav(){
  const currentPath = window.location.pathname; // Obtiene la ruta actual, ej: "/productos"
    const navLinks = document.querySelectorAll('.link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active-link');
        }
    });
}

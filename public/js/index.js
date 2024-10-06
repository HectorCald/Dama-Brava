document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', () => {
    onScroll();
    cuadroBuscar();
    verificarColision();
    focusInputProductos();
  });
  loadProducts();
  loadRecetas();
  onScroll();
    const currentPath = window.location.pathname; // Obtiene la ruta actual, ej: "/productos"
    const navLinks = document.querySelectorAll('.link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active-link');
        }
    });
});
function loadProducts() {
  let producto = document.querySelectorAll('#carrusel .item');
    producto.forEach(element => {
        element.classList.add('loading');
    });
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
        initializeCarousel()
        producto.forEach(element => {
          element.classList.remove('loading');
      });
      });
      
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  // Llama a la función para obtener productos
  fetchProducts();
}
function loadRecetas() {
    const carouselInner = document.getElementById("carrusel-recetas");
  
    // Función para cargar productos desde la API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/recetas'); // Cambia 'TU_API_URL' por la URL de tu API
        const products = await response.json();
  
        // Limpia el contenedor antes de agregar nuevos productos
        carouselInner.innerHTML = '';
  
        // Itera sobre los productos y crea el HTML necesario
        products.forEach((product) => {
          const productDiv = document.createElement("div");
          productDiv.classList.add("item");
  
          productDiv.innerHTML = `
              <img src="${product.imagenUrl}" alt="">
              <p>${product.nombreReceta}</p>
              <p>Bs/${product.descripcion}</p>
              <a href="/productos">Ver mas</a>
          `;
          carouselInner.appendChild(productDiv);
          initializeCarousel()
          
        });
  
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };
  
    // Llama a la función para obtener productos
    fetchProducts();
}
function initializeCarousel() {
    const items = document.querySelectorAll('.item');
    const totalItems = items.length;

    // Ajusta la duración de la animación en función del número de items
    const duration = totalItems * 2; // 2 segundos por cada item en la animación
    items.forEach(item => {
        item.style.animationDuration = `${duration}s`; // Ajusta la duración de cada item
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
}

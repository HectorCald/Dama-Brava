document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
        onScroll();
        cuadroBuscar2();
      });
    filtrarNombres2();
    obtenerRecetas();
    recomendacion2();
    focusInputRecetas();
    carruselRecetas(recetas);
});
async function obtenerRecetas() {
    try {
        const response = await fetch('/api/recetas');
        if (!response.ok) {
            throw new Error('Error al obtener recetas');
        }
        const recetas = await response.json();
        carruselRecetas(recetas);
    } catch (error) {
        console.error(error);
    }
}
const recetas = [ 
    { nombreReceta: "Receta 1", descripcion: "Descripción 1", imagenUrl: "imagen1.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 2", descripcion: "Descripción 2", imagenUrl: "imagen2.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 1", descripcion: "Descripción 1", imagenUrl: "imagen1.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 2", descripcion: "Descripción 2", imagenUrl: "imagen2.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 1", descripcion: "Descripción 1", imagenUrl: "imagen1.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 2", descripcion: "Descripción 2", imagenUrl: "imagen2.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 1", descripcion: "Descripción 1", imagenUrl: "imagen1.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 2", descripcion: "Descripción 2", imagenUrl: "imagen2.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 1", descripcion: "Descripción 1", imagenUrl: "imagen1.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 2", descripcion: "Descripción 2", imagenUrl: "imagen2.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 1", descripcion: "Descripción 1", imagenUrl: "imagen1.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 2", descripcion: "Descripción 2", imagenUrl: "imagen2.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 1", descripcion: "Descripción 1", imagenUrl: "imagen1.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 2", descripcion: "Descripción 2", imagenUrl: "imagen2.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 1", descripcion: "Descripción 1", imagenUrl: "imagen1.jpg", linkReceta: "#" },
    { nombreReceta: "Receta 2", descripcion: "Descripción 2", imagenUrl: "imagen2.jpg", linkReceta: "#" },
];
function carruselRecetas(recetas) {
    const recetasContainer = document.querySelector('#recetas');
    const itemsPerPage = 6; // 2 columnas x 3 filas
    let currentPage = 0;

    // Ordenar recetas alfabéticamente por nombre
    recetas.sort((a, b) => a.nombreReceta.localeCompare(b.nombreReceta));

    const totalPages = Math.ceil(recetas.length / itemsPerPage);

    function mostrarRecetas() {
        recetasContainer.innerHTML = ""; // Limpiar contenedor

        const paginaDiv = document.createElement('div');
        paginaDiv.classList.add('pagina2'); // Clase para agrupar las recetas en una página

        const start = currentPage * itemsPerPage;
        const end = Math.min(start + itemsPerPage, recetas.length);
        const recetasPagina = recetas.slice(start, end);

        recetasPagina.forEach(receta => {
            const recetaDiv = document.createElement('div');
            recetaDiv.classList.add('receta');
            recetaDiv.innerHTML = `
                <img src="${receta.imagenUrl}" alt="${receta.nombreReceta}">
                <div class="texto-receta">
                    <h2 class="nombre-receta">${receta.nombreReceta}</h2>
                    <p>${receta.descripcion}</p>
                    <a class="btn-page-corto-red" href="${receta.linkReceta}" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
                        </svg>
                        Ver video
                    </a>
                </div>
            `;
            paginaDiv.appendChild(recetaDiv); // Añadir receta a la página
        });

        recetasContainer.appendChild(paginaDiv); // Añadir la página al contenedor principal
    }

    function mostrarPagina() {
        mostrarRecetas(); // Mostrar recetas de la página actual
        window.scrollTo({ top: 0, behavior: 'smooth' });
        actualizarBotones(); // Actualizar visibilidad de botones
    }

    function actualizarBotones() {
        const prevBtn = document.getElementById('prevBtn3');
        const nextBtn = document.getElementById('nextBtn3');
        const pageBtnContainer = document.getElementById('pageButtons'); // Contenedor para botones de páginas

        // Limpiar botones de página
        pageBtnContainer.innerHTML = '';

        // Crear botones de página
        for (let i = 0; i < totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.innerText = i + 1;
            pageBtn.classList.add('page-btn');
            if (i === currentPage) {
                pageBtn.classList.add('active'); // Marcar página actual
            }

            // Añadir evento click para navegar a la página específica
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                mostrarPagina();
            });

            pageBtnContainer.appendChild(pageBtn); // Añadir botón de página al contenedor
        }

        // Habilitar o deshabilitar el botón "Anterior"
        if (currentPage > 0) {
            prevBtn.classList.remove('disabled');
            prevBtn.disabled = false;
        } else {
            prevBtn.classList.add('disabled');
            prevBtn.disabled = true;
        }

        // Habilitar o deshabilitar el botón "Siguiente"
        if (currentPage < totalPages - 1) {
            nextBtn.classList.remove('disabled');
            nextBtn.disabled = false;
        } else {
            nextBtn.classList.add('disabled');
            nextBtn.disabled = true;
        }
    }

    document.getElementById('prevBtn3').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            mostrarPagina();
        }
    });

    document.getElementById('nextBtn3').addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            mostrarPagina();
        }
    });

    mostrarPagina(); // Mostrar la primera página al cargar
}
function cuadroBuscar2(){
    const miDiv = document.getElementById('seccion-buscar-recetas');
    const btnBuscar = document.querySelector('.btn-buscar');
    const btnBorrar = document.querySelector('.btn-borrar-input');
    const originalOffset = miDiv.offsetTop; // Obtiene la posición original de la div

    // Comprueba si el scroll ha pasado la posición original de la div
    if (window.scrollY > originalOffset) {
        miDiv.classList.add('fixed'); // Añade la clase 'fixed'
        btnBuscar.classList.add('fixed');
        btnBorrar.classList.add('fixed');
        contador.classList.add('fixed');
    } else {
        miDiv.classList.remove('fixed'); // Elimina la clase 'fixed'
        btnBuscar.classList.remove('fixed');
        btnBorrar.classList.remove('fixed');
        contador.classList.remove('fixed');
    }
}
function filtrarPorTexto2() {
    const filterValue = normalizarTexto(document.getElementById('busquedaInput2').value.toLowerCase());
    const input = document.getElementById('busquedaInput2');
    const items = document.querySelectorAll('#recetas .receta');
    const borrarInput = document.querySelector('.btn-borrar-input');
    const buscarInput = document.querySelector('.btn-buscar');
    const contenedor = document.getElementById('sugerencias2');
    const mensajeNoCoincidencias = document.querySelector('.mensaje-no-recetas');

    if (input.value != '') {
        borrarInput.style.display = 'flex';
        buscarInput.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        contenedor.style.display = 'none';
        
        let hayCoincidencias = false; // Variable para verificar si hay coincidencias

        items.forEach(function(item) {
            const text = normalizarTexto(item.querySelector('p').textContent.toLowerCase());

            // Comprobar si el texto de la etiqueta p incluye el valor del input
            if (text.includes(filterValue)) {
                item.style.display = ''; // Mostrar el div
                hayCoincidencias = true; // Hay al menos una coincidencia
            } else {
                item.style.display = 'none'; // Ocultar el div
            }
        });

        // Mostrar el mensaje si no hay coincidencias
        if (!hayCoincidencias) {
            mensajeNoCoincidencias.style.display = 'flex'; // Mostrar el mensaje
        } else {
            mensajeNoCoincidencias.style.display = 'none'; // Ocultar el mensaje si hay coincidencias
        }
    }
}
function normalizarTexto(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function borrarInput2(){
    const borrarInput = document.querySelector('.btn-borrar-input');
    const buscarInput = document.querySelector('.btn-buscar');
    const input = document.getElementById('busquedaInput2');
    const contenedor = document.getElementById('sugerencias2');
    const mensajeNoCoincidencias = document.querySelector('.mensaje-no-recetas').style.display='none';
    borrarInput.style.display = 'none';
    buscarInput.style.display = 'flex';
    input.value='';
    input.focus();
    contenedor.style.display='none'
    obtenerRecetas();
}
function focusInputRecetas() {
    const borrarInput = document.querySelector('.btn-borrar-input');
    const buscarInput = document.querySelector('.btn-buscar');
    const input = document.getElementById('busquedaInput2');

    input.addEventListener('focus', function() {
        borrarInput.style.display = 'none';
        buscarInput.style.display = 'flex';
    });
}
function todosRecetas(){
    const input = document.getElementById('busquedaInput2');
    input.value = '';
    const borrarInput = document.querySelector('.btn-borrar-input');
    const buscarInput = document.querySelector('.btn-buscar');
    const mensajeNoCoincidencias = document.querySelector('.mensaje-no-recetas').style.display='none';
    borrarInput.style.display = 'none';
    buscarInput.style.display = 'flex';
    obtenerRecetas();
}
function recomendacion2() {
    const contenedor = document.getElementById('sugerencias2');

    // Limpiar el contenedor antes de agregar nuevos elementos
    contenedor.innerHTML = '';

    // Función para cargar productos desde la API
    const fetchProducts = async () => {
        const response = await fetch('/api/recetas');
        const nombres = await response.json();

        // Función para capitalizar la primera letra y convertir el resto a minúsculas
        const capitalizarNombre = (nombre) => {
            return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
        };

        // Itera sobre los productos y crea el HTML necesario
        nombres.forEach(producto => {
            // Crear un nuevo párrafo para cada nombre de producto
            const parrafo = document.createElement('p');
            parrafo.textContent = capitalizarNombre(producto.nombreReceta); // Aplica la función de capitalización
            contenedor.appendChild(parrafo); // Agrega el párrafo al contenedor
        }); 
        configurarClickParrafos2();

        // Remover clase de carga de los elementos del contenedor si es necesario
        // Puedes implementar esta parte según lo que necesites
    };

    // Llama a la función para obtener productos
    fetchProducts();
}
function filtrarNombres2() {
    const input = document.getElementById('busquedaInput2');
    const contenedor = document.getElementById('sugerencias2');
    const parrafos = contenedor.getElementsByTagName('p');
    

    // Escuchar el evento 'input' en el campo de texto
    input.addEventListener('input', () => {
        // Normalizar el valor del input para eliminar tildes
        const filtro = normalizarTexto(input.value.toLowerCase());

        // Si el input está vacío, ocultar el contenedor
        if (filtro === '') {
            contenedor.style.display = 'none';
            return; // Salir de la función si no hay texto
        } else {
            contenedor.style.display = 'flex'; // Mostrar el contenedor si hay texto
        }

        // Iterar sobre cada párrafo y mostrar/ocultar según el filtro
        Array.from(parrafos).forEach(parrafo => {
            // Normalizar el texto del párrafo
            const texto = normalizarTexto(parrafo.textContent.toLowerCase());

            if (texto.includes(filtro)) {
                parrafo.style.display = ''; // Mostrar el párrafo si coincide con el filtro
            } else {
                parrafo.style.display = 'none'; // Ocultar el párrafo si no coincide
            }
        });
    });
}
function configurarClickParrafos2() {
    const input = document.getElementById('busquedaInput2');
    const parrafos = document.querySelectorAll('#sugerencias2 p');
    const contenedor = document.getElementById('sugerencias2')
    parrafos.forEach(element => {
        element.addEventListener('click', () => {
            input.value = element.textContent;
            filtrarPorTexto2()
            contenedor.style.display='none';
        });
    });
}
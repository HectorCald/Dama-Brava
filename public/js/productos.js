document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
      onScroll();
      cuadroBuscar();
      verificarColision();
      focusInputProductos();
    });
    obtenerProductos();
    recomendacion();
    focusInputProductos();
    filtrarNombres();
    carruselProductos(productosJSON);
});
async function obtenerProductos() {
    let producto = document.querySelectorAll('.producto');
    producto.forEach(element => {
        element.classList.add('loading');
    });
    try {
        const response = await fetch('/api/productos');
        
        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }

        const productos = await response.json();
        carruselProductos(productos);
    } catch (error) {
        console.error(error);
        producto.forEach(element => {
            element.style.display='none';
        });
        const mensajeNoCoincidencias = document.querySelector('.mensaje-no');
        mensajeNoCoincidencias.style.display='flex';
        mensajeNoCoincidencias.textContent='Revisa tu conexion y intentalo mas tarde!'
    }
}
const productosJSON = [
    { nombre: "Producto 1", precio: "$10", descripcion: "Descripción del Producto 1" },
    { nombre: "Producto 2", precio: "$15", descripcion: "Descripción del Producto 2" },
    { nombre: "Producto 3", precio: "$20", descripcion: "Descripción del Producto 3" },
    { nombre: "Producto 4", precio: "$25", descripcion: "Descripción del Producto 4" },
    { nombre: "Producto 5", precio: "$30", descripcion: "Descripción del Producto 5" },
    { nombre: "Producto 6", precio: "$35", descripcion: "Descripción del Producto 6" },
    { nombre: "Producto 7", precio: "$40", descripcion: "Descripción del Producto 7" },
    { nombre: "Producto 8", precio: "$45", descripcion: "Descripción del Producto 8" },
    { nombre: "Producto 9", precio: "$50", descripcion: "Descripción del Producto 9" },
    { nombre: "Producto 10", precio: "$55", descripcion: "Descripción del Producto 10" },
    { nombre: "Producto 11", precio: "$60", descripcion: "Descripción del Producto 11" },
    { nombre: "Producto 12", precio: "$65", descripcion: "Descripción del Producto 12" },
    { nombre: "Producto 11", precio: "$60", descripcion: "Descripción del Producto 11" },
    { nombre: "Producto 12", precio: "$65", descripcion: "Descripción del Producto 12" },   
];
function carruselProductos(productos) {
    const productosContainer = document.querySelector('#productos');
    const carritoContainer = document.querySelector('#carrito');
    const compraDiv = document.querySelector('.compra');
    const subtotalElement = document.querySelector('.subtotal');
    const btnHacerPedido = document.querySelector('.btn-pedido'); // Botón de hacer pedido
    const itemsPerPage = 12;
    let currentPage = 0;
    let subtotal = 0;

    // Ordenar productos alfabéticamente por el nombre
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

    const totalPages = Math.ceil(productos.length / itemsPerPage);

    function mostrarProductos() {
        productosContainer.innerHTML = "";

        const start = currentPage * itemsPerPage;
        const end = Math.min(start + itemsPerPage, productos.length);
        const productosPagina = productos.slice(start, end);

        productosPagina.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            productoDiv.innerHTML = `
                <img src="${producto.imagenUrl}" alt="">
                <p class="nombre-producto">${producto.nombre} ${producto.gramaje} gr.</p>
                <p><span class="precio">Bs/${producto.precio}</span></p>
                <div class="cantidad">
                    <button class="btn-decrementar">-</button>
                    <p class="cantidad-numero">0</p>
                    <button class="btn-incrementar">+</button>
                </div>
                <button onclick="iniciarActualizacion()" class="btn-anadir-carrito">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>Añadir al carrito
                </button>
            `;
            productosContainer.appendChild(productoDiv);
            productoDiv.classList.add('loading');

            const btnIncrementar = productoDiv.querySelector('.btn-incrementar');
            const btnDecrementar = productoDiv.querySelector('.btn-decrementar');
            const cantidadNumero = productoDiv.querySelector('.cantidad-numero');
            const btnAnadirCarrito = productoDiv.querySelector('.btn-anadir-carrito');

            let cantidad = 0;

            btnIncrementar.addEventListener('click', () => {
                cantidad++;
                cantidadNumero.textContent = cantidad;
            });

            btnDecrementar.addEventListener('click', () => {
                if (cantidad > 0) {
                    cantidad--;
                    cantidadNumero.textContent = cantidad;
                }
            });

            btnAnadirCarrito.addEventListener('click', () => {
                if (cantidad > 0) {
                    const totalPrecio = (cantidad * producto.precio).toFixed(2);
                    const pedidoDiv = document.createElement('div');
                    pedidoDiv.classList.add('pedido');
                    pedidoDiv.innerHTML = `
                        <div class="pedido-detalle">
                            <img src="${producto.imagenUrl}" alt="">
                            <div class="texto-pedido">
                                <p>${producto.nombre} ${producto.gramaje} gr</p>
                                <p>Subtotal: ${cantidad} x Bs/${totalPrecio}</p>
                            </div>
                        </div>
                        <button class="btn-eliminar" onclick="iniciarActualizacion()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </button>
                    `;
                    compraDiv.appendChild(pedidoDiv);
                    subtotal += parseFloat(totalPrecio);
                    subtotalElement.textContent = `Bs/${subtotal.toFixed(2)}`;
                    cantidad = 0;
                    cantidadNumero.textContent = cantidad;

                    const btnEliminar = pedidoDiv.querySelector('.btn-eliminar');
                    btnEliminar.addEventListener('click', () => {
                        pedidoDiv.remove();
                        subtotal -= parseFloat(totalPrecio);
                        subtotalElement.textContent = `Bs/${subtotal.toFixed(2)}`;
                    });
                }
            });
        });
    }

    btnHacerPedido.addEventListener('click', () => {
        let mensaje = "¡Buenas! Me gustaría hacer el siguiente pedido:\n\n";
        
        const pedidos = compraDiv.querySelectorAll('.pedido');
        pedidos.forEach(pedido => {
            const nombreProducto = pedido.querySelector('.texto-pedido p:first-child').innerText; // Nombre y gramaje del producto
            const cantidadYPrecio = pedido.querySelector('.texto-pedido p:nth-child(2)').innerText; // Cantidad y precio total
            mensaje += `- ${nombreProducto}\n${cantidadYPrecio}\n`;
        });

        mensaje += `\nTotal: ${subtotalElement.textContent}`;

        // Reemplaza el número de WhatsApp con el tuyo
        const numeroWhatsApp = '59170325449'; 
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensaje)}`;
        
        window.open(urlWhatsApp, '_blank'); // Abre WhatsApp con el mensaje
    });

    function mostrarPagina() {
        mostrarProductos();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        actualizarBotones();
    }

    function actualizarBotones() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const pageBtnContainer = document.getElementById('paginacion'); // Contenedor para botones de páginas

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

    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            mostrarPagina();
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            mostrarPagina();
        }
    });

    mostrarPagina(); // Muestra la primera página de productos
}
function showDiv() {
    const slidingDiv = document.getElementById('carrito');
    slidingDiv.classList.add('show');
}
function hideDiv() {
    const slidingDiv = document.getElementById('carrito');
    slidingDiv.classList.remove('show');
}
function filtrarPorTexto() {
    const filterValue = normalizarTexto(document.getElementById('busquedaInput').value.toLowerCase());
    const input = document.getElementById('busquedaInput');
    const items = document.querySelectorAll('#productos .producto');
    const borrarInput = document.querySelector('.btn-borrar-input');
    const buscarInput = document.querySelector('.btn-buscar');
    const contenedor = document.getElementById('sugerencias');
    const mensajeNoCoincidencias = document.querySelector('.mensaje-no');

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
function borrarInput(){
    const borrarInput = document.querySelector('.btn-borrar-input');
    const buscarInput = document.querySelector('.btn-buscar');
    const input = document.getElementById('busquedaInput');
    const contenedor = document.getElementById('sugerencias');
    const mensajeNoCoincidencias = document.querySelector('.mensaje-no').style.display='none';
    borrarInput.style.display = 'none';
    buscarInput.style.display = 'flex';
    input.value='';
    input.focus();
    contenedor.style.display='none'
    obtenerProductos();
}
function focusInputProductos() {
    const borrarInput = document.querySelector('.btn-borrar-input');
    const buscarInput = document.querySelector('.btn-buscar');
    const input = document.getElementById('busquedaInput');

    input.addEventListener('focus', function() {
        borrarInput.style.display = 'none';
        buscarInput.style.display = 'flex';
    });
}
function todosProductos(){
    const input = document.getElementById('busquedaInput');
    input.value = '';
    const borrarInput = document.querySelector('.btn-borrar-input');
    const buscarInput = document.querySelector('.btn-buscar');
    const mensajeNoCoincidencias = document.querySelector('.mensaje-no').style.display='none';
    borrarInput.style.display = 'none';
    buscarInput.style.display = 'flex';
    obtenerProductos();
}
function enterosProductos(){
    const input = document.getElementById('busquedaInput');
    input.value = 'entero';
    filtrarPorTexto();
    input.value = '';
    const borrarInput = document.querySelector('.btn-borrar-input');
    const buscarInput = document.querySelector('.btn-buscar');
    borrarInput.style.display = 'none';
    buscarInput.style.display = 'flex';
}
function molidosProductos(){
    const input = document.getElementById('busquedaInput');
    input.value = 'molido';
    filtrarPorTexto();
    input.value = '';
    const borrarInput = document.querySelector('.btn-borrar-input');
    const buscarInput = document.querySelector('.btn-buscar');
    borrarInput.style.display = 'none';
    buscarInput.style.display = 'flex';

}
function cuadroBuscar(){
    const miDiv = document.getElementById('seccion-buscar-productos');
    const btnBuscar = document.querySelector('.btn-buscar');
    const btnBorrar = document.querySelector('.btn-borrar-input');
    const contador = document.querySelector('.seccion-productos .buscador .btn-carrito p');
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
function verificarColision() {
    const carrito = document.querySelector('.carrito');
    const bandera = document.querySelector('.bandera');
    const carritoRect = carrito.getBoundingClientRect();
    const banderaRect = bandera.getBoundingClientRect();

    // Verifica si hay colisión entre las dos divs
    const colision =
        carritoRect.right > banderaRect.left &&
        carritoRect.left < banderaRect.right &&
        carritoRect.bottom > banderaRect.top &&
        carritoRect.top < banderaRect.bottom;

    // Si hay colisión, quita la clase 'show'
    if (colision) {
        const pantalla = document.querySelector('.productos2');
        const buscador = document.querySelector('.buscador');
        const titulo = document.querySelector('.titulo-seccion');
        pantalla.style.filter = 'none';
        pantalla.style.pointerEvents = 'auto';
        pantalla.style.overflow = 'auto';
        buscador.style.filter = 'none';
        buscador.style.pointerEvents = 'auto';
        buscador.style.overflow = 'auto';
        titulo.style.filter = 'none';
        titulo.style.pointerEvents = 'auto';
        titulo.style.overflow = 'auto';
        carrito.classList.remove('show')
    }
}
function contarImagenes() {
    const contenedor = document.getElementById('carrito');
    const imagenes = contenedor.getElementsByTagName('img');
    const contador = document.getElementById('contador');
    contador.innerText = imagenes.length;
    if(contador==0){
        activarBorroso();
    }
}
function iniciarActualizacion() {
    contarImagenes(); // Llama a la función al iniciar
    const intervalo = setInterval(contarImagenes, 500); // Actualiza cada 1 segundo

    // Detén la actualización después de 5 segundos
    setTimeout(() => {
        clearInterval(intervalo);
    }, 2000);
}
function recomendacion() {
    const contenedor = document.getElementById('sugerencias');

    // Limpiar el contenedor antes de agregar nuevos elementos
    contenedor.innerHTML = '';

    // Función para cargar productos desde la API
    const fetchProducts = async () => {
        const response = await fetch('/api/productos');
        const nombres = await response.json();

        // Función para capitalizar la primera letra y convertir el resto a minúsculas
        const capitalizarNombre = (nombre) => {
            return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
        };

        // Itera sobre los productos y crea el HTML necesario
        nombres.forEach(producto => {
            // Crear un nuevo párrafo para cada nombre de producto
            const parrafo = document.createElement('p');
            parrafo.textContent = capitalizarNombre(producto.nombre); // Aplica la función de capitalización
            contenedor.appendChild(parrafo); // Agrega el párrafo al contenedor
        }); 
        configurarClickParrafos();

        // Remover clase de carga de los elementos del contenedor si es necesario
        // Puedes implementar esta parte según lo que necesites
    };

    // Llama a la función para obtener productos
    fetchProducts();
}
function filtrarNombres() {
    const input = document.getElementById('busquedaInput');
    const contenedor = document.getElementById('sugerencias');
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
function normalizarTexto(texto) {
    // Crear un mapa de caracteres con y sin tilde
    const tildes = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
    return texto.split('').map(caracter => tildes[caracter] || caracter).join('');
}
function configurarClickParrafos() {
    const input = document.getElementById('busquedaInput');
    const parrafos = document.querySelectorAll('#sugerencias p');
    const contenedor = document.getElementById('sugerencias')
    parrafos.forEach(element => {
        element.addEventListener('click', () => {
            input.value = element.textContent;
            filtrarPorTexto()
            contenedor.style.display='none';
        });
    });
}
function activarBorroso() {
    const pantalla = document.querySelector('.productos2');
    const buscador = document.querySelector('.buscador');
    const titulo = document.querySelector('.titulo-seccion');

    if (pantalla.style.filter === 'blur(10px)') {
        pantalla.style.filter = 'none';
        pantalla.style.pointerEvents = 'auto';
        pantalla.style.overflow = 'auto';
        buscador.style.filter = 'none';
        buscador.style.pointerEvents = 'auto';
        buscador.style.overflow = 'auto';
        titulo.style.filter = 'none';
        titulo.style.pointerEvents = 'auto';
        titulo.style.overflow = 'auto';
        hideDiv();
    } else {
        pantalla.style.filter = 'blur(10px)';
        pantalla.style.pointerEvents = 'none';
        pantalla.style.overflow = 'hidden';
        buscador.style.filter = 'blur(10px)';
        buscador.style.pointerEvents = 'none';
        buscador.style.overflow = 'hidden';
        titulo.style.filter = 'blur(10px)';
        titulo.style.pointerEvents = 'none';
        titulo.style.overflow = 'hidden';
        showDiv();
    }
    
}
let lastTouch = 0;

document.addEventListener('touchstart', function(event) {
    const currentTime = new Date().getTime();
    if (currentTime - lastTouch <= 300) {
        event.preventDefault(); // Evita que el doble toque provoque el zoom
    }
    lastTouch = currentTime;
}, { passive: false });


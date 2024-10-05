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
        mostrarProductos2(productos);
    } catch (error) {
        console.error(error);
        producto.forEach(element => {
            element.style.display='none';
        });
    }
}
function mostrarProductos2(productos) {
    const contenedorProductos = document.getElementById('productos');
    let producto = document.querySelectorAll('.producto');
    producto.forEach(element => {
        element.classList.remove('loading');
    });

    // Ordenar productos por nombre (puedes cambiar esto a precio o gramaje según prefieras)
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Limpiar el contenedor antes de agregar nuevos productos
    contenedorProductos.innerHTML = '';
    

    productos.forEach(producto => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('producto');
        divProducto.innerHTML = `
            <img src="${producto.imagenUrl}" alt="">
            <p class="nombre-producto">${producto.nombre} ${producto.gramaje} gr.</p>
            <p><span class="precio">Bs/${producto.precio}</span></p>
            <div class="cantidad">
                <button class="btn-decrementar">-</button>
                <p class="cantidad-numero">0</p>
                <button class="btn-incrementar">+</button>
            </div>
            <button><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
        </svg>Añadir al carrito</button>
        `;
        contenedorProductos.appendChild(divProducto);
    });

}
async function obtenerRecetas() {
    try {
        const response = await fetch('/api/recetas');
        if (!response.ok) {
            throw new Error('Error al obtener recetas');
        }
        const recetas = await response.json();
        mostrarRecetas2(recetas);
    } catch (error) {
        console.error(error);
    }
}
function mostrarRecetas2(recetas) {
    const contenedorRecetas = document.getElementById('recetasPrincipal');

    // Limpiar el contenedor antes de agregar nuevas recetas
    contenedorRecetas.innerHTML = '';

    recetas.forEach(receta => {
        const divReceta = document.createElement('div');
        divReceta.classList.add('cuadroReceta'); // Clase para estilo, ajusta según tu CSS

        divReceta.innerHTML = `
            <img src="${receta.imagenUrl}" alt="${receta.nombreReceta}"> <!-- Asegúrate de que la propiedad sea correcta -->
            <div class="textoReceta">
                <h1>${receta.nombreReceta}</h1>
                <p>${receta.descripcion}</p>
                <a class="botonPage" href="${receta.linkReceta}" target="_blank">VER VIDEO</a> <!-- Asegúrate de que la propiedad sea correcta -->
            </div>
        `;
        contenedorRecetas.appendChild(divReceta);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    
    mostrarProductos();
    mostrarRecetas();
    obtenerProductos();
    obtenerRecetas();
    aniamcionEntrada();  
    botonNavbarAdm();
    setInterval(actualizarContador, 500);
    setInterval(verificarImagenesYActualizarBoton, 500);
})
function secciones(){
    const cuadroMenu = document.querySelector('.menu');
    let secciones = document.querySelectorAll('.seccion');

    secciones.forEach(element => {
        const imagen = document.querySelector('.botonImagen');
        element.addEventListener('click', function(){
            cuadroMenu.classList.add('mostrar')
            if(cuadroMenu.classList.contains('mostrar')){
                imagen.src = './Imagenes2/imgIconos/menu_close.webp';
            }
            else{
                imagen.src = './Imagenes2/imgIconos/menu_open.webp';
            }
        })
    });
}
function contacto(){
    let links = document.querySelectorAll('.link');
    window.scrollTo({
        top: document.body.scrollHeight, behavior: 'smooth'
    });
    menu()
}
function menu(){
    const imagen = document.querySelector('.botonImagen');
    const cuadroMenu = document.querySelector('.menu');
    cuadroMenu.classList.toggle('mostrar')
    if(cuadroMenu.classList.contains('mostrar')){
        imagen.src = './Imagenes2/imgIconos/menu_close.webp';
    }
    else{
        imagen.src = './Imagenes2/imgIconos/menu_open.webp';
    }
}

//funciones de la seccion inicio
function botonProductos(){
}
function botonNosotros(){
}

//funciones de animaciones
function aniamcionEntrada(){
    const elements = document.querySelectorAll('.slide-in');

    const observer = new IntersectionObserver((entries, observer)=>{
        entries.forEach(entry =>{
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
            }
            else{
                entry.target.classList.remove('visible');
            }
        });
    }, {threshold: 0.3});
    elements.forEach(element=>{
        observer.observe(element);
    })
}
function animacionTitle(){
    const titles = document.querySelectorAll('.animated-title');
    titles.forEach(title =>{
        const text = title.textContent;
        title.textContent = '';

        const observer = new IntersectionObserver((entries)=>{
            entries.forEach(entry =>{
                let index = 0;
                title.style.opacity = 1;
                if(entry.isIntersecting){
                    const interval = setInterval(()=>{
                        if(index < text.length){
                            title.textContent += text[index];
                            index++;
                        }
                        else{
                            clearInterval(interval);
                        }
                    }, 100);
                    observer.unobserve(title);
                }
                
            });
        }, {threshold: 0.1});
        observer.observe(title);
    });
}
function animacionAgregarProducto(){
        const formProduct = document.querySelector(".formProduct2");
    
        if (formProduct.classList.contains("mostrar2")) {
            formProduct.style.maxHeight = null;  // Reinicia la altura máxima
            formProduct.classList.remove("mostrar2");
            setTimeout(() => {
                formProduct.style.display = "none"; // Después de la animación, oculta el formulario
            }, 500); // La duración debe coincidir con el tiempo de la animación en CSS
            document.getElementById("mostrarForm").textContent='+';
        } else {
            formProduct.style.display = "block";
            setTimeout(() => { 
                formProduct.classList.add("mostrar2");
            }, 10); // Añadir un pequeño retraso antes de activar la clase de animación
            document.getElementById("mostrarForm").textContent='x';
        }
    ;
}
function animacionAgregarReceta(){
    const formProduct = document.querySelector(".formReceta");

    if (formProduct.classList.contains("mostrar2")) {
        formProduct.style.maxHeight = null;  // Reinicia la altura máxima
        formProduct.classList.remove("mostrar2");
        setTimeout(() => {
            formProduct.style.display = "none"; // Después de la animación, oculta el formulario
        }, 500); // La duración debe coincidir con el tiempo de la animación en CSS
        document.getElementById("mostrarForm").textContent='+';
    } else {
        formProduct.style.display = "block";
        setTimeout(() => { 
            formProduct.classList.add("mostrar2");
        }, 10); // Añadir un pequeño retraso antes de activar la clase de animación
        document.getElementById("mostrarForm").textContent='x';
    }
;
}
// Función para mostrar el div con la animación de entrada
function mostrarDivConAnimacion(div) {
    if(div.style.display==='flex'){
        setTimeout(() => {
            div.classList.add('entrada'); // Añadir clase de entrada
        }, 20);
    }
    else{
        div.style.display = 'flex'; // Aseguramos que el display esté en flex
        setTimeout(() => {
        div.classList.add('entrada'); // Añadir clase de entrada
    }, 20);
    }
}

// Función para ocultar el div sin animación
function ocultarDivSinAnimacion(div) {
    div.classList.remove('entrada'); // Remover la clase de entrada
    div.style.display = 'none'; // Cambiar a none inmediatamente
}

// Función para alternar entre mostrar y ocultar
function alternarDiv(div1, div2) {
    if (div1.classList.contains('entrada')) {
        ocultarDivSinAnimacion(div1);
        mostrarDivConAnimacion(div2);
    } else {
        ocultarDivSinAnimacion(div2);
        mostrarDivConAnimacion(div1);
    }
}

















// ........................................................Función para adm
function editarContraseña(){
    cambiar();
    async function cambiar(){
        
    
        const username = document.getElementById('username').value;
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
    
        // Verificar que la nueva contraseña y la confirmación coincidan
        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        anuncio('cambioContraseña',username, currentPassword, newPassword,);
        
    };
}
function resetFormContraseña(){
    const username = document.getElementById('username').value='';
    const currentPassword = document.getElementById('current-password').value='';
    const newPassword = document.getElementById('new-password').value='';
    const confirmPassword = document.getElementById('confirm-password').value='';
}


// Función para agregar un producto
async function agregarProducto(nombre, precio, gramaje, imagen) {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('gramaje', gramaje);
    formData.append('imagen', imagen);
    anuncio('agregarProducto', formData, nombre, 1);
}

// Función para mostrar la lista de productos
async function mostrarProductos() {
    const response = await fetch('/api/productos');
    const productos = await response.json();
    const productList = document.getElementById("productList");
    productList.innerHTML = ""; // Limpiar la lista actual

    productos.forEach(producto => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p class="nombre">${producto.nombre}</p>
            <p class="precio">Bs/ ${producto.precio}</p>
            <p class="gramaje">${producto.gramaje} gr.</p>
            <a  href="${producto.imagenUrl}" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
  <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
</svg></a>
            <button class="botonGral" id="scrollButton" onclick="prepararEdicionProducto('${producto.id}', '${producto.nombre}', ${producto.precio}, '${producto.gramaje}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
</svg></button>
            <button class="botonGral" onclick="anuncio('eliminarProducto', '${producto.id}', '${producto.nombre}', '1')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
</svg></button>
        `;
        productList.appendChild(div);
        document.querySelector('.titulo-agregar-producto').textContent = "Agregar"
    });
}

// Función para preparar la edición de un producto
function prepararEdicionProducto(id, nombre, precio, gramaje) {
    document.getElementById("editarId").value = id;
    document.getElementById("nombre").value = nombre;
    document.getElementById("precio").value = precio;
    document.getElementById("gramaje").value = gramaje;
    
    document.getElementById("agregarBtn").style.display = "none";
    document.getElementById("actualizarBtn").style.display = "block";
    document.getElementById("cancelarEdicionBtn").style.display = "block";
    document.querySelector('.titulo-agregar-producto').textContent = "Editar"

    const formProduct = document.querySelector(".formProduct2");
    if (formProduct.classList.contains("mostrar2")){

    }
    else{
        animacionAgregarProducto();
    }
    
}

// Función para actualizar un producto
async function actualizarProducto() {
    const id = document.getElementById("editarId").value;
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const gramaje = document.getElementById("gramaje").value;
    const imagenInput = document.getElementById("imagen"); // Asumiendo que tienes un input para la imagen

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('gramaje', gramaje);

    // Verificamos si hay una nueva imagen y la agregamos al FormData
    if (imagenInput.files.length > 0) {
        formData.append('imagen', imagenInput.files[0]);
    }
    anuncio('actualizarProducto', id, nombre, formData);
}

// Función para eliminar un producto
async function eliminarProducto(id) {
    const admVentana = document.querySelector('.db-administrador');
    const anuncio = document.querySelector('.anuncio');
    const botonesAnuncio = document.querySelector('.boton-anuncio');
    document.getElementById("loadingScreen").style.display = "flex";
    botonesAnuncio.style.display = 'none';
    try {
        const response = await fetch(`/api/productos/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            mostrarProductos();
        } else {
            console.error("Error al eliminar producto");
        }
    } catch (error) {
        console.error("Error al eliminar producto:", error);
    }finally{
        document.getElementById("loadingScreen").style.display = "none";
        admVentana.style.filter = 'none';
        anuncio.style.display = 'none';
        botonesAnuncio.style.display = 'flex';
        admVentana.style.pointerEvents = 'auto';
    }
}

// Función para restablecer el formulario
function resetForm() {
    document.getElementById("productForm").reset();
    document.getElementById("editarId").value = "";
    document.getElementById("agregarBtn").style.display = "block";
    document.getElementById("actualizarBtn").style.display = "none";
    document.getElementById("cancelarEdicionBtn").style.display = "none";
    mostrarProductos(); // Mostrar la lista de productos
    animacionAgregarProducto();
}

// Función para agregar una receta
async function agregarReceta(nombreReceta, descripcion, linkReceta, imagen) {
    const formData = new FormData();
    formData.append('nombreReceta', nombreReceta);
    formData.append('descripcion', descripcion);
    formData.append('linkReceta', linkReceta);
    formData.append('imagen', imagen);
    anuncio('agregarReceta', formData, nombreReceta, 1);
}

// Función para mostrar la lista de recetas
async function mostrarRecetas() {
    const response = await fetch('/api/recetas');
    const recetas = await response.json();
    const recetaList = document.getElementById("recetaList");
    recetaList.innerHTML = ""; // Limpiar la lista actual

    recetas.forEach(receta => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p class="tituloNombreReceta">${receta.nombreReceta}</p>
            <p class="descripcion tituloDescripcion"">${receta.descripcion}</p>
            <a href="${receta.linkReceta}" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
</svg></a>
            <button class="botonGral" onclick="prepararEdicionReceta('${receta.id}', '${receta.nombreReceta}', '${receta.descripcion}', '${receta.linkReceta}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
</svg></button>
            <button class="botonGral" onclick="anuncio('eliminarReceta', '${receta.id}', '${receta.nombreReceta}', '1')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
</svg></button>
        `;
        recetaList.appendChild(div);
        document.querySelector('.titulo-agregar-receta').textContent = "Agregar"
    });
}

// Función para preparar la edición de una receta
function prepararEdicionReceta(id, nombreReceta, descripcion, linkReceta) {
    document.getElementById("editarRecetaId").value = id;
    document.getElementById("nombreReceta").value = nombreReceta;
    document.getElementById("descripcion").value = descripcion;
    document.getElementById("linkReceta").value = linkReceta;
    
    document.getElementById("agregarRecetaBtn").style.display = "none";
    document.getElementById("actualizarRecetaBtn").style.display = "block";
    document.getElementById("cancelarEdicionRecetaBtn").style.display = "block";
    document.querySelector('.titulo-agregar-receta').textContent = "Editar";
    animacionAgregarProducto();
}

// Función para actualizar una receta
async function actualizarReceta() {
    const id = document.getElementById("editarRecetaId").value;
    const nombreReceta = document.getElementById("nombreReceta").value;
    const descripcion = document.getElementById("descripcion").value;
    const linkReceta = document.getElementById("linkReceta").value;
    const imagenRecetaInput = document.getElementById("imagenReceta"); // Asumiendo que tienes un input para la imagen

    const formData = new FormData();
    formData.append('nombreReceta', nombreReceta);
    formData.append('descripcion', descripcion);
    formData.append('linkReceta', linkReceta);
    
    // Verificamos si hay una nueva imagen y la agregamos al FormData
    if (imagenRecetaInput.files.length > 0) {
        formData.append('imagen', imagenRecetaInput.files[0]);
    }
    anuncio('actualizarReceta', id, nombreReceta, formData);
    animacionAgregarProducto();
}

// Función para eliminar una receta
async function eliminarReceta(id) {
    const admVentana = document.querySelector('.db-administrador');
    const anuncio = document.querySelector('.anuncio');
    const botonesAnuncio = document.querySelector('.boton-anuncio');
    botonesAnuncio.style.display = 'none'
    document.getElementById("loadingScreen").style.display = "flex";
    try {
        const response = await fetch(`/api/recetas/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            mostrarRecetas();
        } else {
            console.error("Error al eliminar receta");
        }
    } catch (error) {
        console.error("Error al eliminar receta:", error);
    }finally{
        document.getElementById("loadingScreen").style.display = "none";
        admVentana.style.filter = 'none';
        anuncio.style.display = 'none';
        botonesAnuncio.style.display = 'flex'
        admVentana.style.pointerEvents = 'auto';
    }
}

// Función para restablecer el formulario de recetas
function resetFormReceta() {
    document.getElementById("recetaForm").reset();
    document.getElementById("editarRecetaId").value = "";
    document.getElementById("agregarRecetaBtn").style.display = "block";
    document.getElementById("actualizarRecetaBtn").style.display = "none";
    document.getElementById("cancelarEdicionRecetaBtn").style.display = "none";
    mostrarRecetas(); // Mostrar la lista de recetas
    animacionAgregarReceta();
}







// Delegación de eventos en el contenedor de botones
document.querySelector('.anuncio').addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-anuncio')) {
        handleClick(event);
    }
});

function anuncio(req, id, nombre, otro) {
    const anuncio = document.querySelector('.anuncio');
    const admVentana = document.querySelector('.db-administrador');
    const titulo = document.querySelector('.titulo-anuncio');
    const mensaje = document.querySelector('.mensaje-anuncio');
    const navAdm = document.querySelector('.navAdm');
    

    // Configuración del título y mensaje
    if(req==='eliminarProducto'){
        titulo.textContent = 'Eliminar';
        mensaje.textContent = '¿Estás seguro que quieres eliminar ' + nombre+ ' de los productos?';
    }
    else if(req==='eliminarReceta'){
        titulo.textContent = 'Eliminar';
        mensaje.textContent = '¿Estás seguro que quieres eliminar ' + nombre+ ' de las recetas?';
    }
    else if(req==='agregarProducto'){
        titulo.textContent = 'Agregar';
        mensaje.textContent = '¿Estás seguro que quieres agregar ' + nombre + ' a la lista de productos?';
    }
    else if(req==='agregarReceta'){
        titulo.textContent = 'Agregar';
        mensaje.textContent = '¿Estás seguro que quieres agregar ' + nombre + ' a la lista de recetas?';
    }
    else if(req==='actualizarReceta'){
        titulo.textContent = 'Actualizar';
        mensaje.textContent = '¿Estás seguro que quieres actualizar la receta: ' + nombre ;
    }
    else if(req==='actualizarProducto'){
        titulo.textContent = 'Actualizar';
        mensaje.textContent = '¿Estás seguro que quieres actualizar el producto: ' + nombre ;
    }
    else if(req==='cerrarSesion'){
        titulo.textContent = 'Cerrar Sesión';
        mensaje.textContent = '¿Estás seguro que quieres cerrar la sesion?';
    }
    else if(req==='cambioContraseña'){
        titulo.textContent = 'Cambio contraseña';
        mensaje.textContent = '¿Estás seguro que quieres cambiar la contraseña?';
    }
    else{
        titulo.textContent = 'indefinido';
        mensaje.textContent = 'indefinido';
    }
    
    
    

    admVentana.style.filter = 'blur(9px)';
    admVentana.style.pointerEvents = 'none';
    navAdm.style.pointerEvents = 'none';
    mostrarDivConAnimacion(anuncio);

    // Guardar el id del producto a eliminar en una variable global
    window.otros=otro;
    window.validacion=req;
    window.productoId = id;
    window.otros2=nombre;
}

function handleClick(event) { 
    const admVentana = document.querySelector('.db-administrador');
    const navAdm = document.querySelector('.navAdm');
    const anuncio = document.querySelector('.anuncio');
    const botonesAnuncio = document.querySelector('.boton-anuncio')

    if (event.target.textContent === 'Si') {
        admVentana.style.pointerEvents = 'auto';
        navAdm.style.pointerEvents = 'auto';
        if(window.validacion==='eliminarProducto'){
            eliminarProducto(window.productoId)
            .then(() => {
                mostrarProductos();
            })
            .catch((error) => {
                console.error("Error al eliminar el producto:", error);
            });
        }
        else if(window.validacion==='eliminarReceta'){
            eliminarReceta(window.productoId)
            .then(() => {
                admVentana.style.filter = 'none';
                anuncio.style.display = 'none';
                admVentana.style.pointerEvents = 'auto';
                mostrarRecetas();
            })
            .catch((error) => {
                console.error("Error al eliminar el producto:", error);
            });
        }
        else if(window.validacion==='agregarProducto'){
            agregar();
            async function agregar() {
                document.getElementById("loadingScreen").style.display = "flex";
                botonesAnuncio.style.display = 'none'
                try {
                    const response = await fetch('/api/productos', {
                    method: 'POST',
                    body: window.productoId
                });
                const data = await response.json();
                if (response.ok) {
                    resetForm();
                    mostrarProductos();
                } else {
                console.error("Error al agregar producto:", data);
                }
                } catch (error) {
                    console.error("Error al agregar producto:", error);
                }finally    {
                    admVentana.style.filter = 'none';
                    anuncio.style.display = 'none';
                    admVentana.style.pointerEvents = 'auto';
                    document.getElementById("loadingScreen").style.display = "none";
                    botonesAnuncio.style.display = 'flex'
                }
            }
            mostrarProductos();
        }
        else if(window.validacion==='agregarReceta'){
            agregar();
            async function agregar() {
                document.getElementById("loadingScreen").style.display = "flex";
                botonesAnuncio.style.display = 'none'
                try {
                    const response = await fetch('/api/recetas', {
                        method: 'POST',
                        body: window.productoId
                    });
                    const data = await response.json();
                    if (response.ok) {
                        resetFormReceta();
                        mostrarRecetas();
                    } else {
                        console.error("Error al agregar receta:", data);
                    }
                } catch (error) {
                    console.error("Error al agregar receta:", error);
                }finally    {
                    admVentana.style.filter = 'none';
                    anuncio.style.display = 'none';
                    admVentana.style.pointerEvents = 'auto';
                    document.getElementById("loadingScreen").style.display = "none";
                    botonesAnuncio.style.display = 'flex'
                }
            }
            mostrarRecetas();
        }
        else if(window.validacion==='actualizarReceta'){
            agregar();
            async function agregar() {
                document.getElementById("loadingScreen").style.display = "flex";
                botonesAnuncio.style.display = 'none'
                try {
                    const response = await fetch(`/api/recetas/${window.productoId}`, {
                        method: 'PUT',
                        body: window.otros
                    });

                    if (response.ok) {
                        mostrarRecetas();
                        resetFormReceta();
                        const errorData = await response.json();
                        console.error("Error al actualizar receta:", errorData.error);
                    }
                } catch (error) {
                    console.error("Error al actualizar receta:", error);
                }finally    {
                    admVentana.style.filter = 'none';
                    anuncio.style.display = 'none';
                    admVentana.style.pointerEvents = 'auto';
                    document.getElementById("loadingScreen").style.display = "none";
                    botonesAnuncio.style.display = 'flex'
                }
            }
            mostrarRecetas();
        }
        else if(window.validacion==='actualizarProducto'){
            agregar();
            async function agregar() {
                document.getElementById("loadingScreen").style.display = "flex";
                botonesAnuncio.style.display = 'none'
                try {
                    const response = await fetch(`/api/productos/${window.productoId}`, {
                        method: 'PUT',
                        body: window.otros
                    });

                    if (response.ok) {
                        mostrarProductos();
                        resetForm();
                    } else {
                        const errorData = await response.json();
                        console.error("Error al actualizar receta:", errorData.error);
                    }
                } catch (error) {
                    console.error("Error al actualizar receta:", error);
                }finally    {
                    admVentana.style.filter = 'none';
                    anuncio.style.display = 'none';
                    document.getElementById("loadingScreen").style.display = "none";
                    botonesAnuncio.style.display = 'flex'
                }
            }
            mostrarProductos();
        }
        else if(window.validacion==='cerrarSesion'){
            logout();
        }
        else if(window.validacion==='cambioContraseña'){
            agregar();
            async function agregar() {
                document.getElementById("loadingScreen").style.display = "flex";
                botonesAnuncio.style.display = 'none'
            try {
                const response = await fetch('/api/usuarios/cambiar-password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username:window.productoId,         // Enviar 'username' correctamente
                        currentPassword:window.otros2,
                        newPassword:window.otros,
                    }),
                });
        
                const result = await response.json();
        
                if (response.ok) {
                    resetFormContraseña();
                } else {
                    alert(result.error || "Error al actualizar la contraseña");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
                alert("Error en la solicitud");
            }finally    {
                admVentana.style.filter = 'none';
                anuncio.style.display = 'none';
                document.getElementById("loadingScreen").style.display = "none";
                botonesAnuncio.style.display = 'flex'
            }
        }
        }
    } 
    else if (event.target.textContent === 'Cancelar') {
        const admVentana = document.querySelector('.db-administrador');
        const anuncio = document.querySelector('.anuncio');

        admVentana.style.filter = 'none';
        ocultarDivSinAnimacion(anuncio);
        admVentana.style.pointerEvents = 'auto';
        navAdm.style.pointerEvents = 'auto';
    }
}









// ........................................................Función productos

async function obtenerProductos() {
    try {
        const response = await fetch('/api/productos');
        
        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }

        const productos = await response.json();
        mostrarProductos2(productos);
    } catch (error) {
        console.error(error);
    }
}

// Función para mostrar los productos en el DOM y funcuiones de agregar al carrito y todo lo que tiene que ver con el carrito
function mostrarProductos2(productos) {
    const contenedorProductos = document.getElementById('productos-container');
    const carrito = document.querySelector('.carrito .compra'); // Contenedor de compras
    const subtotalPrecio = document.querySelector('.subtotalPrecio'); // Elemento para mostrar el subtotal
    const botonComprar = document.querySelector('.botonComprar'); // Botón de comprar
    let subtotal = 0;

    // Limpiar el contenedor antes de agregar nuevos productos
    contenedorProductos.innerHTML = '';

    productos.forEach(producto => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('producto');
        divProducto.innerHTML = `
            <img class='imagenProducto' src="${producto.imagenUrl}" alt="">
            <p class="nombre-producto">${producto.nombre} ${producto.gramaje} gr.</p>
            <p><span class="precio">Bs/${producto.precio}</span></p>
            <div class="cantidad">
                <button class="btn-decrementar">-</button>
                <p class="cantidad-numero">0</p>
                <button class="btn-incrementar">+</button>
            </div>
            <button class="botonPage">Añadir al carrito</button>
        `;

        const cantidadNumero = divProducto.querySelector('.cantidad-numero');
        const btnIncrementar = divProducto.querySelector('.btn-incrementar');
        const btnDecrementar = divProducto.querySelector('.btn-decrementar');
        const botonAñadir = divProducto.querySelector('.botonPage');

        // Event listener para incrementar la cantidad
        btnIncrementar.addEventListener('click', () => {
            let cantidad = parseInt(cantidadNumero.textContent);
            cantidadNumero.textContent = ++cantidad;
        });

        // Event listener para decrementar la cantidad
        btnDecrementar.addEventListener('click', () => {
            let cantidad = parseInt(cantidadNumero.textContent);
            if (cantidad > 0) {
                cantidadNumero.textContent = --cantidad;
            }
        });

        // Event listener para añadir producto al carrito
        botonAñadir.addEventListener('click', () => {
            const cantidad = parseInt(cantidadNumero.textContent);

            // Solo añadir al carrito si la cantidad es mayor a 0
            if (cantidad > 0) {
                const nuevaCompra = document.createElement('div');
                nuevaCompra.classList.add('contenidoCompra');
                nuevaCompra.innerHTML = `
                        <img src="${producto.imagenUrl}" alt="" class="imagenCompra">
                        <div class="textoCompra">
                            <div class="texto1Compra">
                                <p class="nombreCompra">${producto.nombre}<span> ${producto.gramaje} gr.</span></p>
                            </div>
                            <div class="texto2Compra">
                                <p class="cantidadCompra">${cantidad}</p>
                                <p>x</p>
                                <p class="totalCompra">Bs/${(producto.precio * cantidad).toFixed(2)}</p>
                            </div>
                        </div>
                        <button class="eliminarCompra"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg></button>
                `;

                // Event listener para eliminar el producto del carrito
                nuevaCompra.querySelector('.eliminarCompra').addEventListener('click', () => {
                    const totalProducto = parseFloat(nuevaCompra.querySelector('.totalCompra').textContent.replace('Bs/', ''));
                    subtotal -= totalProducto;
                    actualizarSubtotal();
                    nuevaCompra.remove();
                    
                });

                carrito.appendChild(nuevaCompra);

                // Actualizar subtotal
                subtotal += producto.precio * cantidad;
                actualizarSubtotal();

                // Reiniciar la cantidad a 0
                cantidadNumero.textContent = '0';
            }
        });

        contenedorProductos.appendChild(divProducto);
    });

    // Función para actualizar el subtotal en el HTML
    function actualizarSubtotal() {
        subtotalPrecio.textContent = `Bs/${subtotal.toFixed(2)}`;
    }

    // Event listener para el botón "Adquirir ahora"
    botonComprar.addEventListener('click', () => {
        const detallesCompra = [];
        carrito.querySelectorAll('.contenidoCompra').forEach(item => {
            const nombre = item.querySelector('.nombreCompra').textContent;
            const cantidad = item.querySelector('.cantidadCompra').textContent;
            const total = item.querySelector('.totalCompra').textContent;
            detallesCompra.push(`${nombre} (${cantidad} unidades) - ${total}`);
        });

        // Generar el mensaje para WhatsApp
        const mensaje = `¡Buenas! Quisiera adquirir:\n${detallesCompra.join('\n')}\nSubtotal: Bs/${subtotal.toFixed(2)}`;
        const numeroWhatsApp = '59169713972'; // Tu número en formato internacional
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        // Redirigir a WhatsApp con el mensaje
        window.open(urlWhatsApp, '_blank');
    });
}











// ........................................................Función recetas
    // Función para obtener recetas de la API
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

    // Función para mostrar las recetas en el DOM
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







    function botonNavbarAdm() {
        const botones = document.querySelectorAll('.btnAcceso');
        const dbproductos = document.querySelector('.db-productos');
        const dbrecetas = document.querySelector('.db-recetas');
        const dbcontraseña = document.querySelector('.db-contraseña');
    
        botones.forEach(boton => {
            boton.addEventListener('click', (event) => {
                const action = boton.getAttribute('data-action');
    
                switch (action) {
                    case 'productos':
                        mostrarDivConAnimacion(dbproductos);
                        ocultarDivSinAnimacion(dbrecetas);
                        ocultarDivSinAnimacion(dbcontraseña);
                        break;
                    case 'recetas':
                        mostrarDivConAnimacion(dbrecetas);
                        ocultarDivSinAnimacion(dbproductos);
                        ocultarDivSinAnimacion(dbcontraseña);
                        break;
                    case 'contraseña':
                        mostrarDivConAnimacion(dbcontraseña);
                        ocultarDivSinAnimacion(dbrecetas);
                        ocultarDivSinAnimacion(dbproductos);
                        break;
                    default:
                        console.log('Ninguna acción definida');
                }
            });
        });
    }
    





    function logout() {
        agregar();
        async function agregar(){
            try {
                const response = await fetch(`/logout`, {
                    method: 'POST',
                    body: window.otros
                });
    
                if (response.ok) {
                    window.location.href = '/login';
                } else {
                    const errorData = await response.json();
                    console.error("Error al cerrar sesion");
                }
            } catch (error) {
                console.error("error al cerrar sesion");
            }finally    {
                admVentana.style.filter = 'none';
                anuncio.style.display = 'none';
                document.getElementById("loadingScreen").style.display = "none";
                botonesAnuncio.style.display = 'flex'
            }
        }
        
    }
    






function botonCarrito(){
    
    const pantallaCarrito = document.querySelector('.carrito');
    const pantallaProductos = document.querySelector('.seccionProductos');
    const botonCerrarPantalla = document.querySelector('.cerrarCompra');

    if(botonCerrarPantalla.textContent==='-'){
        mostrarDivConAnimacion(pantallaCarrito);
        pantallaProductos.style.filter = 'blur(9px)';
        botonCerrarPantalla.textContent='x'
        pantallaProductos.style.pointerEvents = 'none';
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // Desplazamiento suave
        });
    }
    else{
        ocultarDivSinAnimacion(pantallaCarrito);
        pantallaProductos.style.filter = 'none';
        botonCerrarPantalla.textContent='-'
        pantallaProductos.style.pointerEvents = 'auto';
    }
}
function actualizarContador() {
    const contenidoCompra = document.querySelector('.compra');
    const contadorElemento = document.getElementById('contador');
    const totalImgs = contenidoCompra.getElementsByTagName('img').length; // Contar imágenes
    contadorElemento.textContent = totalImgs;
}
function verificarImagenesYActualizarBoton() {
    const contenidoCompra = document.querySelector('.compra');
    const boton = document.getElementById('accionBoton');
    const boton2 = document.getElementById('accionBoton2');
    const boton3 = document.getElementById('accionBoton3');
    const pantallaCarrito = document.querySelector('.carrito');
    const pantallaProductos = document.querySelector('.seccionProductos');
    const hayImagenes = contenidoCompra.getElementsByTagName('img').length > 0;
    const botonActivacion = document.querySelector('.cerrarCompra');

    if (hayImagenes) {
        setTimeout(() => {
            boton.classList.add('visible');
            boton2.classList.add('visible');
            boton3.classList.add('visible');
        }, 50); // Retraso para permitir que la transición funcione
    } else {
        boton.classList.remove('visible');
        boton2.classList.remove('visible');
        boton3.classList.remove('visible');
        
        setTimeout(() => {
            pantallaCarrito.style.display='none'
            pantallaProductos.style.filter='none'
            pantallaProductos.style.pointerEvents= 'auto'
            botonActivacion.textContent='-';

        }, 100); // Tiempo suficiente para la animación antes de ocultarlo completamente
    }
}
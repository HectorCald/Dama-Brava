document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
      onScroll();
    });
    onScroll();
    mostrarProductos();
    mostrarRecetas();
  });
function editarContraseña(){
    event.preventDefault();
    cambiar();
    async function cambiar(){
        
        const username = document.getElementById('username').value;
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        const mensaje=document.getElementById('feedback-message')
        const alerta = document.querySelector('.alertas');
    
        // Verificar que la nueva contraseña y la confirmación coincidan
        if (newPassword !== confirmPassword) {
            alerta.style.display='flex';
            mensaje.textContent='Las contraseñas nuevas no coinciden';
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
async function agregarProducto(nombre, precio, gramaje, imagen) {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('gramaje', gramaje);
    formData.append('imagen', imagen);

    document.getElementById("agregarBtn").style.display = 'none';
    document.querySelector(".loadingScreen3").style.display = "flex"; 

    try {

        const response = await fetch('/api/productos', {
            method: 'POST',
            body: formData,
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
    } finally {
        // ✅ Aquí puedes ocultar el loader si la petición ya terminó
        document.querySelector(".loadingScreen3").style.display = "none";  
        toggleVisibility2('hide');
    }
}

async function mostrarProductos() {
    
    const response = await fetch('/api/productos');
    const productos = await response.json();

    const productList = document.getElementById("productList");
    productList.innerHTML = ""; // Limpiar la lista actual
    
    productos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add('producto-adm');
        div.innerHTML = `
            <p class="nombre">${producto.nombre}</p>
            <p class="precio">Bs/ ${producto.precio}</p>
            <p class="gramaje">${producto.gramaje} gr.</p>
            <a class="imagen" href="${producto.imagenUrl}" target="_blank">Ver</a>
            <div class="acciones">
                <button onclick="prepararEdicionProducto('${producto._id}', '${producto.nombre}', ${producto.precio}, '${producto.gramaje}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                    </svg>
                </button>
                <button onclick="anuncio('eliminarProducto', '${producto._id}', '${producto.nombre}', '1')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                </button>
            </div>
        `;
        productList.appendChild(div);
    
    });
}
function prepararEdicionProducto(id, nombre, precio, gramaje) {
    document.querySelector('.buscador').scrollIntoView({ behavior: 'smooth' });


    document.getElementById("editarId").value = id;
    document.getElementById("nombre").value = nombre;
    document.getElementById("precio").value = precio;
    document.getElementById("gramaje").value = gramaje;
    
    document.getElementById("agregarBtn").style.display = "none";
    document.getElementById("actualizarBtn").style.display = "block";
    document.getElementById("cancelarEdicionBtn").style.display = "block";
    document.querySelector('.titulo-agregar-producto').textContent = "Editar"
    toggleVisibility2('show');
    
}
async function actualizarProducto() {
    const id = document.getElementById("editarId").value;
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const gramaje = document.getElementById("gramaje").value;
    const imagenInput = document.getElementById("imagen"); // Asumiendo que tienes un input para la imagen
    const carga= document.querySelector('.loadingScreen3');
    const botones= document.querySelector('#productForm .botones');

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('gramaje', gramaje);
    carga.style.display='flex';
    botones.style.display='none';

    // Verificamos si hay una nueva imagen y la agregamos al FormData
    if (imagenInput.files.length > 0) {
        formData.append('imagen', imagenInput.files[0]);
    }
    try {
        const response = await fetch(`/api/productos/${id}`, {
            method: 'PUT',
            body: formData
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
        carga.style.display='none';
        botones.style.display='flex';
        toggleVisibility2('hide')
    }
}
async function eliminarProducto(id) {
    const admVentana = document.querySelector('.db-administrador');
    const anuncio = document.querySelector('.anuncio');
    const botonesAnuncio = document.querySelector('.boton-anuncio');
    
    // Muestra la pantalla de carga
    document.getElementById("loadingScreen").style.display = "flex";
    botonesAnuncio.style.display = 'none';

    try {
        console.log(`Eliminando producto con ID: ${id}`); // Log para verificar el ID
        const response = await fetch(`/api/productos/${id}`, {
            method: 'DELETE'
        });

        // Manejo de la respuesta del servidor
        if (response.ok) {
            console.log("Producto eliminado con éxito."); // Log de éxito
            mostrarProductos(); // Actualiza la lista de productos
        } else {
            const errorText = await response.text(); // Obtén el texto de error
            console.error("Error al eliminar producto:", response.status, errorText); // Log de error
            alert(`Error al eliminar producto: ${response.status} - ${errorText}`); // Mensaje al usuario
        }
    } catch (error) {
        console.error("Error al eliminar producto:", error); // Log del error en la solicitud
        alert("Error al eliminar producto. Inténtalo de nuevo más tarde."); // Mensaje al usuario
    } finally {
        // Oculta la pantalla de carga y restaura el estado de la interfaz
        document.getElementById("loadingScreen").style.display = "none";
        admVentana.style.filter = 'none';
        anuncio.style.display = 'none';
        botonesAnuncio.style.display = 'flex';
        admVentana.style.pointerEvents = 'auto';
    }
}
function resetForm() {
    document.getElementById("productForm").reset();
    document.getElementById("editarId").value = "";
    document.getElementById("agregarBtn").style.display = "block";
    document.getElementById("actualizarBtn").style.display = "none";
    document.getElementById("cancelarEdicionBtn").style.display = "none";
    document.querySelector('.titulo-agregar-producto').textContent = "Producto";
    mostrarProductos(); // Mostrar la lista de productos
}
async function agregarReceta(nombreReceta, descripcion, linkReceta, imagen) {
    const formData = new FormData();
    formData.append('nombreReceta', nombreReceta);
    formData.append('descripcion', descripcion);
    formData.append('linkReceta', linkReceta);
    formData.append('imagen', imagen);
    try {
        const response = await fetch('/api/recetas', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (response.ok) {
            mostrarRecetas();
            resetFormReceta();
        } else {
            console.error("Error al agregar receta:", data);
        }
    } catch (error) {
        console.error("Error al agregar receta:", error);
    }finally    {
        toggleVisibility('hide');
    }
    mostrarRecetas();
}
async function mostrarRecetas() {
    const response = await fetch('/api/recetas');
    const recetas = await response.json();
    const recetaList = document.getElementById("recetaList");
    recetaList.innerHTML = ""; // Limpiar la lista actual

    recetas.forEach(receta => {
        const div = document.createElement("div");
        div.classList.add('receta-adm');
        div.innerHTML = `
            <p class="nombre">${receta.nombreReceta}</p>
            <p class="descripcion">${receta.descripcion}</p>
            <a class="imagen" href="${receta.imagenUrl}">Ver</a>
            <a class="video" href="${receta.linkReceta}" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
            </svg></a>
            <div class="acciones">
                <button class="botonGral" onclick="prepararEdicionReceta('${receta._id}', '${receta.nombreReceta}', '${receta.descripcion}', '${receta.linkReceta}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                    </svg></button>
                <button class="botonGral" onclick="anuncio('eliminarReceta', '${receta._id}', '${receta.nombreReceta}', '1')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg></button>
            </div>
        `;
        recetaList.appendChild(div);
    });
}
function prepararEdicionReceta(id, nombreReceta, descripcion, linkReceta) {

    document.getElementById("editarRecetaId").value = id;
    document.getElementById("nombreReceta").value = nombreReceta;
    document.getElementById("descripcion").value = descripcion;
    document.getElementById("linkReceta").value = linkReceta;
    
    document.getElementById("agregarRecetaBtn").style.display = "none";
    document.getElementById("actualizarRecetaBtn").style.display = "block";
    document.getElementById("cancelarEdicionRecetaBtn").style.display = "block";
    document.querySelector('.titulo-agregar-receta').textContent = "Editar";
    toggleVisibility('show');
}
async function actualizarReceta() {
    const id = document.getElementById("editarRecetaId").value;
    const nombreReceta = document.getElementById("nombreReceta").value;
    const descripcion = document.getElementById("descripcion").value;
    const linkReceta = document.getElementById("linkReceta").value;
    const imagenRecetaInput = document.getElementById("imagenReceta"); // Asumiendo que tienes un input para la imagen
    const carga= document.querySelector('.loadingScreen2');
    const botones= document.querySelector('#recetaForm .botones');

    const formData = new FormData();
    formData.append('nombreReceta', nombreReceta);
    formData.append('descripcion', descripcion);
    formData.append('linkReceta', linkReceta);
    carga.style.display='flex';
    botones.style.display='none';
    if (imagenRecetaInput.files.length > 0) {
        formData.append('imagen', imagenRecetaInput.files[0]);
    }
    try {
        const response = await fetch(`/api/recetas/${id}`, {
            method: 'PUT',
            body: formData,
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
        carga.style.display='none';
        botones.style.display='flex';
        toggleVisibility('hide');
    }
}
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
function resetFormReceta() {
    document.getElementById("recetaForm").reset();
    document.getElementById("editarRecetaId").value = "";
    document.getElementById("agregarRecetaBtn").style.display = "block";
    document.getElementById("actualizarRecetaBtn").style.display = "none";
    document.getElementById("cancelarEdicionRecetaBtn").style.display = "none";
    document.querySelector('.titulo-agregar-receta').textContent = "Receta"
    toggleVisibility('hide');
}
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
    
    anuncio.style.display='flex';
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
        else if(window.validacion==='cerrarSesion'){
            logout();
        }
        else if(window.validacion==='cambioContraseña'){
            const alerta = document.querySelector('.alertas');
            agregar();
            async function agregar() {
                document.getElementById("loadingScreen").style.display = "flex";
                botonesAnuncio.style.display = 'none'
                alerta.style.display='flex';
                try {
                    const response = await fetch('/api/usuarios/cambiar-password', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: window.productoId,         // Enviar 'username' correctamente
                            currentPassword: window.otros2,
                            newPassword: window.otros,
                        }),
                    });
                
                    const result = await response.json();
                
                    if (response.ok) {
                        resetFormContraseña();
                        document.getElementById('feedback-message').innerText = result.message; // Mensaje de éxito
                    } else {
                        document.getElementById('feedback-message').innerText = result.error || "Error al actualizar la contraseña"; // Mensaje de error
                    }
                } catch (error) {
                    console.error("Error en la solicitud:", error);
                    document.getElementById('feedback-message').innerText = "Algo salio mal intente de nuevo"; // Mensaje de error genérico
                } finally {
                    admVentana.style.filter = 'none';
                    anuncio.style.display = 'none';
                    document.getElementById("loadingScreen").style.display = "none";
                    botonesAnuncio.style.display = 'flex';
                }
        }
        }
    } 
    else if (event.target.textContent === 'Cancelar') {
        const admVentana = document.querySelector('.db-administrador');
        const anuncio = document.querySelector('.anuncio');

        admVentana.style.filter = 'none';
        anuncio.style.display='none';
        admVentana.style.pointerEvents = 'auto';
        navAdm.style.pointerEvents = 'auto';
    }
}
function toggleVisibility(action) {
    const element = document.getElementById('recetaForm');
    if (action === 'show') {
      element.classList.add('visible');
    } else if (action === 'hide') {
        document.querySelector('.titulo-agregar-receta').textContent = "Receta"
      element.classList.remove('visible');
      resetFormReceta();
    }
    irAlInicio();
}
function toggleVisibility2(action) {
    const element = document.getElementById('productForm');
  
    if (action === 'show') {
        element.classList.add('visible');
    } else if (action === 'hide') {
        document.querySelector('.titulo-agregar-producto').textContent = "Producto"
        element.classList.remove('visible');
        resetForm();
    }
    irAlInicio();
}
function switchScreens(div) {
    const recetas = document.querySelector('.db-recetas');
    const productos = document.querySelector('.db-productos');
    const contraseña = document.querySelector('.db-contraseña');

    // Ocultar la pantalla activa// Para ocultar la pantalla actual

    // Mostrar la pantalla deseada
    if (div === 'productos') {
        recetas.style.display = 'none'; 
        contraseña.style.display = 'none'; 
        productos.style.display = 'flex'; // Asegúrate de que se muestre
        productos.style.opacity = '0'; // Hacer invisible antes de la animación


        // Iniciar la animación de entrada
        setTimeout(() => {
            productos.style.opacity = '1'; // Aplica la opacidad para mostrar la pantalla

        }, 10); // Espera un momento para aplicar el display
    } else if (div === 'recetas') {
        productos.style.display = 'none'; 
        contraseña.style.display = 'none'; 
        recetas.style.display = 'flex'; // Asegúrate de que se muestre
        recetas.style.opacity = '0'; // Hacer invisible antes de la animación


        // Iniciar la animación de entrada
        setTimeout(() => {
            recetas.style.opacity = '1'; // Aplica la opacidad para mostrar la pantalla

        }, 10); // Espera un momento para aplicar el display
    }else if (div === 'contraseña') {
        productos.style.display = 'none';
        recetas.style.display = 'none'; 
        contraseña.style.display = 'flex'; // Asegúrate de que se muestre
        contraseña.style.opacity = '0'; // Hacer invisible antes de la animación

        // Iniciar la animación de entrada
        setTimeout(() => {
            contraseña.style.opacity = '1'; // Aplica la opacidad para mostrar la pantalla
        }, 10); // Espera un momento para aplicar el display
    }
}


  
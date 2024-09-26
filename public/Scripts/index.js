document.addEventListener('DOMContentLoaded', () => {
    secciones();
    entradaTexto();
    limpiarInput();
    aniamcionEntrada();
    animacionTitle();
})
//funciones de navegacion en las paginas
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


//funciones de la seccion de Productos
function entradaTexto(){
        const searchInput = document.getElementById('busquedaInput');
        const nombres = document.getElementById('nombresProductos').getElementsByTagName('p');

        searchInput.addEventListener('keyup', function() {
            let input = searchInput.value.toLowerCase(); // Obtener el valor del input y pasarlo a minúsculas
            
            // Recorrer todos los elementos <p>
            for (let i = 0; i < nombres.length; i++) {
                // Verificar si el texto del <p> contiene el texto del input
                if (nombres[i].innerText.toLowerCase().includes(input)) {
                    nombres[i].classList.remove('hidden'); // Mostrar el elemento <p>
                } else {
                    nombres[i].classList.add('hidden'); // Ocultar el elemento <p>
                }
            }
        });
        const items = document.querySelectorAll('.item');
        const titulo = document.getElementById('busquedaInput');
        const lista = document.querySelector('.filtrosLista');
    
    items.forEach(item => {
        item.addEventListener('click', () => {
        titulo.value = item.textContent;
        lista.style.display = 'none'
        botonBuscar();
        limpiarInput();
        });
    });     
}    
function limpiarInput(){
    const input = document.getElementById('busquedaInput');
    const boton = document.querySelector('.clearBoton');
    if(input.value!==''){
        boton.style.display = 'block';
    }
    else{
        boton.style.display = 'none'
    }
    input.addEventListener('input', ()=>{
        if(input.value!==''){
            boton.style.display = 'block';
        }
        else{
            boton.style.display = 'none'
        }
    });
    boton.addEventListener('click', ()=>{
        input.value = '';
        boton.style.display = 'none';
        input.focus();
        const lista = document.querySelector('.filtrosLista');
        lista.style.display = 'none'
        botonBuscar();
    });
    
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



function menu() {
    const btn = document.querySelector('.btn-menu');
    const div = document.querySelector('.menu');
    
    const svgCerrar = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>
    `;

    const svgMenu = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
        </svg>
    `;

    div.classList.toggle("deslizar");

    // Cambia el ícono y el texto del botón según el estado del menú
    if (div.classList.contains("deslizar")) {
        btn.innerHTML = svgCerrar;       // Cambia al ícono de "Cerrar"
        activarBorroso();
    } else {
        btn.innerHTML = svgMenu;         // Cambia al ícono de "Menú"
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

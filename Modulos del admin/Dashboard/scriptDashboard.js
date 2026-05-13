const paginaActual = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-link').forEach(enlace => {
    const nombreEnlace = enlace.getAttribute('href').split('/').pop();
    if (nombreEnlace === paginaActual) {
        enlace.classList.add('bg-verde-oscuro', 'text-white', 'font-semibold');
    } else {
        enlace.classList.add('text-gray-500', 'hover:bg-gray-50', 'hover:text-verde-oscuro');
    }
});

function actualizarContadorProductos() {
    const productos = JSON.parse(localStorage.getItem('milpa_productos') || '[]');
    const contador = document.getElementById('totalProductos');
    if (contador) {
        contador.textContent = productos.length;
    }
}

function actualizarContadorSolicitudes() {
    const solicitudes = JSON.parse(localStorage.getItem('milpa_solicitudes') || '[]');
    const pendientes = solicitudes.filter(s => s.estado !== 'atendida').length;
    const atendidas = solicitudes.filter(s => s.estado === 'atendida').length;
    const pendientesEl = document.getElementById('solicitudesPendientes');
    const atendidasEl = document.getElementById('solicitudesAtendidas');
    if (pendientesEl) pendientesEl.textContent = pendientes;
    if (atendidasEl) atendidasEl.textContent = atendidas;
}

actualizarContadorProductos();
actualizarContadorSolicitudes();

window.addEventListener('storage', event => {
    if (event.key === 'milpa_productos') {
        actualizarContadorProductos();
    }
    if (event.key === 'milpa_solicitudes') {
        actualizarContadorSolicitudes();
    }
});

function actualizarContadorProductos() {
    const productos = JSON.parse(localStorage.getItem('milpa_productos') || '[]');
    const contador = document.getElementById('totalProductos');
    if (contador) {
        contador.textContent = productos.length;
    }
}

actualizarContadorProductos();

window.addEventListener('storage', event => {
    if (event.key === 'milpa_productos') {
        actualizarContadorProductos();
    }
});

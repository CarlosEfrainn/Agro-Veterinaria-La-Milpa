const paginaActual = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-link').forEach(enlace => {
    const nombreEnlace = enlace.getAttribute('href').split('/').pop();
    if (nombreEnlace === paginaActual) {
        enlace.classList.add('bg-verde-oscuro', 'text-white', 'font-semibold');
    } else {
        enlace.classList.add('text-gray-500', 'hover:bg-gray-50', 'hover:text-verde-oscuro');
    }
});

let solicitudes = JSON.parse(localStorage.getItem('milpa_solicitudes') || '[]');
let indiceEdicionSolicitud = -1;

function actualizarContadoresSolicitudes() {
    const total = solicitudes.length;
    const atendidas = solicitudes.filter(s => s.estado === 'atendida').length;
    const pendientes = total - atendidas;

    const totalEl = document.getElementById('totalSolicitudes');
    const pendientesEl = document.getElementById('solicitudesPendientesAdmin');
    const atendidasEl = document.getElementById('solicitudesAtendidasAdmin');

    if (totalEl) totalEl.textContent = total;
    if (pendientesEl) pendientesEl.textContent = pendientes;
    if (atendidasEl) atendidasEl.textContent = atendidas;
}

function renderizarSolicitudes() {
    const cuerpo = document.getElementById('cuerpo-solicitudes');
    if (!cuerpo) return;

    if (solicitudes.length === 0) {
        cuerpo.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-16 text-gray-300">
                    <div class="text-4xl mb-2">📝</div>
                    <p class="text-sm">No hay solicitudes registradas aun.</p>
                    <p class="text-xs mt-1">Las solicitudes de clientes aparecerán aquí cuando se creen desde la página de la empresa.</p>
                </td>
            </tr>
        `;
        return;
    }

    cuerpo.innerHTML = solicitudes.map((solicitud, index) => `
        <tr class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 text-verde-oscuro font-medium">${solicitud.cliente || 'Cliente desconocido'}</td>
            <td class="px-6 py-4 text-gray-600">${solicitud.producto}</td>
            <td class="px-6 py-4 text-gray-600">${solicitud.cantidad}</td>
            <td class="px-6 py-4 text-gray-400 max-w-xs truncate">${solicitud.nota || '-'}</td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${solicitud.estado === 'atendida' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                    ${solicitud.estado === 'atendida' ? 'Atendida' : 'Pendiente'}
                </span>
            </td>
            <td class="px-6 py-4 text-gray-400">${solicitud.fecha || '-'}</td>
            <td class="px-6 py-4">
                <div class="flex flex-wrap gap-2">
                    ${solicitud.estado !== 'atendida' ? `
                        <button onclick="atenderSolicitud(${index})" class="text-xs bg-verde-oscuro text-white px-3 py-1 rounded-lg hover:bg-verde-medio transition duration-200">Atender</button>
                    ` : ''}
                    <button onclick="eliminarSolicitud(${index})" class="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-lg hover:bg-red-100 transition duration-200">Eliminar</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function guardarSolicitudesEnStorage() {
    localStorage.setItem('milpa_solicitudes', JSON.stringify(solicitudes));
}

function mostrarFormularioSolicitud() {
    document.getElementById('formulario-solicitud').classList.remove('hidden');
    document.getElementById('input-cliente').focus();
    indiceEdicionSolicitud = -1;
    limpiarFormularioSolicitud();
}

function cancelarFormularioSolicitud() {
    document.getElementById('formulario-solicitud').classList.add('hidden');
    limpiarFormularioSolicitud();
    indiceEdicionSolicitud = -1;
}

function limpiarFormularioSolicitud() {
    document.getElementById('input-cliente').value = '';
    document.getElementById('input-producto').value = '';
    document.getElementById('input-cantidad').value = '';
    document.getElementById('input-nota').value = '';
}

function atenderSolicitud(index) {
    solicitudes[index].estado = 'atendida';
    guardarSolicitudesEnStorage();
    renderizarSolicitudes();
    actualizarContadoresSolicitudes();
}

function eliminarSolicitud(index) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) return;
    solicitudes.splice(index, 1);
    guardarSolicitudesEnStorage();
    renderizarSolicitudes();
    actualizarContadoresSolicitudes();
}

function guardarSolicitud() {
    const cliente = document.getElementById('input-cliente').value.trim();
    const producto = document.getElementById('input-producto').value.trim();
    const cantidad = document.getElementById('input-cantidad').value.trim();
    const nota = document.getElementById('input-nota').value.trim();

    if (!cliente || !producto || !cantidad) {
        alert('Por favor completa los campos de cliente, producto y cantidad.');
        return;
    }

    const nuevaSolicitud = {
        cliente,
        producto,
        cantidad,
        nota,
        estado: 'pendiente',
        fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
    };

    solicitudes.push(nuevaSolicitud);
    guardarSolicitudesEnStorage();
    renderizarSolicitudes();
    actualizarContadoresSolicitudes();
    cancelarFormularioSolicitud();
}

window.addEventListener('storage', event => {
    if (event.key === 'milpa_solicitudes') {
        solicitudes = JSON.parse(event.newValue || '[]');
        renderizarSolicitudes();
        actualizarContadoresSolicitudes();
    }
});

renderizarSolicitudes();
actualizarContadoresSolicitudes();

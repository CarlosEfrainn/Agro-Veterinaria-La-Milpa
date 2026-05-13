
const paginaActual = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-link').forEach(enlace => {
    const nombreEnlace = enlace.getAttribute('href').split('/').pop();
    if (nombreEnlace === paginaActual) {
    enlace.classList.add('bg-verde-oscuro', 'text-white', 'font-semibold');
    } else {
    enlace.classList.add('text-gray-500', 'hover:bg-gray-50', 'hover:text-verde-oscuro');
    }
});

let productos     = JSON.parse(localStorage.getItem('milpa_productos') || '[]');
let indiceEdicion = -1;

function renderizarTabla() {
    const cuerpo = document.getElementById('cuerpo-tabla');

    if (productos.length === 0) {
    cuerpo.innerHTML = `
        <tr>
        <td colspan="5" class="text-center py-12 text-gray-300">
            <div class="text-4xl mb-2">🌾</div>
            <p class="text-sm">No hay productos registrados aun</p>
            <p class="text-xs mt-1">Presiona el boton para agregar el primero</p>
        </td>
        </tr>
    `;
    } else {
    cuerpo.innerHTML = productos.map((p, index) => `
    <tr class="hover:bg-gray-50 transition duration-150">

        <td class="px-6 py-4">
        ${p.imagen
            ? `<img src="${p.imagen}" alt="${p.nombre}" class="w-12 h-12 object-cover rounded-lg"/>`
            : `<div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">Sin imagen</div>`
        }
        </td>

        <td class="px-6 py-4 font-medium text-verde-oscuro">${p.nombre}</td>
        <td class="px-6 py-4 text-gray-400 max-w-xs truncate">${p.descripcion}</td>
        <td class="px-6 py-4 font-semibold text-verde-medio">$${parseFloat(p.precio).toFixed(2)}</td>

        <td class="px-6 py-4">
            <div class="flex gap-2">
            <button
                onclick="editarProducto(${index})"
                class="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition duration-200">
                Editar
            </button>
            <button
                onclick="eliminarProducto(${index})"
                class="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-lg hover:bg-red-100 transition duration-200">
                Eliminar
            </button>
            </div>
        </td>

        </tr>
    `).join('');
    }

    document.getElementById('contador-total').textContent = productos.length;
}

function guardarEnStorage() {
    localStorage.setItem('milpa_productos', JSON.stringify(productos));
}

function mostrarFormulario(modo) {
    document.getElementById('formulario-producto').classList.remove('hidden');
    if (modo === 'nuevo') {
    document.getElementById('titulo-formulario').textContent = 'Agregar Producto';
    limpiarFormulario();
    indiceEdicion = -1;
    }
}

function cancelarFormulario() {
    document.getElementById('formulario-producto').classList.add('hidden');
    limpiarFormulario();
    indiceEdicion = -1;
}

function limpiarFormulario() {
    document.getElementById('input-nombre').value      = '';
    document.getElementById('input-descripcion').value = '';
    document.getElementById('input-precio').value      = '';
    document.getElementById('input-imagen').value      = '';
    document.getElementById('preview-imagen').classList.add('hidden');
    document.getElementById('preview-imagen').src      = '';
}


function editarProducto(index) {
    const p       = productos[index];
    indiceEdicion = index;

    document.getElementById('titulo-formulario').textContent = 'Editar Producto';
    document.getElementById('input-nombre').value            = p.nombre;
    document.getElementById('input-descripcion').value       = p.descripcion;
    document.getElementById('input-precio').value            = p.precio;

    if (p.imagen) {
    const preview = document.getElementById('preview-imagen');
    preview.src   = p.imagen;
    preview.classList.remove('hidden');
    }

    document.getElementById('formulario-producto').classList.remove('hidden');
    document.getElementById('formulario-producto').scrollIntoView({ behavior: 'smooth' });
}

function eliminarProducto(index) {
    if (!confirm('¿Estas seguro de que deseas eliminar este producto?')) return;
    productos.splice(index, 1);
    guardarEnStorage();
    renderizarTabla();
}

function guardarProducto() {
    const nombre      = document.getElementById('input-nombre').value.trim();
    const descripcion = document.getElementById('input-descripcion').value.trim();
    const precio      = document.getElementById('input-precio').value.trim();
    const imagenInput = document.getElementById('input-imagen');
    const archivo     = imagenInput.files[0];

    if (!nombre || !descripcion || !precio) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
    }

    if (archivo) {
    const reader    = new FileReader();
    reader.onload   = function(e) {
        procesarGuardado(nombre, descripcion, precio, e.target.result);
    };
    reader.readAsDataURL(archivo);
    } else {
    const imagenAnterior = indiceEdicion >= 0 ? productos[indiceEdicion].imagen : null;
    procesarGuardado(nombre, descripcion, precio, imagenAnterior);
    }
}

function procesarGuardado(nombre, descripcion, precio, imagen) {
    const producto = { nombre, descripcion, precio, imagen };

    if (indiceEdicion >= 0) {
    productos[indiceEdicion] = producto;
    } else {
    productos.push(producto);
    }

    guardarEnStorage();
    renderizarTabla();
    cancelarFormulario();
}


document.getElementById('input-imagen').addEventListener('change', function() {
    const archivo = this.files[0];
    if (!archivo) return;

    const reader  = new FileReader();
    reader.onload = function(e) {
    const preview = document.getElementById('preview-imagen');
    preview.src   = e.target.result;
    preview.classList.remove('hidden');
    };
    reader.readAsDataURL(archivo);
});

renderizarTabla();
console.log('JS cargado correctamente');

const btnCargar = document.getElementById('btnUpload');
const listaPlataformas = document.getElementById('platformList');


// Función para pintar las plataformas en la página
const pintarPlataformas = (plataformas) => {
    listaPlataformas.innerHTML = '';
    plataformas.forEach(plataforma => {
        const li = document.createElement('li');
        li.innerHTML = `<span><strong>${plataforma.nombre}</strong> - ${plataforma.fabricante}</span>
            <button class="edit-btn" onclick="prepararEdicion(${plataforma.id}, '${plataforma.nombre}', '${plataforma.fabricante}')">Editar</button>
            <button class="delete-btn" onclick="eliminarPlataforma(${plataforma.id})">Eliminar</button>
        `;
        listaPlataformas.appendChild(li);
    });
}

// READ - GET --> Cargar las plataformas desde el backend y mostrarlas en la página
btnCargar.addEventListener('click', async () => {
    // Llamada a la API para obtener las plataformas
    try {
        const response = await fetch('http://localhost:3000/api/plataforma');
        if (!response.ok) {
            throw new Error('Error al cargar las plataformas');
        }

        const plataformas = await response.json();
        pintarPlataformas(plataformas);
    } catch (error) {
        console.error('Error al cargar las plataformas:', error);
        listaPlataformas.innerHTML = '<li>Error al cargar las plataformas. Por favor, inténtalo de nuevo.</li>';
    }
});


// POST --> Enviar una nueva plataforma al backend para que la guarde en la base de datos
// + PUT --> Enviar una plataforma actualizada al backend para que la modifique en la base de datos
const form = document.getElementById('formPlataforma');
const mensajeError = document.getElementById('mensajeError');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    const plataformaId = document.getElementById('plataformaId').value;
    const nombre = document.getElementById('nombre').value.trim();
    const fabricante = document.getElementById('fabricante').value.trim();

    const url = plataformaId ? `http://localhost:3000/api/plataforma/${plataformaId}` : 'http://localhost:3000/api/plataforma';
    const method = plataformaId ? 'PUT' : 'POST';

    // Validación básica
    if (nombre.length < 3) {
        mensajeError.textContent = 'El nombre debe tener al menos 3 caracteres.';
        return;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, fabricante })
        });

        if (!response.ok) {
            throw new Error('Error al guardar la plataforma');
        }

        // Limpiar el formulario
        limpiarFormulario();
        btnCargar.click(); // Recargar la lista de plataformas para mostrar la nueva plataforma

    } catch (error) {
        console.error('Error al guardar la plataforma:', error);
        mensajeError.textContent = 'Error al guardar la plataforma. Por favor, inténtalo de nuevo.';
    }
});


// UPDATE - PUT --> Enviar una plataforma actualizada al backend para que la modifique en la base de datos
window.prepararEdicion = (id, nombre, fabricante) => {
    // 1. ID en el campo oculto
    document.getElementById('plataformaId').value = id;
    
    // 2. Rellena el formulario con los datos de la plataforma a editar
    document.getElementById('nombre').value = nombre;
    document.getElementById('fabricante').value = fabricante;
    
    // 3. Cambia la interfaz para que el usuario sepa que está editando
    document.getElementById('btnGuardar').textContent = 'Actualizar Plataforma';
    document.getElementById('btnCancelar').style.display = 'block';
    document.querySelector('h2').textContent = 'Actualizar Plataforma';
};

window.limpiarFormulario = () => {
    document.getElementById('plataformaId').value = '';
    document.getElementById('formPlataforma').reset();
    document.getElementById('btnGuardar').textContent = 'Guardar Plataforma';
    document.getElementById('btnCancelar').style.display = 'none';
    document.querySelector('h2').textContent = 'Añadir Nueva Plataforma';
};

// DELETE  --> Enviar una solicitud al backend para que elimine una plataforma de la base de datos
const eliminarPlataforma = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta plataforma?')) {
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/plataforma/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar la plataforma');
        }
        btnCargar.click(); // Recargar la lista de plataformas para reflejar la eliminación
    } catch (error) {
        console.error('Error al eliminar la plataforma:', error);
        alert('Error al eliminar la plataforma. Por favor, inténtalo de nuevo.');
    }
};
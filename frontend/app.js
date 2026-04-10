console.log('JS cargado correctamente');

// --- PLATAFORMAS ---

const btnVerPlataformas = document.getElementById('btnUpload');
const listaPlataformas = document.getElementById('platformList');


// Función para pintar las plataformas en la página
const pintarPlataformas = (plataformas) => {
    listaPlataformas.innerHTML = '';
    plataformas.forEach(plataforma => {
        const li = document.createElement('li');
        li.innerHTML = `<span><strong>${plataforma.nombre}</strong> - ${plataforma.fabricante}</span>
             <div class="acciones">    
                <button class="edit-btn" onclick="prepararEdicion(${plataforma.id}, '${plataforma.nombre}', '${plataforma.fabricante}')">Editar</button>
                <button class="delete-btn" onclick="eliminarPlataforma(${plataforma.id})">Eliminar</button>
            </div>
        `;
        listaPlataformas.appendChild(li);
    });
}

// READ - GET --> Cargar las plataformas desde el backend y mostrarlas en la página
btnVerPlataformas.addEventListener('click', async () => {
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
    mensajeError.textContent = ''; // Limpiar mensajes de error anteriores
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
        btnVerPlataformas.click(); // Recargar la lista de plataformas para mostrar la nueva plataforma
        actualizarSelectPlataformas(); // Actualizar el select de plataformas para que incluya la nueva plataforma

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
    document.querySelector('#tituloFormPlataforma').textContent = 'Actualizar Plataforma';
};

window.limpiarFormulario = () => {
    document.getElementById('plataformaId').value = '';
    document.getElementById('formPlataforma').reset();
    document.getElementById('btnGuardar').textContent = 'Guardar Plataforma';
    document.getElementById('btnCancelar').style.display = 'none';
    document.querySelector('#tituloFormPlataforma').textContent = 'Añadir Nueva Plataforma';
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
        btnVerPlataformas.click(); // Recargar la lista de plataformas para reflejar la eliminación
        actualizarSelectPlataformas(); // Actualizar el select de plataformas para reflejar la eliminación
    } catch (error) {
        console.error('Error al eliminar la plataforma:', error);
        alert('Error al eliminar la plataforma. Por favor, inténtalo de nuevo.');
    }
};

// --- VIDEOJUEGOS ---

const selectPlataforma = document.getElementById('selectPlataforma');

// Rellena con los IDs y Nombres de las plataformas
const actualizarSelectPlataformas = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/plataforma');
        const plataformas = await response.json();
        
        // No borramos la primera opción ("Selecciona...")
        selectPlataforma.innerHTML = '<option value="">Selecciona una plataforma...</option>';
        
        plataformas.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id; // El ID que va al backend
            option.textContent = p.nombre; // El nombre que ve el usuario
            selectPlataforma.appendChild(option); // Agrega la opción al select
        });
    } catch (error) {
        console.error('Error al cargar plataformas para el select:', error);
    }
};

actualizarSelectPlataformas(); // Carga las plataformas en el select al cargar la página

// Ver listado de videojuegos
const btnVerVideojuegos = document.getElementById('btnCargarJuegos');
const listaVideojuegos = document.getElementById('videojuegosList');

const pintarVideojuegos = (videojuegos) => {
    listaVideojuegos.innerHTML = '';
    videojuegos.forEach(videojuego => {
        const li = document.createElement('li');
        const imgTag = videojuego.imagen_url 
            ? `<img src="${videojuego.imagen_url}" alt="${videojuego.titulo}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 15px;">` 
            : '';
        li.innerHTML = `
            <div style="display: flex; align-items: center;">
                ${imgTag}
                <span><strong>${videojuego.titulo}</strong> - ${videojuego.genero} (Plataforma: ${videojuego.plataforma_nombre})</span>
            </div>
            <div class="acciones">    
                <button class="edit-btn" onclick="prepararEdicionVideojuego(${videojuego.id}, '${videojuego.titulo}', '${videojuego.genero}', '${videojuego.imagen_url}', ${videojuego.plataforma_id})">Editar</button>
                <button class="delete-btn" onclick="eliminarVideojuego(${videojuego.id})">Eliminar</button>
            </div>
            `;
        listaVideojuegos.appendChild(li);
    });
}

// READ - GET --> Cargar los videojuegos desde el backend y mostrarlos en la página
btnVerVideojuegos.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/videojuego');
        if (!response.ok) {
            throw new Error('Error al cargar los videojuegos');
        }
        const videojuegos = await response.json();
        pintarVideojuegos(videojuegos);
    } catch (error) {
        console.error('Error al cargar los videojuegos:', error);
        listaVideojuegos.innerHTML = '<li>Error al cargar los videojuegos. Por favor, inténtalo de nuevo.</li>';
    }
});

// POST --> Enviar un nuevo videojuego al backend para que lo guarde en la base de datos
// + PUT --> Enviar un videojuego actualizado al backend para que lo modifique en la base de datos
const formVideojuego = document.getElementById('formVideojuego');
const mensajeErrorJuego = document.getElementById('mensajeErrorJuego');

formVideojuego.addEventListener('submit', async (event) => {
    event.preventDefault();
    mensajeErrorJuego.textContent = ''; // Limpiar mensajes de error anteriores
    const videojuegoId = document.getElementById('videojuegoId').value;
    const titulo = document.getElementById('titulo').value.trim();
    const genero = document.getElementById('genero').value.trim();
    const imagen_url = document.getElementById('imagen_url').value.trim();
    const plataforma_id = document.getElementById('selectPlataforma').value;
    const url = videojuegoId ? `http://localhost:3000/api/videojuego/${videojuegoId}` : 'http://localhost:3000/api/videojuego';
    const method = videojuegoId ? 'PUT' : 'POST';

    // Validación básica
    if (titulo.length < 3) {
        mensajeErrorJuego.textContent = 'El título debe tener al menos 3 caracteres.';
        return;
    }
    if (genero.length < 3) {
        mensajeErrorJuego.textContent = 'El género debe tener al menos 3 caracteres.';
        return;
    }
    if (!plataforma_id) {
        mensajeErrorJuego.textContent = 'Debes seleccionar una plataforma.';
        return;
    }
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'            },
            body: JSON.stringify({ titulo, genero, imagen_url, plataforma_id })
        });
        if (!response.ok) {
            throw new Error('Error al guardar el videojuego');
        }
        limpiarFormularioVideojuego();
        btnVerVideojuegos.click(); // Recargar la lista de videojuegos para mostrar el nuevo videojuego
    } catch (error) {
        console.error('Error al guardar el videojuego:', error);
        mensajeErrorJuego.textContent = 'Error al guardar el videojuego. Por favor, inténtalo de nuevo.';
    }
});

// UPDATE - PUT --> Enviar un videojuego actualizado al backend para que lo modifique en la base de datos
window.prepararEdicionVideojuego = (id, titulo, genero, imagen_url, plataforma_id) => {
    document.getElementById('videojuegoId').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('genero').value = genero;
    document.getElementById('imagen_url').value = imagen_url;
    document.getElementById('selectPlataforma').value = plataforma_id;
    document.getElementById('btnGuardarJuego').textContent = 'Actualizar Videojuego';
    document.getElementById('btnCancelarJuego').style.display = 'block';
    document.querySelector('#tituloFormVideojuego').textContent = 'Actualizar Videojuego';
};

window.limpiarFormularioVideojuego = () => {    
    document.getElementById('videojuegoId').value = '';
    document.getElementById('formVideojuego').reset();
    document.getElementById('btnGuardarJuego').textContent = 'Guardar Videojuego';
    document.getElementById('btnCancelarJuego').style.display = 'none';
    document.querySelector('#tituloFormVideojuego').textContent = 'Añadir Nuevo Videojuego';
}

// DELETE  --> Enviar una solicitud al backend para que elimine un videojuego de la base de datos
const eliminarVideojuego = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este videojuego?')) {
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/api/videojuego/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el videojuego');
        }
        btnVerVideojuegos.click(); // Recargar la lista de videojuegos para reflejar la eliminación
    } catch (error) {
        console.error('Error al eliminar el videojuego:', error);
        alert('Error al eliminar el videojuego. Por favor, inténtalo de nuevo.');
    }
};
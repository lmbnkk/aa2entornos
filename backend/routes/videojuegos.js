const express = require('express');
const router = express.Router();
const db = require('../database');
const { body, validationResult } = require('express-validator'); // libreria para validaciones

// READ - GET --> Obtener todos los videojuegos
router.get('/', (req, res) => {
    db.all('SELECT videojuego.*, plataforma.nombre AS plataforma_nombre FROM videojuego LEFT JOIN plataforma ON videojuego.plataforma_id = plataforma.id', [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los videojuegos:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows); // envía los resultados como json
    });
});

// CREATE - POST --> Crear un nuevo videojuego
router.post('/',
    // Validación
    body('titulo').isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),
    body('genero').isLength({ min: 3 }).withMessage('El género debe tener al menos 3 caracteres'),
    body('plataforma_id').isInt().withMessage('La plataforma_id debe ser un número entero'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { titulo, genero, imagen_url, plataforma_id } = req.body;

        // Comprobar que la plataforma existe
        db.get('SELECT id FROM plataforma WHERE id = ?', [plataforma_id], (err, row) => {
            if (err) {
                console.error('Error al comprobar la plataforma:', err.message);
                res.status(500).json({ error: err.message });
                return;
            }
            if (!row) {
                return res.status(400).json({ error: 'La plataforma no existe' });
            }

            // Si existe, insertar el videojuego
            db.run('INSERT INTO videojuego (titulo, genero, imagen_url, plataforma_id) VALUES (?, ?, ?, ?)', [titulo, genero, imagen_url, plataforma_id], function(err) {
                if (err) {
                    console.error('Error al crear el videojuego:', err.message);
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(201).json({ id: this.lastID, titulo, genero, imagen_url, plataforma_id });
            });
        });
    }
);

// UPDATE - PUT --> Actualizar un videojuego existente
router.put('/:id',
    // Validación
    body('titulo').trim().isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),
    body('genero').trim().isLength({ min: 3 }).withMessage('El género debe tener al menos 3 caracteres'),
    body('plataforma_id').isInt().withMessage('La plataforma_id debe ser un número entero'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { titulo, genero, imagen_url, plataforma_id } = req.body;

        db.run('UPDATE videojuego SET titulo = ?, genero = ?, imagen_url = ?, plataforma_id = ? WHERE id = ?', [titulo, genero, imagen_url, plataforma_id, id], function(err) {
            if (err) {
                console.error('Error al actualizar el videojuego:', err.message);
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Videojuego no encontrado' });
            }

            res.json({ id, titulo, genero, imagen_url, plataforma_id });
        });
    }
);

// DELETE  --> Eliminar un videojuego existente
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM videojuego WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error al eliminar el videojuego:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }

        // Si no se eliminó ningún registro, el videojuego no existe
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Videojuego no encontrado' });
        }

        res.json({ message: 'Videojuego eliminado correctamente' });
    });
});

module.exports = router;
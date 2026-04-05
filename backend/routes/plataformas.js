const express = require('express');
const router = express.Router();
const db = require('../database'); // Importamos la conexión de database.js
const { body, validationResult } = require('express-validator'); // libreria para validaciones

// GET --> Obtener todas las plataformas
router.get('/', (req, res) => {
    db.all('SELECT * FROM plataformas', [], (err, rows) => {
        if (err) {
            console.error('Error al obtener las plataformas:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows); // envía los resultados como json
    });
});

// POST --> Crear una nueva plataforma
router.post('/', 
    // Validación
    body('nombre').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    (req, res) => {
        // Comprobar si hay errores de validación 
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }

        const { nombre, fabricante } = req.body;      
        db.run("INSERT INTO plataformas (nombre, fabricante) VALUES (?, ?)", [nombre, fabricante], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, nombre, fabricante });
        });
    }
);

module.exports = router;

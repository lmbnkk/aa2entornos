const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta al archivo de la base de datos
const dbPath = path.resolve(__dirname, 'gestionvideojuegos.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conectado a SQLite.');

        // Activar las Foreign Keys
        db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
            if (pragmaErr) {
                console.error('Error al activar Foreign Keys:', pragmaErr.message);
            } else {
                console.log('Integridad referencial (Foreign Keys) activada.');
            }
        });

    }
});

module.exports = db;
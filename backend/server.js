const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors()); // Hace que el HTML/JS hable con el backend
app.use(express.json()); // El servidor entiende datos en formato JSON

const PORT = 3000;

// Ruta
app.get('/', (req, res) => {
    res.send('API de Biblioteca de Videojuegos funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor arrancado en http://localhost:${PORT}`);
});
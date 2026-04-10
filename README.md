# Gestión de Biblioteca de Videojuegos

Proyecto desarrollado para la 2ª Evaluación de Entornos de Desarrollo. Consiste en una aplicación web (Backend + Frontend) para la gestión de un catálogo de videojuegos y sus plataformas.

## Dependencias
* Node.js
* Express
* SQLite3
* Express-validator

## Instalación y Puesta en Marcha

### 1. Requisitos previos
Necesario tener instalado **Node.js** y **npm**.

### 2. Instalación
Clona el repositorio y ejecuta este comando en la raíz del proyecto para instalar todo lo necesario (express, sqlite3, express-validator):

```bash
npm install
```

### 3. Iniciar el Backend
Para iniciar el servidor de la API ejecutar: 

```bash
node backend/server.js
```

### 4. Frontend
Se compone de: index.html, style.css, app.js.

1. Abre en tu navegador: `frontend/index.html`.
2. Para que funcionen las peticiones, el backend debe estar iniciado en el puerto 3000.

## Estructura del proyecto
* **README.md**: Instrucciones del proyecto
* **/backend**: Express, base de datos SQLite y rutas API
* **/frontend**: Interfaz HTML5, CSS3 y JS
* **/docs**: Colección Postman

## Documentación de la API
En la Wiki del repositorio (https://github.com/lmbnkk/aa2entornos/wiki), se encuentra detallado los endpoints de Plataformas y Videojuegos.

## Gestión del proyecto
Se ha utilizado según la metodología de flujo de trabajo por ramas en GitHub. Cada funcionalidad o corrección se ha gestionado en ramas independientes fusionandola una vez terminada a la rama principal mediante Pull Request.
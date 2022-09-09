const express = require('express');
const path = require('path');
const app = express();
const countries = require('./countries.json');
const usaDaily = require('./usa_daily.json');

const { validateToken, authorize } = require('./utils');
app.use(express.static('public'));
app.listen(3000, console.log("Servidor encendido 🟢"));

// Uso de express.json() para las comunicaciones front/back
app.use(express.json());

app.get("/api/total", (req, res) => {
    res.json(countries)
})

app.post('/api/login', authorize);

app.get("/api/country/usa", validateToken, (req, res) => {
    res.send(usaDaily)
})

// Creacion de nueva ruta para disponibilizar los recursos de la carpeta plubic y el archivo index.html de manera que siga el mismo flujo de trabajo
app.get('/covid19', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/covid19/index.html'))
});

/* app.get("/api/country/usa", validateToken, (req, res) => {
    res.send(usaDaily)
}) */
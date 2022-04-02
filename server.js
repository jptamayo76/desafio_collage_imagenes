const express = require('express');
const efu = require('express-fileupload');
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = process.env.port || 3000;

app.listen(port, () => {
    console.log('Servidor corriendo en Puerto ' + port);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(efu({
    limits: { fileSize: 5000000 }, // pone limite al tamaño del archivo a subir
    abortOnLimit: true,  // seo el archivo pesa mas que el limite se aborta
    responseOnLimit: 'tu archivo de imagen ha excedido el limite de 5MB.',  // mensaje si se aborta por limite
    debug: true   // mensajes del proceso en consola
}));

app.use('/imgs', express.static(__dirname + '/imgs'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/formulario.html");
});

app.get("/imagen", (req, res) => {
    res.sendFile(__dirname + "/collage.html");
});

app.post("/imagen", (req, res) => {
    const { target_file } = req.files;
    const { posicion } = req.body;

    if (target_file.mimetype == "image/jpeg") {
        target_file.mv(`${__dirname}/imgs/imagen-${posicion}.jpg`, (err) => {
            if (err) {
                res.send("Error cargado el archivo : " + err);
            } else {
                res.sendFile(__dirname + "/collage.html");
            }
        });
    } else {
        res.send("El Archivo DEBE ser de tipo JPG");
    }
});

app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/imgs/${nombre}`, (err) => {
        if (err) {
            res.send(`Imagen ${nombre} no pudo ser eliminada : ${err}`);
        } else {
            res.redirect("/imagen");
        }
    });
});
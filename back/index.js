require('dotenv').config();

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const router = require('./app/router');


const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: '*'
}

app.use(cors(corsOptions));

// Permet de récupérer automatiquement les informations
// contenues dans le corps des requetes de type
// POST PATCH PUT

//app.use(express.urlencoded({ extended: true }));

const bodyParser = multer();
app.use( bodyParser.none() );

// on ajoute le middleware de "nettoyage" des variables
const bodySanitizer = require('./app/middlewares/body-sanitizer');
app.use(bodySanitizer);

app.use(express.static('static'));


app.use(router);

app.listen(port, () => {
    console.log(`Je suis lancé, visite http://localhost:${port}`);
});
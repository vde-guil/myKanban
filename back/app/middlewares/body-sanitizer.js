const sanitizer = require('sanitizer');


const sanitize = obj => {
    //pour chaque propriété de l'object, on va modifier la valeur stockée avec sanitizer pour nous protéger d'éventuelles injections
    for (const prop in obj) {
        obj[prop] = sanitizer.escape(obj[prop]);
    }
}


const bodySanitizer = (request, response, next) => {
    //l'utilisateur peut indiquer des infos dans 3 endroits, 3 sous-objects de request :
    //request.params (paramètres dans l'url)
    //request.query (data passées dans l'url après ?)
    //request.body (data passées via un formulaire)

    sanitize(request.params);
    sanitize(request.query);
    if (request.body) {
        sanitize(request.body);
    }
    next();
}

module.exports = bodySanitizer;
const classes = require('../models');

const getClassName = (reqUrl) => {
    // Je recupere le nom de la classe en manipulant request.url
    let className = reqUrl.split('/')[1].split('');
    className.pop();
    className[0] = className[0].toUpperCase();

    return className.join('')
};

const getOptions = (model, isFindAll) => {

    const options = {
        include: { all:true, nested: true }
    }

    if (model.tableName === 'list') {

        if (isFindAll) {
            options.order = [
                ['id', 'ASC'],
                ['cards', 'position', 'ASC'],
            ]    
        } else {
            options.order = [
                ['cards', 'position', 'ASC'],
            ]    
        }
    } else if (model.tableName === 'card') {
        if (isFindAll) {
            options.order = [
                ['position', 'ASC'],
            ]    
        }
    }
    
    return options;
}

/*
** MAIN CONTROLLER
*/
const mainController = {


    getAll: async (request, response, next) => {

        try {

            const className = getClassName(request.url);

            const model = classes[className];
            console.log(model);

            const options = getOptions(model, true);
            
            console.log(options)

            // je lance la  requete sur la bonne classe grace a un object global qui 
            const result = await model.findAll(options);
            response.json(result);

        } catch (error) {
            response.status(error.status || 500);
            console.log(error.message);
            response.json({
                error: {
                    status: error.status,
                    message: error.message
                }
            });
        }
    },

    getOneById: async (request, response, next) => {
        const className = getClassName(request.url);
        try {
            const id = +request.params.id;

            //je recupere la reference a la classe importee grace a son class name recuperee
            const model = classes[className];

            const options = getOptions(model, false);

            

            const instance = await model.findByPk(id, options);

            if (instance === null) {
                const errors = [];
                errors.push(`la ${className.toLowerCase()} n'existe pas`)
                response.status(404).json(errors);
            } else {
                response.json(instance);
            }


        } catch (error) {
            response.status(error.status || 500);
            console.log(error.message);
            response.json({
                error: {
                    status: error.status,
                    message: error.message
                }
            });
        }
    },

    create: async (request, response, next) => {
        const className = getClassName(request.url);
        const model = classes[className];

        const errors = [];
        const body = {};

        const keys = Object.keys(request.body);
       
        for (key of keys) {
            if (!request.body[key] || !request.body[key].trim()) {
                errors.push(`le champs ${key} est obligatoire`);
                console.log('ok')
            } else {
                body[key] = request.body[key];
            }
        }

        try {

            if (errors.length === 0) {
                const instance = await model.create(body);
                response.json(instance);
            } else {
                response.status(422).json(errors);
            }

        } catch (error) {
            response.status(error.status || 500);
            console.log(error.message);
            response.json({
                error: {
                    status: error.status,
                    message: error.message
                }
            });
        }
    },

    update: async (request, response, next) => {
        try {
            const className = getClassName(request.url);
            const model = classes[className];

            const instance = await model.findByPk(request.params.id);

            if (instance === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {
                const keys = Object.keys(request.body);

                for (key of keys) {
                    if (request.body[key] && request.body[key].trim()) {
                        instance[key] = request.body[key];
                    }
                }

                await instance.save();

                response.json(instance);
            }

        } catch (error) {
            response.status(error.status || 500);
            console.log(error.message);
            response.json({
                error: {
                    status: error.status,
                    message: error.message
                }
            });
        }
    },

    updatePut: async (request, response, next) => {
        const className = getClassName(request.url);
        const model = classes[className];

        const errors = [];

        const keys = Object.keys(request.body);

        try {
            const instance = await model.findByPk(request.params.id);
            
            if (instance === null) {
                response.status(404).json(`La ressource demandée n'existe pas`);
            } else {
                
                for (key of keys) {
                    if (!request.body[key] || !request.body[key].trim()) {
                        errors.push(`le champs ${key} est obligatoire`);
                    } else {
                        instance[key] = request.body[key];
                    }
                }
                if (errors.length === 0) {

                    await instance.save();
                    response.json(instance);

                } else {
                    response.status(422).json(errors);
                }
            }

        } catch (error) {
            response.status(error.status || 500);
            console.log(error.message);
            response.json({
                error: {
                    status: error.status,
                    message: error.message
                }
            });
        }
    },

    delete: async (request, response, next) => {
        const className = getClassName(request.url);
        const model = classes[className];

        try {

            const instance = await model.findByPk(request.params.id);

            if (instance === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // supprimer la carte demandée
                await instance.destroy();

                // Répondre au client.
                // la transmettre
                response.json("La suppression s'est bien passée");
            }
        } catch (error) {
            response.status(error.status || 500);
            console.log(error.message);
            response.json({
                error: {
                    status: error.status,
                    message: error.message
                }
            });
        }
    }

};

module.exports = mainController;
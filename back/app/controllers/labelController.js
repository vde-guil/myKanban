const { Label } = require('../models');


const labelController = {
    getAll: async (request, response, next) => {

        try {
            console.log("coucou");
            // récupérer toutes les labels
            const labels = await Label.findAll();

            // Les renvoyer au format JSON
            response.json(labels);

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }

    },

    getOneById: async (request, response, next) => {
        try {
            // récupérer la label demandée
            const label = await Label.findByPk(request.params.id, {
                include: ['cards']
            });

            if (label === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // la transmettre
                response.json(label);
            }

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }
    },

    create: async (request, response) => {
        const name = request.body.name;
        const errors = [];

        if (!request.body.name || !request.body.name.trim()) {
            errors.push('Le nom de la liste est obligatoire');
        }

        if (errors.length === 0) {
            try {
                const label = await Label.create({
                    name
                });
                response.json(label);

            } catch (error) {
                console.log(error)
                response.status(500).send('Une erreur est surevnue');
            }
        }
        else {
            response.status(422).json(errors);
        }


    },

    update: async (request, response) => {

        
        try {
            
            const label = await Label.findByPk(request.params.id);

            if (label === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                
                if (request.body.name && request.body.name.trim()) {
                   
                    label.name = request.body.name.trim();
                }
                await label.save();

                response.json(label);
            }

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }

    },

    updatePut: async (request, response) => {

        try {
            const label = await Label.findByPk(request.params.id);

            if (label === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                const errors = [];
                if (!request.body.name || !request.body.name.trim()) {
                    errors.push('le nom doit être fourni');
                }

                if (errors.length === 0) {
                    label.name = request.body.name;
                    await label.save();
                    response.json(label);
                }
                else {
                    response.status(422).json(errors);
                }
            }
        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est survnue');
        }

    },

    delete: async (request, response) => {
         try {
            const label = await Label.findByPk(request.params.id);

            if (label === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {
                await label.destroy();
                response.send("La suppression s'est bien passée");
            }

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }
    }

};

module.exports = labelController;
const { Label, List, Card } = require('../models');

const associationController = {

    add: async (request, response, next) => {

        try {
            const card = await Card.findByPk(request.params.cardId);
            if (!card) {
                const error = {
                    status: 404,
                    message: 'Ressource non disonible'
                };
                throw error;
            }
            const label = await Label.findByPk(request.params.labelId);
            if (!label) {
                const error = {
                    status: 404,
                    message: 'Ressource non disonible'
                };
                throw error;
            }
            const result = await card.addLabel(label);

            console.log(result);
            response.json(await card.reload({ include: "labels" }));


        } catch (error) {
            console.log(error);
            if (error.status)
                response.status(error.status).send(error.message);
            else
                response.status(500).send(error.stack);
        }


    },

    delete: async (request, response, next) => {
        try {
            const card = await Card.findByPk(request.params.cardId);
            if (!card) {
                const error = {
                    status: 404,
                    message: 'Ressource non disonible'
                };
                throw error;
            }
            
            const label = await Label.findByPk(request.params.labelId);
            if (!label) {
                const error = {
                    status: 404,
                    message: 'Ressource non disonible'
                };
                throw error;
            }

            await card.removeLabel(request.params.labelId);

            response.json(await card.reload({ include: "labels"}));


        } catch (error) {
            console.log(error);
            if (error.status)
                response.status(error.status).send(error.message);
            else
                response.status(500).send(error.stack);
        }
    },

};

module.exports = associationController;
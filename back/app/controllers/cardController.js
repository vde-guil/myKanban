const { List, Card, Label } = require('../models/');

const cardController = {

    getAllByListId: async (request, response, next) => {
        try {
            const listId = +request.params.id;

            const list = await List.findByPk(listId, {
                include: [{
                    association: 'cards',
                    include: ['labels']
                }]
            });

            if (list) {
                response.json(list.cards);
            } else {
                const error = [];
                response.json(error.push("la liste n'existe pas"));
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

    getOneById: async (request, response, next) => {
        try {
            const cardId = +request.params.id;

            const card = await Card.findByPk(cardId, {
                include: ['labels']
            })

            if (!card) {
                const error = [];
                response.json(error.push("la carte n'existe pas"));
            } else {
                response.json(card);
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
        try {
            const error = [];

            const body = {
                title: request.body.title.trim(),
                list_id: request.body.list_id.trim(),
                position: request.body.position.trim(),
            }

            if (!body.title.trim()) {
                error.push("le titre est obligatoire");
            }

            if (!body.list_id.trim()) {
                error.push("le list_id est obligatoire");
            }

            if (!body.position.trim()) {
                error.push("la position est obligatoire");
            }

            if (request.body.color.trim()) {
                body.color = request.body.color.trim();
            }

            if (error.length === 0) {
                const card = await Card.create(body);
                response.json(card);
            } else {
                response.status(422).json(error);
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
            const card = await Card.findByPk(request.params.id);

            if (card === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                if (request.body.title && request.body.title.trim()) {
                    card.title = request.body.title.trim();
                }

                if (request.body.list_id && request.body.list_id.trim()) {
                    card.title = request.body.list_id.trim();
                }

                if (request.body.position && request.body.position.trim()) {
                    card.title = request.body.position.trim();
                }

                if (request.body.color && request.body.color.trim()) {
                    card.color = request.body.color.trim();
                }

                await card.save();

                response.json(card);
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
        try {
            const card = await Card.findByPk(request.params.id);

            if (card === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {
                const errors = []

                if (!request.body.title || !request.body.title.trim()) {
                    errors.push("le titre est obligatoire");
                }

                if (!request.body.list_id || !request.body.list_id.trim()) {
                    errors.push("l id de la liste est obligatoire");
                }

                if (!request.body.position || !request.body.position.trim()) {
                    errors.push("la position est obligatoire");
                }
                
                if (request.body.color && request.body.color.trim()) {
                    card.color = request.body.color.trim();
                }

                if (errors.length === 0) {
                    card.title = request.body.title.trim();
                    card.list_id = request.body.list_id.trim();
                    card.position = request.body.position.trim();

                    await card.save();
                    response.json(card);
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

    delete: async(request, response, next) => {
        try {
            const card = await Card.findByPk(request.params.id);

            if (card === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // supprimer la carte demandée
                await card.destroy();

                // Répondre au client.
                // la transmettre
                response.send("La suppression s'est bien passée");
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

module.exports = cardController;
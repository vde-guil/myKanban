const express = require('express');
const router = express.Router();
const listController = require('./controllers/listController');
const cardController = require('./controllers/cardController');
const labelController = require('./controllers/labelController');
const associationController = require('./controllers/associationController');
const mainController = require('./controllers/mainController');

router.get('/lists', mainController.getAll);
router.get('/lists/:id', mainController.getOneById);
router.post('/lists', mainController.create);
router.patch('/lists/:id', mainController.update);
router.put('/lists/:id', mainController.updatePut);
router.delete('/lists/:id', mainController.delete);

router.get('/lists/:id/cards', cardController.getAllByListId);
router.get('/cards/:id', mainController.getOneById);
router.post('/cards', mainController.create);
router.patch('/cards/:id', mainController.update);
router.put('/cards/:id', mainController.updatePut);
router.delete('/cards/:id', mainController.delete);

router.get('/labels', mainController.getAll);
router.get('/labels/:id', mainController.getOneById);
router.post('/labels', mainController.create);
router.patch('/labels/:id', mainController.update);
router.put('/labels/:id', mainController.updatePut);
router.delete('/labels/:id', mainController.delete);

router.post('/cards/:cardId/labels/:labelId', associationController.add);
router.delete('/cards/:cardId/labels/:labelId', associationController.delete);

module.exports = router;
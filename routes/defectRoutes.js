const express = require('express');
const router = express.Router();
const defectController = require('../controllers/defectController');

router.get('/', defectController.getAll);

router.get('/:id', defectController.getById);

router.post('/', defectController.create);

router.put('/:id', defectController.update);

router.delete('/:id', defectController.remove);

module.exports = router;
const express = require('express');
const router = express.Router();
const designationController = require('../controllers/designationController');

// GET /api/designations
router.get('/', designationController.getAll);

// GET /api/designations/:id
router.get('/:id', designationController.getById);

// POST /api/designations
router.post('/', designationController.create);

// PUT /api/designations/:id
router.put('/:id', designationController.update);

// DELETE /api/designations/:id
router.delete('/:id', designationController.remove);

module.exports = router;

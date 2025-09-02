const express = require("express");
const router = express.Router();
const defectsByModuleController = require("../controllers/defectsByModuleController");

// GET defects by module for a specific project
router.get("/:projectId", defectsByModuleController.getDefectsByModule);

module.exports = router;

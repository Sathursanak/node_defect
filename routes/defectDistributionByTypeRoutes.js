const express = require("express");
const router = express.Router();
const defectDistributionController = require("../controllers/defectDistributionByTypeController");

// GET defect distribution by defect type for a specific project
router.get("/:projectId", defectDistributionController.getDefectDistributionByType);

module.exports = router;

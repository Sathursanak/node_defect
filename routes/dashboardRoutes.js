const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/defect-density", dashboardController.getDefectDensity);
router.get("/defect-density/:projectId", dashboardController.getDefectDensity);

module.exports = router;

const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/defect-density", dashboardController.getDefectDensity);
router.get("/defect-density/:projectId", dashboardController.getDefectDensity);
router.get("/defect-remark-ratio", dashboardController.getDefectRemarkRatio);
router.get("/defect-remark-ratio/:projectId", dashboardController.getDefectRemarkRatio);
router.get("/severity-index", dashboardController.getSeverityIndex);
router.get("/severity-index/:projectId", dashboardController.getSeverityIndex);
router.get("/severity-breakdown", dashboardController.getSeverityBreakdown);
router.get("/severity-breakdown/:projectId", dashboardController.getSeverityBreakdown);

module.exports = router;

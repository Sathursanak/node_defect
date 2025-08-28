const dashboardService = require("../services/dashboardServiceImpl");

async function getDefectDensity(req, res) {
  try {
    const projectId = req.query.projectId || req.params.projectId || null;
    const data = await dashboardService.getDefectDensity(projectId);
    res.status(200).json(data);
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function getDefectRemarkRatio(req, res) {
  try {
    const projectId = req.query.projectId || req.params.projectId || null;
    const data = await dashboardService.getDefectRemarkRatio(projectId);
    res.status(200).json(data);
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = {
  getDefectDensity,
  getDefectRemarkRatio,
};

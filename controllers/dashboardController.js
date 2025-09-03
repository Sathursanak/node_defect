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
  async getSeverityIndex(req, res) {
    try {
      const projectId = req.query.projectId || req.params.projectId || null;
      const data = await dashboardService.getSeverityIndex(projectId);
      res.status(200).json(data);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  },
  async getSeverityBreakdown(req, res) {
    try {
      const projectId = req.query.projectId || req.params.projectId || null;
      const data = await dashboardService.getSeverityBreakdown(projectId);
      res.status(200).json(data);
    } catch (error) {
      if (
        error.message.includes("not found") ||
        error.message.includes("No severity breakdown data found")
      ) {
        res.status(404).json({ message: error.message });
      } else if (error.message.includes("Project ID is required")) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  },
  async getProjectCardColor(req, res) {
    try {
      const projectId = req.query.projectId || req.params.projectId || null;
      const data = await dashboardService.getProjectCardColor(projectId);
      res.status(200).json(data);
    } catch (error) {
      if (error.message.includes("required")) {
        res.status(400).json({ message: error.message });
      } else if (error.message.includes("not found")) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  },
};

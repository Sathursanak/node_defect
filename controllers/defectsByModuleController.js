const defectsByModuleService = require("../services/defectsByModuleService");

class DefectsByModuleController {
  async getDefectsByModule(req, res) {
    try {
      const { projectId } = req.params;

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "Project ID is required"
        });
      }

      const result = await defectsByModuleService.getDefectsByModule(projectId);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error in getDefectsByModule controller:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }
}

module.exports = new DefectsByModuleController();

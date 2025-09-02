const defectDistributionRepo = require("../repository/defectDistributionByType");

class DefectDistributionByTypeService {
  async getDefectDistributionByType(projectId) {
    try {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      const result = await defectDistributionRepo.getDefectDistributionByType(projectId);
      return {
        success: true,
        data: result,
        message: "Defect distribution by type retrieved successfully"
      };
    } catch (error) {
      console.error("Error in getDefectDistributionByType service:", error);
      return {
        success: false,
        data: null,
        message: error.message || "Failed to retrieve defect distribution by type"
      };
    }
  }
}

module.exports = new DefectDistributionByTypeService();

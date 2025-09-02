const defectsByModuleRepo = require("../repository/defectsByModule");

class DefectsByModuleService {
  async getDefectsByModule(projectId) {
    try {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      const result = await defectsByModuleRepo.getDefectsByModule(projectId);
      return {
        success: true,
        data: result,
        message: "Defects by module retrieved successfully"
      };
    } catch (error) {
      console.error("Error in getDefectsByModule service:", error);
      return {
        success: false,
        data: null,
        message: error.message || "Failed to retrieve defects by module"
      };
    }
  }
}

module.exports = new DefectsByModuleService();

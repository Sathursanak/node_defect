const dashboardRepo = require("../repository/dashboardRepo");

function getDefectDensityRange(density) {
  if (density >= 0 && density <= 7) {
    return { level: "Low", color: "green" };
  } else if (density > 7 && density <= 10) {
    return { level: "Medium", color: "yellow" };
  } else {
    return { level: "High", color: "red" };
  }
}

async function getDefectDensity(projectId = null) {
  try {
    const data = await dashboardRepo.getDefectDensity();
    // With QueryTypes.SELECT, the result is already the data array

    // Filter by project ID if provided
    let filteredData = data;
    if (projectId) {
      filteredData = data.filter((project) => project.id == projectId);
      if (filteredData.length === 0) {
        throw new Error(`Project with ID ${projectId} not found`);
      }
    }

    // Round defect_density to 1 decimal place and add range info for each project
    const processedData = filteredData.map((project) => {
      const roundedDensity = Number(project.defect_density).toFixed(4);
      const range = getDefectDensityRange(roundedDensity);

      return {
        ...project,
        defect_density: Number(roundedDensity),
        density_level: range.level,
        density_color: range.color,
      };
    });

    return processedData;
  } catch (error) {
    throw new Error(`Failed to get defect density: ${error.message}`);
  }
}

module.exports = {
  getDefectDensity,
};

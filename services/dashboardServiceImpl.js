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

function getRemarkRatioRange(percent) {
  // Defect Remark Ratio: 98–100 Green(low), 90–97 Yellow(medium), <90 Red(high)
  if (percent >= 98) {
    return { level: "Low", color: "green" };
  } else if (percent >= 90) {
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

async function getDefectRemarkRatio(projectId = null) {
  try {
    const data = await dashboardRepo.getDefectRemarkRatio();

    // Filter by project ID if provided
    let filteredData = data;
    if (projectId) {
      filteredData = data.filter((project) => project.id == projectId);
      if (filteredData.length === 0) {
        throw new Error(`Project with ID ${projectId} not found`);
      }
    }

    // Convert to percentage and add level/color per thresholds
    const processedData = filteredData.map((project) => {
      const ratio = project.defect_to_remark_ratio;
      const percent = ratio == null ? null : Number((ratio * 100).toFixed(2));
      const range = percent == null ? { level: null, color: null } : getRemarkRatioRange(percent);
      return {
        ...project,
        defect_to_remark_ratio_percent: percent, // e.g., 96.55
        remark_ratio_level: range.level,         // Low | Medium | High
        remark_ratio_color: range.color,         // green | yellow | red
      };
    });

    return processedData;
  } catch (error) {
    throw new Error(`Failed to get defect remark ratio: ${error.message}`);
  }
}

module.exports = {
  getDefectDensity,
  getDefectRemarkRatio,
};

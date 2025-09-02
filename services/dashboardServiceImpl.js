const dashboardRepo = require("../repository/dashboardRepo");
const severityBreakdownRepo = require("../repository/severityBreakdown");

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
  async getSeverityIndex(projectId = null) {
    try {
      const data = await dashboardRepo.getSeverityIndex();

      let filtered = data;
      if (projectId) {
        filtered = data.filter((p) => p.id == projectId);
        if (filtered.length === 0) {
          throw new Error(`Project with ID ${projectId} not found`);
        }
      }

      const processed = filtered.map((p) => {
        const percent = p.severity_index_percent == null ? null : Number(p.severity_index_percent.toFixed(2));
        let level = null;
        let color = null;
        if (percent != null) {
          // <25 Green, 25–49 Yellow, ≥50 Red
          if (percent < 25) { level = "Green"; color = "green"; }
          else if (percent < 50) { level = "Yellow"; color = "yellow"; }
          else { level = "Red"; color = "red"; }
        }
        return {
          ...p,
          severity_index_percent: percent,
          severity_index_level: level,
          severity_index_color: color,
        };
      });

      return processed;
    } catch (error) {
      throw new Error(`Failed to get severity index: ${error.message}`);
    }
  },
  async getSeverityBreakdown(projectId = null) {
    try {
      if (!projectId) {
        throw new Error("Project ID is required for severity breakdown");
      }
      
      const data = await severityBreakdownRepo.getSeverityBreakdown(projectId);
      
      if (!data || data.length === 0) {
        throw new Error(`No severity breakdown data found for project ID ${projectId}`);
      }
      
      return data;
    } catch (error) {
      throw new Error(`Failed to get severity breakdown: ${error.message}`);
    }
  },
};

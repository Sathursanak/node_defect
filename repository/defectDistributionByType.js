const sequelize = require("../db");

// Color mapping for defect types
const getDefectTypeColor = (defectTypeName) => {
  const colorMap = {
    'UI Bug': '#FF0000',           // Red
    'Functional Bug': '#FFA500',   // Orange
    'Performance': '#FFFF00',      // Yellow
    'Security': '#0000FF',         // Blue
    'Crash': '#800000',            // Maroon
    'Data Loss': '#FF00FF',        // Magenta
    'Compatibility': '#808080',    // Gray
    'Usability': '#00FF00',        // Green
    'Installation': '#000080',     // Navy
    'Other': '#C0C0C0'            // Silver
  };
  
  return colorMap[defectTypeName] || '#808080'; // Default gray
};

const getDefectDistributionByType = async (projectId) => {
  const query = `
    SELECT
      dt.id as defect_type_id,
      dt.defect_type_name,
      COUNT(d.id) as total_defect_count,
      SUM(CASE WHEN LOWER(ds.defect_status_name) NOT IN ('duplicate','rejected') THEN 1 ELSE 0 END) as valid_defect_count
    FROM
      defect d
    INNER JOIN defect_type dt ON d.defect_type_id = dt.id
    INNER JOIN defect_status ds ON d.defect_status_id = ds.id
    WHERE
      d.project_id = ${projectId}
    GROUP BY
      dt.id, dt.defect_type_name
    ORDER BY
      valid_defect_count DESC
  `;

  const results = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });

  // Calculate total valid defects for percentage calculation
  const totalValidDefects = results.reduce((sum, row) => sum + parseInt(row.valid_defect_count), 0);

  // Transform results to include percentages and filter out types with no valid defects
  const defectDistribution = results
    .filter(row => parseInt(row.valid_defect_count) > 0) // Only include types with valid defects
    .map(row => {
      const validDefects = parseInt(row.valid_defect_count);
      const percentage = totalValidDefects > 0 ? parseFloat(((validDefects / totalValidDefects) * 100).toFixed(2)) : 0;
      
      return {
        defect_type_id: parseInt(row.defect_type_id),
        defect_type_name: row.defect_type_name,
        defect_type_color: getDefectTypeColor(row.defect_type_name),
        total_defects: parseInt(row.total_defect_count),
        valid_defects: validDefects,
        percentage: percentage
      };
    });

  return {
    total_valid_defects: parseInt(totalValidDefects),
    defect_types: defectDistribution
  };
};

module.exports = {
  getDefectDistributionByType,
};

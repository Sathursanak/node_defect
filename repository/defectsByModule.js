const sequelize = require("../db");

// Color mapping for modules - using distinct colors for better visualization
const getModuleColor = (moduleIndex) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[moduleIndex % colors.length];
};

const getDefectsByModule = async (projectId) => {
  const query = `
    SELECT
      m.id as module_id,
      m.module_id as module_code,
      m.module_name,
      COUNT(d.id) as total_defect_count,
      SUM(CASE WHEN LOWER(ds.defect_status_name) NOT IN ('duplicate','rejected') THEN 1 ELSE 0 END) as valid_defect_count
    FROM
      defect d
    INNER JOIN modules m ON d.modules_id = m.id
    INNER JOIN defect_status ds ON d.defect_status_id = ds.id
    WHERE
      d.project_id = ${projectId}
    GROUP BY
      m.id, m.module_id, m.module_name
    ORDER BY
      valid_defect_count DESC, m.module_name ASC
  `;

  const results = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });

  // Calculate total valid defects for percentage calculation
  const totalValidDefects = results.reduce((sum, row) => sum + parseInt(row.valid_defect_count || 0), 0);

  // Transform results to include percentages and filter out modules with no valid defects
  const defectsByModule = results
    .filter(row => parseInt(row.valid_defect_count || 0) > 0) // Only include modules with valid defects
    .map((row, index) => {
      const validDefects = parseInt(row.valid_defect_count || 0);
      const percentage = totalValidDefects > 0 ? parseFloat(((validDefects / totalValidDefects) * 100).toFixed(2)) : 0;
      
      return {
        module_id: parseInt(row.module_id),
        module_code: row.module_code,
        module_name: row.module_name,
        module_color: getModuleColor(index),
        total_defects: parseInt(row.total_defect_count || 0),
        valid_defects: validDefects,
        percentage: percentage
      };
    });

  return {
    total_valid_defects: parseInt(totalValidDefects),
    modules: defectsByModule
  };
};

module.exports = {
  getDefectsByModule,
};

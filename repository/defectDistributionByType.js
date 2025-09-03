const sequelize = require("../db");

// Color palette for defect types
const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const getDefectTypeColor = (index) => {
  return colors[index % colors.length];
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

  // Total valid defects
  const totalValidDefects = results.reduce(
    (sum, row) => sum + parseInt(row.valid_defect_count || 0),
    0
  );

  // Map with dynamic colors
  const defectDistribution = results
    .filter(row => parseInt(row.valid_defect_count || 0) > 0)
    .map((row, index) => {
      const validDefects = parseInt(row.valid_defect_count || 0);
      const percentage = totalValidDefects > 0 
        ? parseFloat(((validDefects / totalValidDefects) * 100).toFixed(2)) 
        : 0;

      return {
        defect_type_id: parseInt(row.defect_type_id),
        defect_type_name: row.defect_type_name,
        defect_type_color: getDefectTypeColor(index), // dynamic assignment
        total_defects: parseInt(row.total_defect_count || 0),
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

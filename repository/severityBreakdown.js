const sequelize = require("../db");

const getSeverityBreakdown = async (projectId) => {
  const query = `
    SELECT
      s.id as severity_id,
      s.severity_name,
      s.severity_color,
      s.weight,
      ds.id as defect_status_id,
      ds.defect_status_name,
      ds.color_code as status_color,
      COUNT(d.id) as defect_count
    FROM
      defect d
    INNER JOIN severity s ON d.severity_id = s.id
    INNER JOIN defect_status ds ON d.defect_status_id = ds.id
    WHERE
      d.project_id = ${projectId}
    GROUP BY
      s.id, s.severity_name, s.severity_color, s.weight,
      ds.id, ds.defect_status_name, ds.color_code
    ORDER BY
      s.id, ds.id
  `;

  const results = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });

  // Transform results to group by severity
  const severityBreakdown = {};
  
  results.forEach(row => {
    const severityId = row.severity_id;
    
    if (!severityBreakdown[severityId]) {
      severityBreakdown[severityId] = {
        severity_id: severityId,
        severity_name: row.severity_name,
        severity_color: row.severity_color,
        weight: row.weight,
        total_defects: 0,
        status_breakdown: {}
      };
    }
    
    severityBreakdown[severityId].status_breakdown[row.defect_status_id] = {
      status_id: row.defect_status_id,
      status_name: row.defect_status_name,
      status_color: row.status_color,
      count: row.defect_count
    };
    
    severityBreakdown[severityId].total_defects += row.defect_count;
  });

  return Object.values(severityBreakdown);
};

module.exports = {
  getSeverityBreakdown,
};
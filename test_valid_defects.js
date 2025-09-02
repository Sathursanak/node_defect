const sequelize = require("../db");

// Test the updated query that only considers valid defects
async function testValidDefectsOnly() {
  try {
    console.log("Testing API with only valid defects...");
    
    const projectId = 1;
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

    console.log("✅ Raw query results:");
    results.forEach((row, index) => {
      console.log(`${index + 1}. ${row.defect_type_name}: ${row.total_defect_count} total, ${row.valid_defect_count} valid`);
    });

    // Calculate total valid defects
    const totalValidDefects = results.reduce((sum, row) => sum + row.valid_defect_count, 0);
    console.log(`\n📊 Total valid defects: ${totalValidDefects}`);

    // Filter and calculate percentages
    const validTypes = results.filter(row => row.valid_defect_count > 0);
    console.log(`\n✅ Defect types with valid defects: ${validTypes.length}`);

    validTypes.forEach((row, index) => {
      const percentage = totalValidDefects > 0 ? ((row.valid_defect_count / totalValidDefects) * 100).toFixed(2) : 0;
      console.log(`${index + 1}. ${row.defect_type_name}: ${row.valid_defect_count} (${percentage}%)`);
    });

    // Check if percentages add up to 100%
    const totalPercentage = validTypes.reduce((sum, row) => {
      const percentage = totalValidDefects > 0 ? (row.valid_defect_count / totalValidDefects) * 100 : 0;
      return sum + percentage;
    }, 0);

    console.log(`\n📈 Total percentage: ${totalPercentage.toFixed(2)}%`);
    if (Math.abs(totalPercentage - 100) < 0.01) {
      console.log("✅ Percentages add up to 100%");
    } else {
      console.log("❌ Percentages don't add up to 100%");
    }

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    await sequelize.close();
  }
}

testValidDefectsOnly();

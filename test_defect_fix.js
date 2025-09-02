const sequelize = require("../db");

// Test the fixed query
async function testFixedQuery() {
  try {
    console.log("Testing fixed defect distribution query...");
    
    const projectId = 1;
    const query = `
      SELECT
        dt.id as defect_type_id,
        dt.defect_type_name,
        COUNT(d.id) as defect_count,
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

    console.log("✅ Query results:");
    console.log(`Found ${results.length} unique defect types`);
    
    results.forEach((row, index) => {
      console.log(`${index + 1}. ${row.defect_type_name} (ID: ${row.defect_type_id}): ${row.valid_defect_count} valid defects`);
    });

    // Check for duplicates
    const defectTypeIds = results.map(r => r.defect_type_id);
    const uniqueIds = new Set(defectTypeIds);
    
    if (defectTypeIds.length === uniqueIds.size) {
      console.log("✅ No duplicate defect types found");
    } else {
      console.log("❌ Duplicate defect types found!");
    }

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    await sequelize.close();
  }
}

testFixedQuery();

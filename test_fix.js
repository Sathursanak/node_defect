const sequelize = require("./db");

async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...");
    
    // Test the connection
    await sequelize.authenticate();
    console.log("✅ Database connection successful");
    
    // Test a simple query to see the actual table structure
    const [results] = await sequelize.query("DESCRIBE defect");
    console.log("✅ Defect table structure:");
    results.forEach(field => {
      console.log(`  - ${field.Field}: ${field.Type} (${field.Null === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Test if the specific fields exist
    const fields = results.map(f => f.Field);
    const requiredFields = ['defect_type_id', 'project_id', 'defect_status_id'];
    
    console.log("\n✅ Checking required fields:");
    requiredFields.forEach(field => {
      if (fields.includes(field)) {
        console.log(`  ✅ ${field} exists`);
      } else {
        console.log(`  ❌ ${field} missing`);
      }
    });
    
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
  } finally {
    await sequelize.close();
  }
}

testDatabaseConnection();

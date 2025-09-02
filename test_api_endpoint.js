const sequelize = require("../db");
const defectDistributionRepo = require("./repository/defectDistributionByType");

async function testAPIEndpoint() {
  try {
    console.log("Testing the actual API endpoint...\n");
    
    const projectId = 1;
    const result = await defectDistributionRepo.getDefectDistributionByType(projectId);
    
    console.log("API Response:");
    console.log(JSON.stringify(result, null, 2));
    
    console.log("\n📊 Analysis:");
    console.log(`Total valid defects: ${result.total_valid_defects}`);
    console.log(`Number of defect types: ${result.defect_types.length}`);
    
    console.log("\n📈 Defect Type Breakdown:");
    result.defect_types.forEach((type, index) => {
      console.log(`${index + 1}. ${type.defect_type_name}:`);
      console.log(`   - Valid defects: ${type.valid_defects}`);
      console.log(`   - Total defects: ${type.total_defects}`);
      console.log(`   - Percentage: ${type.percentage}%`);
    });
    
    // Verify percentages add up
    const totalPercentage = result.defect_types.reduce((sum, type) => sum + type.percentage, 0);
    console.log(`\n📊 Total percentage: ${totalPercentage.toFixed(2)}%`);
    
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

testAPIEndpoint();

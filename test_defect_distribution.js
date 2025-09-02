const defectDistributionService = require("./services/defectDistributionByTypeService");

async function testDefectDistribution() {
  try {
    console.log("Testing defect distribution by type API...");
    
    // Test with a sample project ID
    const projectId = 1;
    const result = await defectDistributionService.getDefectDistributionByType(projectId);
    
    console.log("Result:", JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log("✅ API test successful!");
      console.log(`Total valid defects: ${result.data.total_valid_defects}`);
      console.log(`Number of defect types: ${result.data.defect_types.length}`);
      
      result.data.defect_types.forEach(type => {
        console.log(`- ${type.defect_type_name}: ${type.valid_defects} defects (${type.percentage}%)`);
      });
    } else {
      console.log("❌ API test failed:", result.message);
    }
  } catch (error) {
    console.error("❌ Test error:", error);
  }
}

// Run the test
testDefectDistribution();

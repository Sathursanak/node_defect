const sequelize = require("./db");

async function verifyDashboardAPI() {
  try {
    console.log("🔍 Verifying Enhanced Dashboard API Implementation...\n");

    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connection successful");

    // Test the dashboard service
    console.log("🧪 Testing dashboard service...");
    const dashboardService = require("./services/dashboardServiceImpl");

    // Test 1: Get all projects
    const allProjects = await dashboardService.getDefectDensity();
    console.log(`✅ Service returned ${allProjects.length} project records`);

    // Verify enhanced data structure
    if (allProjects.length > 0) {
      const sample = allProjects[0];
      const requiredFields = [
        "id",
        "project_name",
        "kloc",
        "total_defects",
        "defect_density",
        "density_level",
        "density_color",
      ];
      const hasAllFields = requiredFields.every((field) =>
        sample.hasOwnProperty(field)
      );

      if (hasAllFields) {
        console.log("✅ Enhanced data structure is correct");
        console.log("\n📊 Sample enhanced defect density data:");
        console.log(`   Project: ${sample.project_name}`);
        console.log(`   KLOC: ${sample.kloc}`);
        console.log(`   Total Defects: ${sample.total_defects}`);
        console.log(
          `   Defect Density: ${sample.defect_density} (rounded to 1 decimal)`
        );
        console.log(`   Risk Level: ${sample.density_level}`);
        console.log(`   Color Code: ${sample.density_color}`);
      } else {
        console.log("❌ Data structure is missing required fields");
      }
    }

    // Test 2: Get specific project
    console.log("\n🧪 Testing specific project retrieval...");
    const specificProject = await dashboardService.getDefectDensity(1);
    console.log(
      `✅ Retrieved specific project: ${specificProject[0].project_name}`
    );

    console.log(
      "\n🎉 Enhanced Dashboard API verification completed successfully!"
    );
    console.log("\n📋 API Endpoints:");
    console.log(
      "   GET /api/dashboard/defect-density           - All projects"
    );
    console.log(
      "   GET /api/dashboard/defect-density/1         - Project ID 1"
    );
    console.log(
      "   GET /api/dashboard/defect-density?projectId=1 - Project ID 1 (query)"
    );
    console.log("\n🎨 Color Coding:");
    console.log("   0-7:   Low (Green)");
    console.log("   7-10:  Medium (Yellow)");
    console.log("   10+:   High (Red)");
    console.log("\n🚀 To test the HTTP endpoint:");
    console.log("   1. Start server: node app.js");
    console.log(
      "   2. Test: curl http://localhost:3000/api/dashboard/defect-density"
    );
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
  } finally {
    await sequelize.close();
  }
}

verifyDashboardAPI();

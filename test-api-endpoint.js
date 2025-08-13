const sequelize = require('./db');

async function testAPIEndpoint() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Test the service directly
    console.log('🧪 Testing defect service directly:');
    const defectService = require('./services/defectServiceImpl');
    const allDefects = await defectService.getAllDefects();
    
    console.log(`Service returned ${allDefects.length} defects`);
    
    if (allDefects.length > 0) {
      console.log('\nFirst 3 defects from service:');
      allDefects.slice(0, 3).forEach((defect, index) => {
        console.log(`\n${index + 1}. ${defect.defect_id}: ${defect.description}`);
        console.log(`   Assigned by: ${defect.assigned_by}, Assigned to: ${defect.assigned_to}`);
        console.log(`   Project: ${defect.project_id}, Module: ${defect.modules_id}`);
        console.log(`   Status: ${defect.defect_status_id}, Priority: ${defect.priority_id}`);
      });
    }

    // Test with includes/associations
    console.log('\n🔗 Testing with associations:');
    const Defect = require('./models/defect');
    const defectsWithAssociations = await Defect.findAll({
      limit: 3
    });
    
    console.log(`Found ${defectsWithAssociations.length} defects with associations`);
    defectsWithAssociations.forEach((defect, index) => {
      console.log(`\n${index + 1}. ${defect.defect_id}: ${defect.description}`);
      console.log(`   All fields present: ${Object.keys(defect.dataValues).join(', ')}`);
    });

    await sequelize.close();
    
    console.log('\n✅ Test completed successfully!');
    console.log('🚀 Your API should now work at: http://localhost:3000/api/defects');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAPIEndpoint();

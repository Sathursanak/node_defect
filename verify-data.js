const sequelize = require('./db');
const Designation = require('./models/designation');
const Priority = require('./models/priority');

async function verifyData() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Check designation data
    console.log('\n📋 Checking Designation data:');
    const designations = await Designation.findAll();
    console.log(`Found ${designations.length} designations:`);
    designations.forEach(d => {
      console.log(`  - ID: ${d.id}, Designation: ${d.designation}`);
    });

    // Check priority data
    console.log('\n🎯 Checking Priority data:');
    const priorities = await Priority.findAll();
    console.log(`Found ${priorities.length} priorities:`);
    priorities.forEach(p => {
      console.log(`  - ID: ${p.id}, Priority: ${p.priority}, Color: ${p.color}`);
    });

    console.log('\n✅ Data verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Error verifying data:', error);
  } finally {
    await sequelize.close();
  }
}

verifyData();

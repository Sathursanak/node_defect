const sequelize = require('./db');

async function testDefectAPI() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check defect table structure
    console.log('📊 Defect table structure:');
    const [columns] = await sequelize.query('DESCRIBE defect');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Check actual defect data
    console.log('\n📋 Actual defect data in database:');
    const [defects] = await sequelize.query('SELECT * FROM defect LIMIT 3');
    defects.forEach(d => {
      console.log(`\nDefect ID ${d.id}:`);
      Object.keys(d).forEach(key => {
        console.log(`  ${key}: ${d[key]}`);
      });
    });

    // Test the repository directly
    console.log('\n🧪 Testing defect repository directly:');
    const defectRepo = require('./repository/defectRepo');
    const allDefects = await defectRepo.getAll();
    console.log(`Repository returned ${allDefects.length} defects`);
    
    if (allDefects.length > 0) {
      console.log('First defect from repository:');
      console.log(JSON.stringify(allDefects[0], null, 2));
    }

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testDefectAPI();

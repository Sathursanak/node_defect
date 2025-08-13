const sequelize = require('./db');

async function checkInsertedData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Check modules
    console.log('\n📋 Checking modules data:');
    const [modules] = await sequelize.query('SELECT * FROM modules');
    modules.forEach(m => {
      console.log(`  - ID: ${m.id}, Module ID: ${m.module_id}, Name: ${m.module_name}`);
    });

    // Check other tables
    const tables = ['designation', 'priority', 'defect_status', 'defect_type', 'severity', 'role', 'release_type', 'privilege'];
    
    for (const table of tables) {
      try {
        console.log(`\n📊 Checking ${table} data:`);
        const [results] = await sequelize.query(`SELECT * FROM ${table} LIMIT 5`);
        console.log(`  Found ${results.length} records`);
        if (results.length > 0) {
          console.log(`  Sample: ${JSON.stringify(results[0], null, 2)}`);
        }
      } catch (error) {
        console.log(`  ❌ Error checking ${table}: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkInsertedData();

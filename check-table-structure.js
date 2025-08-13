const sequelize = require('./db');

async function checkTableStructure() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    const tables = ['defect_status', 'defect_type', 'severity', 'role'];
    
    for (const table of tables) {
      try {
        console.log(`\n🔍 Checking ${table} table structure:`);
        const [columns] = await sequelize.query(`DESCRIBE ${table}`);
        columns.forEach(col => {
          console.log(`  - ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}) ${col.Default ? `Default: ${col.Default}` : ''}`);
        });
      } catch (error) {
        console.log(`  ❌ Table ${table} does not exist: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkTableStructure();

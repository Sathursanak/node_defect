const sequelize = require('./db');

async function checkTables() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Get all table names
    const [results] = await sequelize.query("SHOW TABLES");
    console.log('\n📋 Available tables:');
    results.forEach(row => {
      const tableName = Object.values(row)[0];
      console.log(`  - ${tableName}`);
    });

    // Check defect_status table structure
    console.log('\n🔍 Checking defect_status table structure:');
    const [columns] = await sequelize.query("DESCRIBE defect_status");
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkTables();

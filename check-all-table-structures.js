const sequelize = require('./db');

async function checkAllTableStructures() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Get all table names
    const [results] = await sequelize.query("SHOW TABLES");
    const tableNames = results.map(row => Object.values(row)[0]);
    
    console.log(`\n📋 Found ${tableNames.length} tables in database:`);
    tableNames.forEach(table => console.log(`  - ${table}`));
    
    console.log('\n🔍 Checking table structures:\n');
    
    for (const tableName of tableNames) {
      try {
        console.log(`\n📊 Table: ${tableName}`);
        console.log('─'.repeat(50));
        
        const [columns] = await sequelize.query(`DESCRIBE ${tableName}`);
        columns.forEach(col => {
          const nullable = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
          const defaultVal = col.Default ? ` Default: ${col.Default}` : '';
          const key = col.Key ? ` (${col.Key})` : '';
          console.log(`  ${col.Field}: ${col.Type} ${nullable}${defaultVal}${key}`);
        });
        
      } catch (error) {
        console.log(`  ❌ Error checking ${tableName}: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkAllTableStructures();

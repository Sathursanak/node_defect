const sequelize = require('./db');

async function finalVerification() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Get all table names
    const [results] = await sequelize.query("SHOW TABLES");
    const tableNames = results.map(row => Object.values(row)[0])
      .filter(name => name !== 'sequelizemeta'); // Exclude migration metadata table
    
    console.log(`\n📊 Checking data in ${tableNames.length} tables:\n`);
    
    let tablesWithData = 0;
    let totalRecords = 0;
    
    for (const tableName of tableNames) {
      try {
        const [rows] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const count = rows[0].count;
        
        if (count > 0) {
          console.log(`✅ ${tableName}: ${count} records`);
          tablesWithData++;
          totalRecords += count;
        } else {
          console.log(`❌ ${tableName}: 0 records`);
        }
        
      } catch (error) {
        console.log(`⚠️  ${tableName}: Error checking - ${error.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📈 SUMMARY:`);
    console.log(`   Total tables: ${tableNames.length}`);
    console.log(`   Tables with data: ${tablesWithData}`);
    console.log(`   Tables without data: ${tableNames.length - tablesWithData}`);
    console.log(`   Total records inserted: ${totalRecords}`);
    console.log(`   Completion: ${Math.round((tablesWithData / tableNames.length) * 100)}%`);
    console.log('='.repeat(50));

    if (tablesWithData < tableNames.length) {
      console.log('\n📋 Tables still needing data:');
      for (const tableName of tableNames) {
        try {
          const [rows] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tableName}`);
          if (rows[0].count === 0) {
            console.log(`   - ${tableName}`);
          }
        } catch (error) {
          console.log(`   - ${tableName} (error checking)`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

finalVerification();

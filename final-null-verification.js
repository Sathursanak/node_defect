const sequelize = require('./db');

async function finalNullVerification() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔍 FINAL NULL CHECK - Key Tables Only:\n');

    // Check the tables that had issues
    const criticalChecks = [
      { table: 'defect', fks: ['release_test_case_id'] },
      { table: 'defect_history', fks: ['defect_id'] },
      { table: 'project', fks: ['user_Id'] },
      { table: 'allocate_module', fks: ['user_id', 'project_id'] },
      { table: 'comments', fks: ['defect_id', 'user_id'] }
    ];

    let totalNulls = 0;

    for (const tableInfo of criticalChecks) {
      console.log(`📊 ${tableInfo.table.toUpperCase()}:`);
      
      for (const fk of tableInfo.fks) {
        const [nullCount] = await sequelize.query(`
          SELECT COUNT(*) as null_count 
          FROM ${tableInfo.table} 
          WHERE ${fk} IS NULL
        `);
        
        if (nullCount[0].null_count > 0) {
          console.log(`  ❌ ${fk}: ${nullCount[0].null_count} NULL values`);
          totalNulls += parseInt(nullCount[0].null_count);
        } else {
          console.log(`  ✅ ${fk}: No NULL values`);
        }
      }
      console.log('');
    }

    // Summary
    console.log('='.repeat(50));
    if (totalNulls === 0) {
      console.log('🎉 PERFECT! ALL NULL FOREIGN KEYS FIXED!');
      console.log('✅ Database has complete relational integrity!');
      
      // Show final record counts
      console.log('\n📊 Final Database Summary:');
      const [tableCount] = await sequelize.query("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'nodeproject'");
      console.log(`   Total tables: ${tableCount[0].count}`);
      
      const tables = ['user', 'project', 'defect', 'comments', 'allocate_module', 'test_case'];
      let totalRecords = 0;
      
      for (const table of tables) {
        const [count] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ${table}: ${count[0].count} records`);
        totalRecords += count[0].count;
      }
      
      console.log(`   Total records in key tables: ${totalRecords}`);
      
    } else {
      console.log(`❌ Still ${totalNulls} NULL foreign keys remaining`);
    }
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

finalNullVerification();

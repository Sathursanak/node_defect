const sequelize = require('./db');

async function comprehensiveNullCheck() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔍 COMPREHENSIVE NULL FOREIGN KEY CHECK:\n');

    // Define all tables and their foreign key columns
    const tableChecks = [
      { table: 'allocate_module', fks: ['user_id', 'modules_id', 'sub_module_id', 'project_id'] },
      { table: 'bench', fks: ['user_id'] },
      { table: 'comments', fks: ['defect_id', 'user_id'] },
      { table: 'defect', fks: ['assigned_by', 'assigned_to', 'defect_type_id', 'defect_status_id', 'modules_id', 'priority_id', 'project_id', 'release_test_case_id', 'severity_id', 'sub_module_id'] },
      { table: 'defect_history', fks: ['defect_id'] },
      { table: 'email_user', fks: ['user_id'] },
      { table: 'group_privilege', fks: ['privilege_id', 'role_id'] },
      { table: 'modules', fks: ['project_id'] },
      { table: 'project', fks: ['user_Id'] },
      { table: 'project_allocation', fks: ['project_id', 'user_id', 'role_id'] },
      { table: 'project_allocation_history', fks: ['project_id', 'user_id', 'role_id'] },
      { table: 'project_user_privilege', fks: ['privilege_id', 'project_id', 'user_id'] },
      { table: 'release_test_case', fks: ['release_id', 'test_case_id', 'user_id'] },
      { table: 'releases', fks: ['release_type_id'] },
      { table: 'sub_module', fks: ['modules_id'] },
      { table: 'test_case', fks: ['defect_type_id', 'modules_id', 'project_id', 'severity_id', 'sub_module_id'] },
      { table: 'user', fks: ['designation_id'] },
      { table: 'user_privilege', fks: ['user_Id', 'project_id', 'privilege_id'] }
    ];

    let totalNulls = 0;
    let tablesWithNulls = 0;

    for (const tableInfo of tableChecks) {
      console.log(`📊 Checking ${tableInfo.table.toUpperCase()}:`);
      let tableHasNulls = false;

      for (const fk of tableInfo.fks) {
        try {
          const [nullCount] = await sequelize.query(`
            SELECT COUNT(*) as null_count 
            FROM ${tableInfo.table} 
            WHERE ${fk} IS NULL
          `);
          
          if (nullCount[0].null_count > 0) {
            console.log(`  ❌ ${fk}: ${nullCount[0].null_count} NULL values`);
            totalNulls += parseInt(nullCount[0].null_count);
            tableHasNulls = true;
          } else {
            console.log(`  ✅ ${fk}: No NULL values`);
          }
        } catch (error) {
          console.log(`  ⚠️  ${fk}: Error checking - ${error.message}`);
        }
      }

      if (tableHasNulls) {
        tablesWithNulls++;
      }
      console.log(''); // Empty line for readability
    }

    // Summary
    console.log('='.repeat(60));
    console.log('📈 COMPREHENSIVE NULL CHECK SUMMARY:');
    console.log(`   Total tables checked: ${tableChecks.length}`);
    console.log(`   Tables with NULL foreign keys: ${tablesWithNulls}`);
    console.log(`   Total NULL foreign key values: ${totalNulls}`);
    
    if (totalNulls === 0) {
      console.log('   🎉 PERFECT! NO NULL FOREIGN KEYS FOUND!');
      console.log('   ✅ Database has complete relational integrity!');
    } else {
      console.log('   ⚠️  Some NULL foreign keys still need to be fixed');
    }
    console.log('='.repeat(60));

    // Show sample data from key tables to verify relationships
    if (totalNulls === 0) {
      console.log('\n🔗 SAMPLE RELATIONSHIPS VERIFICATION:\n');

      // Show defects with all relationships
      console.log('🐛 DEFECTS with complete relationships:');
      const [defectSample] = await sequelize.query(`
        SELECT d.defect_id, d.description,
               u1.first_name as assigned_by, u2.first_name as assigned_to,
               dt.defect_type_name, ds.defect_status_name, 
               m.module_name, p.project_name, s.severity_name,
               rtc.release_test_case_id
        FROM defect d
        LEFT JOIN user u1 ON d.assigned_by = u1.id
        LEFT JOIN user u2 ON d.assigned_to = u2.id
        LEFT JOIN defect_type dt ON d.defect_type_id = dt.id
        LEFT JOIN defect_status ds ON d.defect_status_id = ds.id
        LEFT JOIN modules m ON d.modules_id = m.id
        LEFT JOIN project p ON d.project_id = p.id
        LEFT JOIN severity s ON d.severity_id = s.id
        LEFT JOIN release_test_case rtc ON d.release_test_case_id = rtc.id
        LIMIT 2
      `);

      defectSample.forEach(d => {
        console.log(`  ${d.defect_id}: "${d.description.substring(0, 30)}..."`);
        console.log(`    By: ${d.assigned_by} → To: ${d.assigned_to} | Project: ${d.project_name}`);
        console.log(`    Type: ${d.defect_type_name} | Status: ${d.defect_status_name} | Severity: ${d.severity_name}`);
        console.log(`    Module: ${d.module_name} | Test Case: ${d.release_test_case_id}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

comprehensiveNullCheck();

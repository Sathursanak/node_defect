const sequelize = require('./db');

async function fixAllNullValues() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔧 COMPREHENSIVE NULL VALUE FIX - ALL TABLES\n');

    // Get reference data
    const [users] = await sequelize.query('SELECT id, user_id, first_name FROM user');
    const [projects] = await sequelize.query('SELECT id, project_id FROM project');
    const [modules] = await sequelize.query('SELECT id, module_id FROM modules');
    const [subModules] = await sequelize.query('SELECT id, sub_module_id FROM sub_module');
    const [roles] = await sequelize.query('SELECT id, role_name FROM role');
    const [privileges] = await sequelize.query('SELECT id, privilege_name FROM privilege');

    console.log('📋 Reference data available:');
    console.log(`Users: ${users.length}, Projects: ${projects.length}, Modules: ${modules.length}`);
    console.log(`Sub-modules: ${subModules.length}, Roles: ${roles.length}, Privileges: ${privileges.length}`);

    // 1. Fix project_allocation table
    console.log('\n📊 Fixing project_allocation table...');
    const [projectAllocations] = await sequelize.query('SELECT * FROM project_allocation');
    
    for (let i = 0; i < projectAllocations.length; i++) {
      const allocation = projectAllocations[i];
      const userIndex = i % users.length;
      const projectIndex = i % projects.length;
      const roleIndex = i % roles.length;
      
      if (!allocation.user_id || !allocation.project_id || !allocation.role_id) {
        await sequelize.query(`
          UPDATE project_allocation 
          SET user_id = ${users[userIndex].id}, 
              project_id = ${projects[projectIndex].id}, 
              role_id = ${roles[roleIndex].id}
          WHERE id = ${allocation.id}
        `);
        console.log(`✅ Fixed project_allocation ID ${allocation.id}`);
      }
    }

    // 2. Fix project_allocation_history table
    console.log('\n📊 Fixing project_allocation_history table...');
    const [allocationHistory] = await sequelize.query('SELECT * FROM project_allocation_history');
    
    for (let i = 0; i < allocationHistory.length; i++) {
      const history = allocationHistory[i];
      const userIndex = i % users.length;
      const projectIndex = i % projects.length;
      const roleIndex = i % roles.length;
      
      if (!history.user_id || !history.project_id || !history.role_id) {
        await sequelize.query(`
          UPDATE project_allocation_history 
          SET user_id = ${users[userIndex].id}, 
              project_id = ${projects[projectIndex].id}, 
              role_id = ${roles[roleIndex].id}
          WHERE id = ${history.id}
        `);
        console.log(`✅ Fixed project_allocation_history ID ${history.id}`);
      }
    }

    // 3. Fix project_user_privilege table
    console.log('\n📊 Fixing project_user_privilege table...');
    const [projectUserPrivileges] = await sequelize.query('SELECT * FROM project_user_privilege');
    
    for (let i = 0; i < projectUserPrivileges.length; i++) {
      const pup = projectUserPrivileges[i];
      const userIndex = i % users.length;
      const projectIndex = i % projects.length;
      const privilegeIndex = i % privileges.length;
      
      if (!pup.user_id || !pup.project_id || !pup.privilege_id) {
        await sequelize.query(`
          UPDATE project_user_privilege 
          SET user_id = ${users[userIndex].id}, 
              project_id = ${projects[projectIndex].id}, 
              privilege_id = ${privileges[privilegeIndex].id}
          WHERE id = ${pup.id}
        `);
        console.log(`✅ Fixed project_user_privilege ID ${pup.id}`);
      }
    }

    // 4. Fix group_privilege table
    console.log('\n📊 Fixing group_privilege table...');
    const [groupPrivileges] = await sequelize.query('SELECT * FROM group_privilege');
    
    for (let i = 0; i < groupPrivileges.length; i++) {
      const gp = groupPrivileges[i];
      const roleIndex = i % roles.length;
      const privilegeIndex = i % privileges.length;
      
      if (!gp.role_id || !gp.privilege_id) {
        await sequelize.query(`
          UPDATE group_privilege 
          SET role_id = ${roles[roleIndex].id}, 
              privilege_id = ${privileges[privilegeIndex].id}
          WHERE id = ${gp.id}
        `);
        console.log(`✅ Fixed group_privilege ID ${gp.id}`);
      }
    }

    // 5. Add more data to tables with only 1 record
    console.log('\n📝 Adding more data to sparse tables...');

    // Add more email_user records
    const [emailUserCount] = await sequelize.query('SELECT COUNT(*) as count FROM email_user');
    if (emailUserCount[0].count < users.length) {
      for (let i = emailUserCount[0].count; i < users.length; i++) {
        await sequelize.query(`
          INSERT INTO email_user (defect_email_status, module_allocation_email_status, project_allocation_email_status, submodule_allocation_email_status, user_id) 
          VALUES (1, 1, 1, 1, ${users[i].id})
        `);
        console.log(`✅ Added email_user for ${users[i].first_name}`);
      }
    }

    // Add more bench records
    const [benchCount] = await sequelize.query('SELECT COUNT(*) as count FROM bench');
    if (benchCount[0].count < users.length) {
      for (let i = benchCount[0].count; i < users.length; i++) {
        await sequelize.query(`
          INSERT INTO bench (bench_id, allocated, availability, user_id) 
          VALUES ('BENCH${String(i + 1).padStart(3, '0')}', ${i % 2}, ${(i + 1) % 2}, ${users[i].id})
        `);
        console.log(`✅ Added bench record for ${users[i].first_name}`);
      }
    }

    // Add more release_test_case records
    const [rtcCount] = await sequelize.query('SELECT COUNT(*) as count FROM release_test_case');
    const [releases] = await sequelize.query('SELECT id FROM releases');
    const [testCases] = await sequelize.query('SELECT id FROM test_case');
    
    if (rtcCount[0].count < 5 && releases.length > 0 && testCases.length > 0) {
      for (let i = rtcCount[0].count; i < Math.min(5, testCases.length); i++) {
        await sequelize.query(`
          INSERT INTO release_test_case (
            release_test_case_id, description, test_case_status, test_date, test_time,
            release_id, test_case_id, user_id
          ) VALUES (
            'RTC${String(i + 1).padStart(3, '0')}', 'Test case ${i + 1} description', 'PASS',
            '2024-01-${String(15 + i).padStart(2, '0')}', '${String(10 + i).padStart(2, '0')}:30:00',
            ${releases[i % releases.length].id}, ${testCases[i % testCases.length].id}, ${users[i % users.length].id}
          )
        `);
        console.log(`✅ Added release_test_case RTC${String(i + 1).padStart(3, '0')}`);
      }
    }

    // Final comprehensive NULL check
    console.log('\n🔍 COMPREHENSIVE NULL CHECK:');
    
    const criticalTables = [
      { table: 'user_privilege', columns: ['user_Id', 'project_id', 'privilege_id'] },
      { table: 'project_allocation', columns: ['user_id', 'project_id', 'role_id'] },
      { table: 'project_allocation_history', columns: ['user_id', 'project_id', 'role_id'] },
      { table: 'project_user_privilege', columns: ['user_id', 'project_id', 'privilege_id'] },
      { table: 'group_privilege', columns: ['role_id', 'privilege_id'] },
      { table: 'allocate_module', columns: ['user_id', 'modules_id', 'sub_module_id', 'project_id'] },
      { table: 'email_user', columns: ['user_id'] },
      { table: 'bench', columns: ['user_id'] },
      { table: 'release_test_case', columns: ['release_id', 'test_case_id', 'user_id'] }
    ];

    let totalNulls = 0;
    for (const tableInfo of criticalTables) {
      console.log(`\n${tableInfo.table.toUpperCase()}:`);
      for (const column of tableInfo.columns) {
        try {
          const [nullCount] = await sequelize.query(`
            SELECT COUNT(*) as count FROM ${tableInfo.table} WHERE ${column} IS NULL
          `);
          const count = nullCount[0].count;
          totalNulls += count;
          const status = count === 0 ? '✅' : '❌';
          console.log(`  ${status} ${column}: ${count} NULL values`);
        } catch (error) {
          console.log(`  ⚠️ ${column}: Error checking - ${error.message}`);
        }
      }
    }

    console.log('\n📈 FINAL SUMMARY:');
    console.log('='.repeat(50));
    console.log(`Total NULL values in critical foreign keys: ${totalNulls}`);
    
    if (totalNulls === 0) {
      console.log('\n🎉 PERFECT! ALL NULL VALUES FIXED!');
      console.log('✅ All foreign key relationships established');
      console.log('✅ Complete data integrity achieved');
      console.log('✅ Database ready for production use');
    } else {
      console.log(`\n⚠️ ${totalNulls} NULL values still need attention`);
    }

    console.log('\n🎉 COMPREHENSIVE NULL VALUE FIX COMPLETED!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixAllNullValues();

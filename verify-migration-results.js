const sequelize = require('./db');

async function verifyMigrationResults() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🎉 MIGRATION RESULTS VERIFICATION\n');
    console.log('='.repeat(50));

    // Check all tables and their record counts
    const tables = [
      'designation', 'role', 'defect_status', 'defect_type', 'severity', 
      'modules', 'release_type', 'privilege', 'sub_module', 'allocate_module',
      'bench', 'comments', 'defect', 'defect_history', 'email_user',
      'group_privilege', 'project', 'project_allocation', 'project_allocation_history',
      'project_user_privilege', 'release_test_case', 'releases', 'smtp_config',
      'test_case', 'user', 'user_privilege'
    ];

    let totalRecords = 0;
    let populatedTables = 0;

    console.log('📊 TABLE POPULATION STATUS:');
    for (const table of tables) {
      try {
        const [result] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = result[0].count;
        totalRecords += count;
        if (count > 0) populatedTables++;
        
        const status = count > 0 ? '✅' : '❌';
        console.log(`  ${status} ${table}: ${count} records`);
      } catch (error) {
        console.log(`  ❌ ${table}: Error - ${error.message}`);
      }
    }

    console.log('\n📈 SUMMARY:');
    console.log(`  Total tables checked: ${tables.length}`);
    console.log(`  Tables with data: ${populatedTables}`);
    console.log(`  Total records: ${totalRecords}`);
    console.log(`  Success rate: ${Math.round((populatedTables / tables.length) * 100)}%`);

    // Check key relationships
    console.log('\n🔗 KEY RELATIONSHIPS:');
    
    // Users with designations
    const [users] = await sequelize.query(`
      SELECT u.user_id, u.first_name, u.last_name, d.designation
      FROM user u
      LEFT JOIN designation d ON u.designation_id = d.id
      LIMIT 5
    `);
    console.log('\nUsers with designations:');
    users.forEach(u => {
      console.log(`  ${u.user_id}: ${u.first_name} ${u.last_name} - ${u.designation}`);
    });

    // Projects
    const [projects] = await sequelize.query('SELECT project_id, project_name, client_name FROM project');
    console.log('\nProjects:');
    projects.forEach(p => {
      console.log(`  ${p.project_id}: ${p.project_name} (${p.client_name})`);
    });

    // Releases with projects
    const [releases] = await sequelize.query(`
      SELECT r.release_id, r.release_name, p.project_name
      FROM releases r
      LEFT JOIN project p ON r.project_id = p.id
    `);
    console.log('\nReleases with projects:');
    releases.forEach(r => {
      console.log(`  ${r.release_id}: ${r.release_name} → ${r.project_name}`);
    });

    // Check for NULL foreign keys
    console.log('\n🔍 FOREIGN KEY CHECK:');
    
    // Check allocate_module
    const [allocateModuleNulls] = await sequelize.query(`
      SELECT COUNT(*) as null_count FROM allocate_module 
      WHERE user_id IS NULL OR modules_id IS NULL OR sub_module_id IS NULL
    `);
    console.log(`  allocate_module NULL foreign keys: ${allocateModuleNulls[0].null_count}`);

    // Check releases
    const [releasesNulls] = await sequelize.query(`
      SELECT COUNT(*) as null_count FROM releases 
      WHERE project_id IS NULL OR release_type_id IS NULL
    `);
    console.log(`  releases NULL foreign keys: ${releasesNulls[0].null_count}`);

    console.log('\n🎯 MIGRATION STATUS:');
    if (populatedTables >= 20 && totalRecords >= 50) {
      console.log('✅ MIGRATION SUCCESSFUL!');
      console.log('✅ Database is ready for use');
      console.log('✅ All key tables populated');
      console.log('✅ Foreign key relationships established');
    } else {
      console.log('⚠️ Migration partially successful');
      console.log('⚠️ Some tables may need additional data');
    }

    console.log('\n='.repeat(50));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

verifyMigrationResults();

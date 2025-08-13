const sequelize = require('./db');

async function expandAllTables() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Get current IDs for foreign keys
    const [users] = await sequelize.query('SELECT id, user_id FROM user');
    const [projects] = await sequelize.query('SELECT id, project_id FROM project');
    const [modules] = await sequelize.query('SELECT id, module_id FROM modules');
    
    console.log('📊 Current counts:');
    console.log(`Users: ${users.length}, Projects: ${projects.length}, Modules: ${modules.length}`);

    // 1. Add more users
    console.log('\n👥 Adding more users...');
    const newUsers = [
      { user_id: 'USR004', first_name: 'Alice', last_name: 'Johnson', email: 'alice.johnson@company.com', designation_id: 4 },
      { user_id: 'USR005', first_name: 'Bob', last_name: 'Wilson', email: 'bob.wilson@company.com', designation_id: 5 },
      { user_id: 'USR006', first_name: 'Carol', last_name: 'Davis', email: 'carol.davis@company.com', designation_id: 6 },
      { user_id: 'USR007', first_name: 'David', last_name: 'Miller', email: 'david.miller@company.com', designation_id: 7 },
      { user_id: 'USR008', first_name: 'Eva', last_name: 'Garcia', email: 'eva.garcia@company.com', designation_id: 8 }
    ];

    for (const user of newUsers) {
      try {
        await sequelize.query(`
          INSERT INTO user (user_id, first_name, last_name, email, password, phone_no, user_gender, user_status, join_date, designation_id) 
          VALUES ('${user.user_id}', '${user.first_name}', '${user.last_name}', '${user.email}', 'hashedpass123', '555000000${user.user_id.slice(-1)}', 'Male', 'Active', '2024-01-01', ${user.designation_id})
        `);
        console.log(`✅ Added user: ${user.user_id} - ${user.first_name} ${user.last_name}`);
      } catch (error) {
        console.log(`❌ Error adding user ${user.user_id}: ${error.message}`);
      }
    }

    // 2. Add more modules for new projects
    console.log('\n📦 Adding modules for new projects...');
    const newModules = [
      { module_id: 'MOD006', module_name: 'Ticket Management', project_id: projects[2].id },
      { module_id: 'MOD007', module_name: 'Knowledge Base', project_id: projects[2].id },
      { module_id: 'MOD008', module_name: 'Data Visualization', project_id: projects[3].id },
      { module_id: 'MOD009', module_name: 'Report Generation', project_id: projects[3].id },
      { module_id: 'MOD010', module_name: 'Patient Records', project_id: projects[4].id },
      { module_id: 'MOD011', module_name: 'Appointment Scheduling', project_id: projects[4].id },
      { module_id: 'MOD012', module_name: 'Inventory Tracking', project_id: projects[5].id },
      { module_id: 'MOD013', module_name: 'Course Management', project_id: projects[6].id },
      { module_id: 'MOD014', module_name: 'Video Streaming', project_id: projects[6].id }
    ];

    for (const module of newModules) {
      try {
        await sequelize.query(`
          INSERT INTO modules (module_id, module_name, project_id) 
          VALUES ('${module.module_id}', '${module.module_name}', ${module.project_id})
        `);
        console.log(`✅ Added module: ${module.module_id} - ${module.module_name}`);
      } catch (error) {
        console.log(`❌ Error adding module ${module.module_id}: ${error.message}`);
      }
    }

    // 3. Add more sub-modules
    console.log('\n📋 Adding more sub-modules...');
    const [allModules] = await sequelize.query('SELECT id, module_id FROM modules WHERE id > 5');
    const newSubModules = [
      { sub_module_id: 'SUB006', sub_module_name: 'Ticket Creation', modules_id: allModules[0]?.id || 6 },
      { sub_module_id: 'SUB007', sub_module_name: 'Ticket Assignment', modules_id: allModules[0]?.id || 6 },
      { sub_module_id: 'SUB008', sub_module_name: 'Article Management', modules_id: allModules[1]?.id || 7 },
      { sub_module_id: 'SUB009', sub_module_name: 'Chart Generation', modules_id: allModules[2]?.id || 8 },
      { sub_module_id: 'SUB010', sub_module_name: 'Patient Registration', modules_id: allModules[4]?.id || 10 }
    ];

    for (const subModule of newSubModules) {
      try {
        await sequelize.query(`
          INSERT INTO sub_module (sub_module_id, sub_module_name, modules_id) 
          VALUES ('${subModule.sub_module_id}', '${subModule.sub_module_name}', ${subModule.modules_id})
        `);
        console.log(`✅ Added sub-module: ${subModule.sub_module_id} - ${subModule.sub_module_name}`);
      } catch (error) {
        console.log(`❌ Error adding sub-module ${subModule.sub_module_id}: ${error.message}`);
      }
    }

    // 4. Add more test cases
    console.log('\n🧪 Adding more test cases...');
    const [updatedModules] = await sequelize.query('SELECT id FROM modules LIMIT 10');
    const [updatedProjects] = await sequelize.query('SELECT id FROM project LIMIT 7');
    const [subModules] = await sequelize.query('SELECT id FROM sub_module LIMIT 10');

    const newTestCases = [
      { test_case_id: 'TC003', description: 'User profile update functionality', modules_id: updatedModules[0].id, project_id: updatedProjects[0].id, sub_module_id: subModules[0].id },
      { test_case_id: 'TC004', description: 'Password strength validation', modules_id: updatedModules[1].id, project_id: updatedProjects[1].id, sub_module_id: subModules[1].id },
      { test_case_id: 'TC005', description: 'Data export functionality', modules_id: updatedModules[2].id, project_id: updatedProjects[2].id, sub_module_id: subModules[2].id },
      { test_case_id: 'TC006', description: 'Mobile responsiveness test', modules_id: updatedModules[3].id, project_id: updatedProjects[3].id, sub_module_id: subModules[3].id },
      { test_case_id: 'TC007', description: 'API endpoint validation', modules_id: updatedModules[4].id, project_id: updatedProjects[4].id, sub_module_id: subModules[4].id }
    ];

    for (const testCase of newTestCases) {
      try {
        await sequelize.query(`
          INSERT INTO test_case (test_case_id, description, steps, defect_type_id, modules_id, project_id, severity_id, sub_module_id) 
          VALUES ('${testCase.test_case_id}', '${testCase.description}', 'Test steps for ${testCase.description}', 1, ${testCase.modules_id}, ${testCase.project_id}, 2, ${testCase.sub_module_id})
        `);
        console.log(`✅ Added test case: ${testCase.test_case_id} - ${testCase.description}`);
      } catch (error) {
        console.log(`❌ Error adding test case ${testCase.test_case_id}: ${error.message}`);
      }
    }

    // 5. Add more releases
    console.log('\n🚀 Adding more releases...');
    const newReleases = [
      { release_id: 'REL004', release_name: 'Version 2.0', releasedate: '2024-09-01', status: 1, release_type_id: 1 },
      { release_id: 'REL005', release_name: 'Version 2.1', releasedate: '2024-10-15', status: 0, release_type_id: 2 },
      { release_id: 'REL006', release_name: 'Hotfix 2.0.1', releasedate: '2024-09-10', status: 1, release_type_id: 4 }
    ];

    for (const release of newReleases) {
      try {
        await sequelize.query(`
          INSERT INTO releases (release_id, release_name, releasedate, status, releases_id, release_type_id) 
          VALUES ('${release.release_id}', '${release.release_name}', '${release.releasedate}', ${release.status}, NULL, ${release.release_type_id})
        `);
        console.log(`✅ Added release: ${release.release_id} - ${release.release_name}`);
      } catch (error) {
        console.log(`❌ Error adding release ${release.release_id}: ${error.message}`);
      }
    }

    // Final summary
    console.log('\n📊 Final counts after expansion:');
    const tables = ['user', 'project', 'modules', 'sub_module', 'test_case', 'releases', 'defect'];
    for (const table of tables) {
      const [count] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table}: ${count[0].count} records`);
    }

    console.log('\n🎉 Successfully expanded all tables with more data!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

expandAllTables();

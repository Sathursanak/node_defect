const sequelize = require('./db');

async function addRemainingData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Get current IDs
    const [users] = await sequelize.query('SELECT id, user_id FROM user');
    const [projects] = await sequelize.query('SELECT id, project_id FROM project');
    const [modules] = await sequelize.query('SELECT id, module_id FROM modules');
    
    console.log('📊 Current counts:');
    console.log(`Users: ${users.length}, Projects: ${projects.length}, Modules: ${modules.length}`);

    // 1. Add modules with createdAt and updatedAt
    console.log('\n📦 Adding modules with timestamps...');
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
          INSERT INTO modules (module_id, module_name, project_id, createdAt, updatedAt) 
          VALUES ('${module.module_id}', '${module.module_name}', ${module.project_id}, NOW(), NOW())
        `);
        console.log(`✅ Added module: ${module.module_id} - ${module.module_name}`);
      } catch (error) {
        console.log(`❌ Error adding module ${module.module_id}: ${error.message}`);
      }
    }

    // 2. Add more sub-modules with correct module IDs
    console.log('\n📋 Adding more sub-modules...');
    const [allModules] = await sequelize.query('SELECT id, module_id FROM modules ORDER BY id');
    const newSubModules = [
      { sub_module_id: 'SUB006', sub_module_name: 'Ticket Creation', modules_id: allModules[5]?.id || 6 },
      { sub_module_id: 'SUB007', sub_module_name: 'Ticket Assignment', modules_id: allModules[5]?.id || 6 },
      { sub_module_id: 'SUB008', sub_module_name: 'Article Management', modules_id: allModules[6]?.id || 7 },
      { sub_module_id: 'SUB009', sub_module_name: 'Chart Generation', modules_id: allModules[7]?.id || 8 },
      { sub_module_id: 'SUB010', sub_module_name: 'Patient Registration', modules_id: allModules[9]?.id || 10 }
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

    // 3. Add more project allocations
    console.log('\n📊 Adding more project allocations...');
    const newAllocations = [
      { project_id: projects[2].id, user_id: users[3].id, role_id: 4, allocation_percentage: 75 },
      { project_id: projects[3].id, user_id: users[4].id, role_id: 2, allocation_percentage: 100 },
      { project_id: projects[4].id, user_id: users[5].id, role_id: 5, allocation_percentage: 80 },
      { project_id: projects[5].id, user_id: users[6].id, role_id: 4, allocation_percentage: 90 },
      { project_id: projects[6].id, user_id: users[7].id, role_id: 3, allocation_percentage: 85 }
    ];

    for (const allocation of newAllocations) {
      try {
        await sequelize.query(`
          INSERT INTO project_allocation (allocation_percentage, start_date, end_date, project_id, user_id, role_id) 
          VALUES (${allocation.allocation_percentage}, '2024-01-01', '2024-12-31', ${allocation.project_id}, ${allocation.user_id}, ${allocation.role_id})
        `);
        console.log(`✅ Added allocation: User ${allocation.user_id} → Project ${allocation.project_id} (${allocation.allocation_percentage}%)`);
      } catch (error) {
        console.log(`❌ Error adding allocation: ${error.message}`);
      }
    }

    // 4. Add more comments
    console.log('\n💬 Adding more comments...');
    const [defects] = await sequelize.query('SELECT id, defect_id FROM defect LIMIT 10');
    const newComments = [
      { comment: 'This issue is blocking the release', defect_id: defects[4]?.id || 5, user_id: users[3].id },
      { comment: 'Workaround implemented temporarily', defect_id: defects[5]?.id || 6, user_id: users[4].id },
      { comment: 'Root cause identified in authentication module', defect_id: defects[6]?.id || 7, user_id: users[5].id },
      { comment: 'Testing completed successfully', defect_id: defects[7]?.id || 8, user_id: users[6].id },
      { comment: 'Documentation updated with fix details', defect_id: defects[8]?.id || 9, user_id: users[7].id }
    ];

    for (const comment of newComments) {
      try {
        await sequelize.query(`
          INSERT INTO comments (comment, attachment, defect_id, user_id) 
          VALUES ('${comment.comment}', NULL, ${comment.defect_id}, ${comment.user_id})
        `);
        console.log(`✅ Added comment for defect ${comment.defect_id}`);
      } catch (error) {
        console.log(`❌ Error adding comment: ${error.message}`);
      }
    }

    // 5. Add more bench records
    console.log('\n🪑 Adding more bench records...');
    const newBenchRecords = [
      { bench_id: 'BENCH006', allocated: 0, availability: 1, user_id: users[3].id },
      { bench_id: 'BENCH007', allocated: 1, availability: 0, user_id: users[4].id },
      { bench_id: 'BENCH008', allocated: 0, availability: 1, user_id: users[5].id },
      { bench_id: 'BENCH009', allocated: 1, availability: 0, user_id: users[6].id },
      { bench_id: 'BENCH010', allocated: 0, availability: 1, user_id: users[7].id }
    ];

    for (const bench of newBenchRecords) {
      try {
        await sequelize.query(`
          INSERT INTO bench (bench_id, allocated, availability, user_id) 
          VALUES ('${bench.bench_id}', ${bench.allocated}, ${bench.availability}, ${bench.user_id})
        `);
        console.log(`✅ Added bench: ${bench.bench_id} for user ${bench.user_id}`);
      } catch (error) {
        console.log(`❌ Error adding bench: ${error.message}`);
      }
    }

    // 6. Add more email_user records
    console.log('\n📧 Adding more email_user records...');
    const newEmailUsers = [
      { user_id: users[3].id, defect_email_status: 1, module_allocation_email_status: 0, project_allocation_email_status: 1, submodule_allocation_email_status: 0 },
      { user_id: users[4].id, defect_email_status: 0, module_allocation_email_status: 1, project_allocation_email_status: 0, submodule_allocation_email_status: 1 },
      { user_id: users[5].id, defect_email_status: 1, module_allocation_email_status: 1, project_allocation_email_status: 1, submodule_allocation_email_status: 1 }
    ];

    for (const emailUser of newEmailUsers) {
      try {
        await sequelize.query(`
          INSERT INTO email_user (defect_email_status, module_allocation_email_status, project_allocation_email_status, submodule_allocation_email_status, user_id) 
          VALUES (${emailUser.defect_email_status}, ${emailUser.module_allocation_email_status}, ${emailUser.project_allocation_email_status}, ${emailUser.submodule_allocation_email_status}, ${emailUser.user_id})
        `);
        console.log(`✅ Added email settings for user ${emailUser.user_id}`);
      } catch (error) {
        console.log(`❌ Error adding email_user: ${error.message}`);
      }
    }

    // Final summary
    console.log('\n📊 FINAL DATABASE SUMMARY:');
    const tables = ['user', 'project', 'modules', 'sub_module', 'test_case', 'releases', 'defect', 'comments', 'bench', 'email_user', 'project_allocation'];
    for (const table of tables) {
      const [count] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table}: ${count[0].count} records`);
    }

    console.log('\n🎉 Successfully expanded database with comprehensive data!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addRemainingData();

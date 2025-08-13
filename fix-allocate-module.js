const sequelize = require('./db');

async function fixAllocateModule() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check current allocate_module data
    console.log('📊 Current allocate_module data:');
    const [allocateModule] = await sequelize.query('SELECT * FROM allocate_module');
    allocateModule.forEach(am => {
      console.log(`  ID: ${am.id}, user_id: ${am.user_id}, modules_id: ${am.modules_id}, sub_module_id: ${am.sub_module_id}, project_id: ${am.project_id}`);
    });

    // Get available IDs
    const [users] = await sequelize.query('SELECT id, user_id FROM user');
    const [projects] = await sequelize.query('SELECT id, project_id FROM project');
    
    console.log('\nAvailable users:', users.map(u => `${u.id}(${u.user_id})`));
    console.log('Available projects:', projects.map(p => `${p.id}(${p.project_id})`));

    // Fix each record individually
    console.log('\n🔧 Fixing allocate_module records...');
    
    for (let i = 0; i < allocateModule.length; i++) {
      const record = allocateModule[i];
      const userIndex = i % users.length;
      const projectIndex = i % projects.length;
      
      try {
        await sequelize.query(`
          UPDATE allocate_module 
          SET user_id = ${users[userIndex].id}, project_id = ${projects[projectIndex].id}
          WHERE id = ${record.id}
        `);
        console.log(`✅ Updated record ${record.id}: user_id = ${users[userIndex].id}, project_id = ${projects[projectIndex].id}`);
      } catch (error) {
        console.log(`❌ Error updating record ${record.id}: ${error.message}`);
      }
    }

    // Final verification
    console.log('\n📊 Final allocate_module verification:');
    const [finalAllocateModule] = await sequelize.query('SELECT * FROM allocate_module');
    finalAllocateModule.forEach(am => {
      console.log(`  ID: ${am.id}, user_id: ${am.user_id}, modules_id: ${am.modules_id}, sub_module_id: ${am.sub_module_id}, project_id: ${am.project_id}`);
    });

    const [nullCheck] = await sequelize.query('SELECT COUNT(*) as null_count FROM allocate_module WHERE user_id IS NULL OR project_id IS NULL');
    console.log(`\nNULL foreign keys remaining: ${nullCheck[0].null_count}`);

    if (nullCheck[0].null_count === 0) {
      console.log('\n✅ All allocate_module foreign keys fixed!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixAllocateModule();

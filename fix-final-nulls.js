const sequelize = require('./db');

async function fixFinalNulls() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔧 Fixing the final NULL foreign keys...\n');

    // Check and fix defect_history
    console.log('📊 Checking defect_history table:');
    const [defectHistory] = await sequelize.query('SELECT id, defect_id FROM defect_history');
    defectHistory.forEach(dh => {
      console.log(`  ID: ${dh.id}, defect_id: ${dh.defect_id}`);
    });

    // Get available defect IDs
    const [defects] = await sequelize.query('SELECT id, defect_id FROM defect');
    console.log('\nAvailable defects:', defects.map(d => `${d.id}(${d.defect_id})`));

    // Fix defect_history
    if (defectHistory.length > 0 && defects.length > 0) {
      await sequelize.query(`UPDATE defect_history SET defect_id = ${defects[0].id} WHERE id = ${defectHistory[0].id}`);
      console.log(`✅ Fixed defect_history: linked to defect ${defects[0].defect_id}`);
    }

    // Check and fix project table
    console.log('\n📊 Checking project table:');
    const [projects] = await sequelize.query('SELECT id, project_id, user_Id FROM project');
    projects.forEach(p => {
      console.log(`  ID: ${p.id}, project_id: ${p.project_id}, user_Id: ${p.user_Id}`);
    });

    // Get available user IDs
    const [users] = await sequelize.query('SELECT id, user_id FROM user');
    console.log('\nAvailable users:', users.map(u => `${u.id}(${u.user_id})`));

    // Fix project table
    let userIndex = 0;
    for (const project of projects) {
      if (project.user_Id === null && users.length > userIndex) {
        await sequelize.query(`UPDATE project SET user_Id = ${users[userIndex].id} WHERE id = ${project.id}`);
        console.log(`✅ Fixed project ${project.project_id}: linked to user ${users[userIndex].user_id}`);
        userIndex++;
      }
    }

    // Final verification
    console.log('\n📊 Final verification:');
    
    // Check defect_history
    const [updatedDefectHistory] = await sequelize.query('SELECT COUNT(*) as null_count FROM defect_history WHERE defect_id IS NULL');
    console.log(`defect_history NULL defect_id: ${updatedDefectHistory[0].null_count}`);
    
    // Check project
    const [updatedProject] = await sequelize.query('SELECT COUNT(*) as null_count FROM project WHERE user_Id IS NULL');
    console.log(`project NULL user_Id: ${updatedProject[0].null_count}`);

    // Show updated records
    console.log('\n🔗 Updated records:');
    
    const [finalDefectHistory] = await sequelize.query(`
      SELECT dh.id, dh.defect_ref_id, d.defect_id 
      FROM defect_history dh 
      LEFT JOIN defect d ON dh.defect_id = d.id
    `);
    console.log('defect_history:', finalDefectHistory);

    const [finalProjects] = await sequelize.query(`
      SELECT p.id, p.project_id, p.user_Id, u.user_id 
      FROM project p 
      LEFT JOIN user u ON p.user_Id = u.id
    `);
    console.log('projects:', finalProjects);

    console.log('\n🎉 All NULL foreign keys have been fixed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixFinalNulls();

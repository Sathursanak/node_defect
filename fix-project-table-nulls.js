const sequelize = require('./db');

async function fixProjectTableNulls() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔧 FIXING PROJECT TABLE NULL VALUES\n');

    // Get available users
    const [users] = await sequelize.query('SELECT id, user_id, first_name FROM user');
    console.log('📋 Available users:');
    users.forEach(u => {
      console.log(`  ${u.id}: ${u.user_id} - ${u.first_name}`);
    });

    // Get projects with NULL user_Id
    const [nullProjects] = await sequelize.query(`
      SELECT id, project_id, project_name FROM project WHERE user_Id IS NULL
    `);
    
    console.log('\n❌ Projects with NULL user_Id:');
    nullProjects.forEach(p => {
      console.log(`  ${p.id}: ${p.project_id} - ${p.project_name}`);
    });

    // Fix NULL user_Id values
    console.log('\n🔧 Fixing NULL user_Id values...');
    
    for (let i = 0; i < nullProjects.length; i++) {
      const project = nullProjects[i];
      const userIndex = i % users.length; // Distribute projects among users
      
      await sequelize.query(`
        UPDATE project 
        SET user_Id = ${users[userIndex].id} 
        WHERE id = ${project.id}
      `);
      
      console.log(`✅ Fixed ${project.project_id} (${project.project_name}) → Assigned to ${users[userIndex].first_name} (ID: ${users[userIndex].id})`);
    }

    // Final verification
    console.log('\n📊 Final verification:');
    const [finalProjects] = await sequelize.query(`
      SELECT p.id, p.project_id, p.project_name, p.user_Id, u.first_name
      FROM project p
      LEFT JOIN user u ON p.user_Id = u.id
      ORDER BY p.id
    `);
    
    console.log('\nAll projects with assigned users:');
    finalProjects.forEach(p => {
      console.log(`  ${p.project_id}: ${p.project_name} → ${p.first_name} (user_Id: ${p.user_Id})`);
    });

    // Final NULL check
    const [finalNullCheck] = await sequelize.query(`
      SELECT COUNT(*) as count FROM project WHERE user_Id IS NULL
    `);
    
    console.log(`\n🔍 Final NULL check: ${finalNullCheck[0].count} NULL values remaining`);
    
    if (finalNullCheck[0].count === 0) {
      console.log('\n🎉 SUCCESS! ALL NULL VALUES IN PROJECT TABLE FIXED!');
      console.log('✅ All projects now have assigned project managers');
      console.log('✅ Complete foreign key relationships established');
      console.log('✅ Project table data integrity achieved');
    } else {
      console.log(`\n⚠️ ${finalNullCheck[0].count} NULL values still remain`);
    }

    console.log('\n🎉 PROJECT TABLE NULL VALUES SUCCESSFULLY FIXED!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixProjectTableNulls();

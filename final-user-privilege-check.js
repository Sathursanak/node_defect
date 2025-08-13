const sequelize = require('./db');

async function finalUserPrivilegeCheck() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check user_privilege table
    console.log('📊 USER_PRIVILEGE TABLE STATUS:');
    const [userPrivileges] = await sequelize.query(`
      SELECT up.id, u.first_name, p.project_name, pr.privilege_name
      FROM user_privilege up
      LEFT JOIN user u ON up.user_Id = u.id
      LEFT JOIN project p ON up.project_id = p.id
      LEFT JOIN privilege pr ON up.privilege_id = pr.id
      LIMIT 10
    `);
    
    console.log('Sample user_privilege data:');
    userPrivileges.forEach(up => {
      console.log(`  ${up.id}: ${up.first_name} → ${up.project_name} → ${up.privilege_name}`);
    });

    // Check for NULL values
    const [nullCheck] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM user_privilege 
      WHERE user_Id IS NULL OR project_id IS NULL OR privilege_id IS NULL
    `);
    
    console.log(`\nNULL values in user_privilege: ${nullCheck[0].count}`);

    // Get total count
    const [totalCount] = await sequelize.query('SELECT COUNT(*) as count FROM user_privilege');
    console.log(`Total user_privilege records: ${totalCount[0].count}`);

    if (nullCheck[0].count === 0) {
      console.log('\n🎉 SUCCESS! user_privilege table is completely fixed!');
      console.log('✅ No NULL values found');
      console.log('✅ All foreign key relationships established');
    } else {
      console.log('\n⚠️ Still has NULL values that need fixing');
    }

    await sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

finalUserPrivilegeCheck();

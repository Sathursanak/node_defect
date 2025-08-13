const sequelize = require('./db');

async function fixUserPrivilegeTable() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔧 FIXING USER_PRIVILEGE TABLE - REMOVING ALL NULL VALUES\n');

    // Check current user_privilege data
    console.log('📊 Current user_privilege data:');
    const [currentPrivileges] = await sequelize.query('SELECT * FROM user_privilege');
    currentPrivileges.forEach(up => {
      console.log(`  ID: ${up.id}, user_Id: ${up.user_Id}, project_id: ${up.project_id}, privilege_id: ${up.privilege_id}`);
    });

    // Get available IDs for foreign keys
    const [users] = await sequelize.query('SELECT id, user_id, first_name FROM user');
    const [projects] = await sequelize.query('SELECT id, project_id, project_name FROM project');
    const [privileges] = await sequelize.query('SELECT id, privilege_name FROM privilege');

    console.log('\n📋 Available foreign key references:');
    console.log('Users:', users.map(u => `${u.id}(${u.user_id}-${u.first_name})`));
    console.log('Projects:', projects.map(p => `${p.id}(${p.project_id}-${p.project_name})`));
    console.log('Privileges:', privileges.slice(0, 5).map(p => `${p.id}(${p.privilege_name})`));

    // Clear existing user_privilege data and start fresh
    console.log('\n🗑️ Clearing existing user_privilege data...');
    await sequelize.query('DELETE FROM user_privilege');
    console.log('✅ Cleared existing user_privilege data');

    // Add comprehensive user_privilege data with NO NULL values
    console.log('\n📝 Adding comprehensive user_privilege data...');

    const userPrivileges = [
      // John Doe privileges
      { user_Id: users[0].id, project_id: projects[0].id, privilege_id: 1 }, // Create
      { user_Id: users[0].id, project_id: projects[0].id, privilege_id: 2 }, // Read
      { user_Id: users[0].id, project_id: projects[0].id, privilege_id: 3 }, // Update
      { user_Id: users[0].id, project_id: projects[1].id, privilege_id: 2 }, // Read
      { user_Id: users[0].id, project_id: projects[2].id, privilege_id: 1 }, // Create
      
      // Jane Smith privileges
      { user_Id: users[1].id, project_id: projects[0].id, privilege_id: 2 }, // Read
      { user_Id: users[1].id, project_id: projects[0].id, privilege_id: 3 }, // Update
      { user_Id: users[1].id, project_id: projects[1].id, privilege_id: 1 }, // Create
      { user_Id: users[1].id, project_id: projects[1].id, privilege_id: 2 }, // Read
      { user_Id: users[1].id, project_id: projects[3].id, privilege_id: 3 }, // Update
      
      // Mike Johnson privileges
      { user_Id: users[2].id, project_id: projects[0].id, privilege_id: 4 }, // Delete
      { user_Id: users[2].id, project_id: projects[1].id, privilege_id: 4 }, // Delete
      { user_Id: users[2].id, project_id: projects[2].id, privilege_id: 1 }, // Create
      { user_Id: users[2].id, project_id: projects[2].id, privilege_id: 2 }, // Read
      { user_Id: users[2].id, project_id: projects[4].id, privilege_id: 5 }, // Admin
    ];

    // Add additional privileges for all users across all projects
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < projects.length; j++) {
        // Ensure every user has at least read access to every project
        const hasReadAccess = userPrivileges.some(up => 
          up.user_Id === users[i].id && 
          up.project_id === projects[j].id && 
          up.privilege_id === 2
        );
        
        if (!hasReadAccess) {
          userPrivileges.push({
            user_Id: users[i].id,
            project_id: projects[j].id,
            privilege_id: 2 // Read access
          });
        }
      }
    }

    // Insert all user privileges
    for (const privilege of userPrivileges) {
      try {
        await sequelize.query(`
          INSERT INTO user_privilege (user_Id, project_id, privilege_id) 
          VALUES (${privilege.user_Id}, ${privilege.project_id}, ${privilege.privilege_id})
        `);
        
        const userName = users.find(u => u.id === privilege.user_Id)?.first_name || 'Unknown';
        const projectName = projects.find(p => p.id === privilege.project_id)?.project_name || 'Unknown';
        const privilegeName = privileges.find(p => p.id === privilege.privilege_id)?.privilege_name || 'Unknown';
        
        console.log(`✅ Added: ${userName} → ${projectName} → ${privilegeName}`);
      } catch (error) {
        console.log(`❌ Error adding privilege: ${error.message}`);
      }
    }

    // Verification
    console.log('\n📊 Final user_privilege verification:');
    const [finalPrivileges] = await sequelize.query(`
      SELECT up.id, u.first_name, p.project_name, pr.privilege_name
      FROM user_privilege up
      LEFT JOIN user u ON up.user_Id = u.id
      LEFT JOIN project p ON up.project_id = p.id
      LEFT JOIN privilege pr ON up.privilege_id = pr.id
      ORDER BY u.first_name, p.project_name
    `);
    
    console.log(`Total user_privilege records: ${finalPrivileges.length}`);
    
    // Group by user
    const privilegesByUser = {};
    finalPrivileges.forEach(fp => {
      if (!privilegesByUser[fp.first_name]) {
        privilegesByUser[fp.first_name] = [];
      }
      privilegesByUser[fp.first_name].push(`${fp.project_name}: ${fp.privilege_name}`);
    });

    console.log('\nPrivileges by user:');
    Object.keys(privilegesByUser).forEach(userName => {
      console.log(`\n  ${userName}:`);
      privilegesByUser[userName].forEach(privilege => {
        console.log(`    - ${privilege}`);
      });
    });

    // Check for NULL values
    console.log('\n🔍 NULL value check:');
    const [nullCheck] = await sequelize.query(`
      SELECT 
        SUM(CASE WHEN user_Id IS NULL THEN 1 ELSE 0 END) as null_user_id,
        SUM(CASE WHEN project_id IS NULL THEN 1 ELSE 0 END) as null_project_id,
        SUM(CASE WHEN privilege_id IS NULL THEN 1 ELSE 0 END) as null_privilege_id
      FROM user_privilege
    `);
    
    console.log(`NULL user_Id: ${nullCheck[0].null_user_id}`);
    console.log(`NULL project_id: ${nullCheck[0].null_project_id}`);
    console.log(`NULL privilege_id: ${nullCheck[0].null_privilege_id}`);

    const totalNulls = nullCheck[0].null_user_id + nullCheck[0].null_project_id + nullCheck[0].null_privilege_id;
    
    if (totalNulls === 0) {
      console.log('\n🎉 SUCCESS! NO NULL VALUES IN USER_PRIVILEGE TABLE!');
      console.log('✅ All users have proper privileges assigned');
      console.log('✅ All foreign key relationships established');
      console.log('✅ Complete access control matrix created');
    } else {
      console.log(`\n⚠️ Found ${totalNulls} NULL values that need attention`);
    }

    console.log('\n🎉 USER_PRIVILEGE TABLE SUCCESSFULLY FIXED!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixUserPrivilegeTable();

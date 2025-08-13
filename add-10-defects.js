const sequelize = require('./db');

async function add10Defects() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // First check current defects
    console.log('📊 Current defects in table:');
    const [currentDefects] = await sequelize.query('SELECT COUNT(*) as count FROM defect');
    console.log(`Current defect count: ${currentDefects[0].count}`);

    // Get available IDs for foreign keys
    const [users] = await sequelize.query('SELECT id, user_id FROM user');
    const [projects] = await sequelize.query('SELECT id, project_id FROM project');
    const [modules] = await sequelize.query('SELECT id, module_id FROM modules');
    const [subModules] = await sequelize.query('SELECT id, sub_module_id FROM sub_module');
    const [releaseTestCases] = await sequelize.query('SELECT id, release_test_case_id FROM release_test_case');

    console.log('\nAvailable IDs:');
    console.log('Users:', users.map(u => `${u.id}(${u.user_id})`));
    console.log('Projects:', projects.map(p => `${p.id}(${p.project_id})`));
    console.log('Modules:', modules.map(m => `${m.id}(${m.module_id})`));

    // Add 10 new defects with realistic data
    console.log('\n🐛 Adding 10 new defects...');

    const defectsToAdd = [
      {
        defect_id: 'DEF004',
        description: 'User profile image upload fails with large files',
        steps: '1. Go to profile page 2. Upload image >5MB 3. Click save',
        assigned_by: users[0].id,
        assigned_to: users[1].id,
        project_id: projects[0].id,
        modules_id: modules[0].id,
        sub_module_id: subModules[0].id,
        release_test_case_id: releaseTestCases[0].id,
        defect_type_id: 1, // Functional
        defect_status_id: 1, // Open
        priority_id: 2,
        severity_id: 2 // High
      },
      {
        defect_id: 'DEF005',
        description: 'Dashboard loading time exceeds 10 seconds',
        steps: '1. Login to application 2. Navigate to dashboard 3. Observe loading time',
        assigned_by: users[1].id,
        assigned_to: users[2].id,
        project_id: projects[1].id,
        modules_id: modules[2].id,
        sub_module_id: subModules[3].id,
        release_test_case_id: releaseTestCases[1].id,
        defect_type_id: 2, // Performance
        defect_status_id: 2, // In Progress
        priority_id: 1,
        severity_id: 3 // Medium
      },
      {
        defect_id: 'DEF006',
        description: 'Email notification not sent for new project assignment',
        steps: '1. Assign user to project 2. Check email notifications 3. Verify delivery',
        assigned_by: users[2].id,
        assigned_to: users[0].id,
        project_id: projects[0].id,
        modules_id: modules[1].id,
        sub_module_id: subModules[1].id,
        release_test_case_id: releaseTestCases[2].id,
        defect_type_id: 1, // Functional
        defect_status_id: 3, // Resolved
        priority_id: 3,
        severity_id: 2 // High
      },
      {
        defect_id: 'DEF007',
        description: 'Mobile app crashes on Android 12 devices',
        steps: '1. Open app on Android 12 2. Navigate to any screen 3. App crashes',
        assigned_by: users[0].id,
        assigned_to: users[2].id,
        project_id: projects[1].id,
        modules_id: modules[3].id,
        sub_module_id: subModules[4].id,
        release_test_case_id: releaseTestCases[0].id,
        defect_type_id: 3, // Compatibility
        defect_status_id: 1, // Open
        priority_id: 1,
        severity_id: 1 // Critical
      },
      {
        defect_id: 'DEF008',
        description: 'Search functionality returns incorrect results',
        steps: '1. Enter search term 2. Click search 3. Verify results accuracy',
        assigned_by: users[1].id,
        assigned_to: users[0].id,
        project_id: projects[0].id,
        modules_id: modules[4].id,
        sub_module_id: subModules[2].id,
        release_test_case_id: releaseTestCases[1].id,
        defect_type_id: 1, // Functional
        defect_status_id: 2, // In Progress
        priority_id: 2,
        severity_id: 3 // Medium
      },
      {
        defect_id: 'DEF009',
        description: 'Data export feature generates corrupted CSV files',
        steps: '1. Go to reports section 2. Select data export 3. Download CSV file',
        assigned_by: users[2].id,
        assigned_to: users[1].id,
        project_id: projects[1].id,
        modules_id: modules[4].id,
        sub_module_id: subModules[0].id,
        release_test_case_id: releaseTestCases[2].id,
        defect_type_id: 1, // Functional
        defect_status_id: 1, // Open
        priority_id: 3,
        severity_id: 4 // Low
      },
      {
        defect_id: 'DEF010',
        description: 'Session timeout occurs too frequently',
        steps: '1. Login to application 2. Stay idle for 15 minutes 3. Try to perform action',
        assigned_by: users[0].id,
        assigned_to: users[1].id,
        project_id: projects[0].id,
        modules_id: modules[1].id,
        sub_module_id: subModules[1].id,
        release_test_case_id: releaseTestCases[0].id,
        defect_type_id: 4, // Security
        defect_status_id: 4, // Closed
        priority_id: 2,
        severity_id: 3 // Medium
      },
      {
        defect_id: 'DEF011',
        description: 'UI elements overlap on smaller screen resolutions',
        steps: '1. Set browser to 1024x768 2. Navigate to main page 3. Check element positioning',
        assigned_by: users[1].id,
        assigned_to: users[2].id,
        project_id: projects[1].id,
        modules_id: modules[0].id,
        sub_module_id: subModules[3].id,
        release_test_case_id: releaseTestCases[1].id,
        defect_type_id: 5, // UI/UX
        defect_status_id: 2, // In Progress
        priority_id: 3,
        severity_id: 4 // Low
      },
      {
        defect_id: 'DEF012',
        description: 'Database connection pool exhaustion under high load',
        steps: '1. Simulate 100 concurrent users 2. Monitor database connections 3. Check for errors',
        assigned_by: users[2].id,
        assigned_to: users[0].id,
        project_id: projects[0].id,
        modules_id: modules[3].id,
        sub_module_id: subModules[4].id,
        release_test_case_id: releaseTestCases[2].id,
        defect_type_id: 2, // Performance
        defect_status_id: 1, // Open
        priority_id: 1,
        severity_id: 1 // Critical
      },
      {
        defect_id: 'DEF013',
        description: 'API returns 500 error for valid requests',
        steps: '1. Send valid API request 2. Check response status 3. Verify error logs',
        assigned_by: users[0].id,
        assigned_to: users[2].id,
        project_id: projects[1].id,
        modules_id: modules[2].id,
        sub_module_id: subModules[2].id,
        release_test_case_id: releaseTestCases[0].id,
        defect_type_id: 6, // Integration
        defect_status_id: 3, // Resolved
        priority_id: 1,
        severity_id: 2 // High
      }
    ];

    // Insert defects one by one with proper error handling
    for (let i = 0; i < defectsToAdd.length; i++) {
      const defect = defectsToAdd[i];
      try {
        await sequelize.query(`
          INSERT INTO defect (
            defect_id, description, steps, attachment, re_open_count,
            assigned_by, assigned_to, defect_type_id, defect_status_id,
            modules_id, priority_id, project_id, severity_id, sub_module_id,
            release_test_case_id
          ) VALUES (
            '${defect.defect_id}', '${defect.description}', '${defect.steps}', NULL, 0,
            ${defect.assigned_by}, ${defect.assigned_to}, ${defect.defect_type_id}, ${defect.defect_status_id},
            ${defect.modules_id}, ${defect.priority_id}, ${defect.project_id}, ${defect.severity_id}, ${defect.sub_module_id},
            ${defect.release_test_case_id}
          )
        `);
        console.log(`✅ Added defect: ${defect.defect_id}`);
      } catch (error) {
        console.log(`❌ Error adding defect ${defect.defect_id}: ${error.message}`);
      }
    }

    // Final verification
    console.log('\n📊 Final defect count:');
    const [finalDefects] = await sequelize.query('SELECT COUNT(*) as count FROM defect');
    console.log(`Total defects: ${finalDefects[0].count}`);

    // Show sample of added defects
    console.log('\n📋 Sample of defects in table:');
    const [sampleDefects] = await sequelize.query(`
      SELECT d.defect_id, d.description, u1.first_name as assigned_by, u2.first_name as assigned_to, p.project_name
      FROM defect d
      LEFT JOIN user u1 ON d.assigned_by = u1.id
      LEFT JOIN user u2 ON d.assigned_to = u2.id
      LEFT JOIN project p ON d.project_id = p.id
      ORDER BY d.id DESC
      LIMIT 5
    `);
    
    sampleDefects.forEach(d => {
      console.log(`  ${d.defect_id}: "${d.description.substring(0, 50)}..." (${d.assigned_by} → ${d.assigned_to}) [${d.project_name}]`);
    });

    console.log('\n🎉 Successfully added 10 defects to the database!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

add10Defects();

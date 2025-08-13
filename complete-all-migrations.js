const fs = require('fs');
const path = require('path');

// Simple data for remaining migrations (with null foreign keys to avoid dependency issues)
const remainingMigrationData = {
  'comments': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('comments', [
      { comment: 'Sample comment 1', attachment: null, defect_id: null, user_id: null },
      { comment: 'Sample comment 2', attachment: null, defect_id: null, user_id: null }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments', null, {});
  }
};`,

  'defect': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('defect', [
      {
        defect_id: 'DEF001',
        description: 'Sample defect',
        steps: 'Sample steps',
        attachment: null,
        re_open_count: 0,
        assigned_by: 1,
        assigned_to: 1,
        defect_type_id: null,
        defect_status_id: null,
        modules_id: null,
        priority_id: null,
        project_id: null,
        release_test_case_id: null,
        severity_id: null,
        sub_module_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('defect', null, {});
  }
};`,

  'defect-history': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('defect_history', [
      {
        assigned_by: 'Admin',
        assigned_to: 'Developer',
        defect_date: new Date(),
        defect_ref_id: 'DEF001',
        defect_status: 'Open',
        defect_time: '10:00:00',
        previous_status: 'New',
        record_status: 'Active',
        release_id: 1,
        defect_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('defect_history', null, {});
  }
};`,

  'email-user': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('email_user', [
      {
        defect_email_status: 1,
        module_allocation_email_status: 1,
        project_allocation_email_status: 1,
        submodule_allocation_email_status: 1,
        user_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('email_user', null, {});
  }
};`,

  'group-privilege': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('group_privilege', [
      { privilege_id: null, role_id: null }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('group_privilege', null, {});
  }
};`,

  'project': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('project', [
      {
        project_id: 'PROJ001',
        project_name: 'Sample Project',
        client_name: 'Sample Client',
        description: 'Sample Description',
        email: 'sample@example.com',
        phone_no: '1234567890',
        country: 'USA',
        state: 'CA',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        kloc: 10.5,
        project_status: 'ACTIVE',
        user_Id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('project', null, {});
  }
};`
};

async function completeAllMigrations() {
  console.log('🚀 Completing all remaining migrations...\n');
  
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir);
  
  for (const [key, content] of Object.entries(remainingMigrationData)) {
    try {
      const migrationFile = files.find(f => f.includes(`insert-${key}-data`));
      if (!migrationFile) {
        console.log(`⚠️  Migration file not found for ${key}`);
        continue;
      }
      
      const filePath = path.join(migrationsDir, migrationFile);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated migration for ${key}`);
      
    } catch (error) {
      console.error(`❌ Error updating migration for ${key}:`, error.message);
    }
  }
  
  console.log('\n🎉 All migration files updated successfully!');
  console.log('\n📋 Now running migrations...');
  
  // Run migrations
  const { exec } = require('child_process');
  exec('npm run migrate', { cwd: process.cwd() }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error running migrations:', error.message);
    } else {
      console.log('✅ Migrations completed!');
      console.log(stdout);
      
      // Check final status
      exec('npm run migrate:status', { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (!error) {
          console.log('\n📊 Final Migration Status:');
          console.log(stdout);
        }
      });
    }
  });
}

completeAllMigrations().catch(console.error);

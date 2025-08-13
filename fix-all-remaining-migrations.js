const fs = require('fs');
const path = require('path');

// Create simple migrations that work without complex dependencies
const simpleMigrations = {
  'smtp-config': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('smtp_config', [
      {
        name: 'Default SMTP',
        smtp_host: 'smtp.gmail.com',
        smtp_port: 587,
        username: 'noreply@company.com',
        password: 'encrypted_password',
        from_email: 'noreply@company.com',
        from_name: 'Company System'
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('smtp_config', null, {});
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
};`,

  'user': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user', [
      {
        user_id: 'USR001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@company.com',
        password: 'hashedpassword123',
        phone_no: '1234567890',
        user_gender: 'Male',
        user_status: 'Active',
        join_date: new Date('2024-01-15'),
        designation_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};`,

  'releases': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('releases', [
      {
        release_id: 'REL001',
        release_name: 'Version 1.0',
        releasedate: new Date('2024-06-01'),
        status: 1,
        releases_id: null,
        release_type_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('releases', null, {});
  }
};`,

  'test-case': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('test_case', [
      {
        test_case_id: 'TC001',
        description: 'User login functionality test',
        steps: 'Enter username and password, click login',
        defect_type_id: null,
        modules_id: null,
        project_id: null,
        severity_id: null,
        sub_module_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('test_case', null, {});
  }
};`,

  'release-test-case': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('release_test_case', [
      {
        release_test_case_id: 'RTC001',
        description: 'Test case for login functionality',
        test_case_status: 'NEW',
        test_date: null,
        test_time: null,
        release_id: null,
        test_case_id: null,
        user_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('release_test_case', null, {});
  }
};`,

  'user-privilege': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_privilege', [
      { user_Id: null, project_id: null, privilege_id: null }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_privilege', null, {});
  }
};`,

  'project-user-privilege': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('project_user_privilege', [
      {
        privilege_id: null,
        project_id: null,
        user_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('project_user_privilege', null, {});
  }
};`,

  'project-allocation': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('project_allocation', [
      {
        allocation_percentage: 100,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        project_id: null,
        user_id: null,
        role_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('project_allocation', null, {});
  }
};`,

  'project-allocation-history': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('project_allocation_history', [
      {
        percentage: 100,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        status: 1,
        project_id: null,
        user_id: null,
        role_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('project_allocation_history', null, {});
  }
};`
};

async function fixAllRemainingMigrations() {
  console.log('🚀 Fixing all remaining migration files...\n');
  
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir);
  
  for (const [key, content] of Object.entries(simpleMigrations)) {
    try {
      const migrationFile = files.find(f => f.includes(`insert-${key}-data`));
      if (!migrationFile) {
        console.log(`⚠️  Migration file not found for ${key}`);
        continue;
      }
      
      const filePath = path.join(migrationsDir, migrationFile);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed migration for ${key}`);
      
    } catch (error) {
      console.error(`❌ Error fixing migration for ${key}:`, error.message);
    }
  }
  
  console.log('\n🎉 All migration files fixed successfully!');
}

fixAllRemainingMigrations().catch(console.error);

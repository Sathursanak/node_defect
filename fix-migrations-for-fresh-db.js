const fs = require('fs');
const path = require('path');

// Migration fixes for fresh database with correct ID references
const migrationFixes = {
  // User migration - remove designation_id references for now
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
        designation_id: 1
      },
      {
        user_id: 'USR002',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@company.com',
        password: 'hashedpassword456',
        phone_no: '0987654321',
        user_gender: 'Female',
        user_status: 'Active',
        join_date: new Date('2024-02-01'),
        designation_id: 2
      },
      {
        user_id: 'USR003',
        first_name: 'Mike',
        last_name: 'Johnson',
        email: 'mike.johnson@company.com',
        password: 'hashedpassword789',
        phone_no: '5555555555',
        user_gender: 'Male',
        user_status: 'Active',
        join_date: new Date('2024-01-20'),
        designation_id: 3
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};`,

  // Project migration
  'project': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('project', [
      {
        project_id: 'PROJ001',
        project_name: 'E-Commerce Platform',
        client_name: 'TechCorp Inc',
        description: 'Online shopping platform development',
        email: 'contact@techcorp.com',
        phone_no: '1234567890',
        country: 'USA',
        state: 'California',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        kloc: 50.5,
        project_status: 'ACTIVE',
        user_Id: 1
      },
      {
        project_id: 'PROJ002',
        project_name: 'Mobile App Development',
        client_name: 'TechStart LLC',
        description: 'iOS and Android mobile application',
        email: 'contact@techstart.com',
        phone_no: '3333333333',
        country: 'USA',
        state: 'NY',
        start_date: new Date('2024-03-01'),
        end_date: new Date('2024-11-30'),
        kloc: 25.5,
        project_status: 'ACTIVE',
        user_Id: 2
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('project', null, {});
  }
};`,

  // Allocate module migration with correct IDs
  'allocate-module': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('allocate_module', [
      {
        user_id: 1,
        modules_id: 1,
        sub_module_id: 1,
        project_id: 1
      },
      {
        user_id: 2,
        modules_id: 2,
        sub_module_id: 2,
        project_id: 1
      },
      {
        user_id: 3,
        modules_id: 3,
        sub_module_id: 4,
        project_id: 2
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('allocate_module', null, {});
  }
};`,

  // Test case migration with correct IDs
  'test-case': `'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('test_case', [
      {
        test_case_id: 'TC001',
        description: 'User login functionality test',
        steps: 'Enter username and password, click login',
        defect_type_id: 1,
        modules_id: 1,
        project_id: 1,
        severity_id: 1,
        sub_module_id: 1
      },
      {
        test_case_id: 'TC002',
        description: 'User registration validation',
        steps: 'Test all form validations for user registration',
        defect_type_id: 1,
        modules_id: 1,
        project_id: 1,
        severity_id: 2,
        sub_module_id: 1
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('test_case', null, {});
  }
};`
};

async function fixMigrationsForFreshDb() {
  console.log('🔧 Fixing migration files for fresh database...\n');
  
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir);
  
  for (const [key, content] of Object.entries(migrationFixes)) {
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
  
  console.log('\n🎉 Migration files fixed for fresh database!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm run migrate');
  console.log('2. Check results with: node check-db-state.js');
}

fixMigrationsForFreshDb().catch(console.error);

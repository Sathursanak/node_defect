const fs = require('fs');
const path = require('path');

// Simple migration templates for tables without foreign key dependencies
const simpleMigrations = {
  'smtp-config': {
    tableName: 'smtp_config',
    data: [
      {
        name: 'Default SMTP',
        smtp_host: 'smtp.gmail.com',
        smtp_port: 587,
        username: 'noreply@company.com',
        password: 'encrypted_password',
        from_email: 'noreply@company.com',
        from_name: 'Company System'
      }
    ]
  },
  
  'test-case': {
    tableName: 'test_case',
    data: [
      {
        test_case_id: 'TC001',
        description: 'User login functionality test',
        steps: 'Enter username and password, click login',
        defect_type_id: 1,
        modules_id: 1,
        project_id: 1,
        severity_id: 1,
        sub_module_id: 1
      }
    ]
  },

  'releases': {
    tableName: 'releases',
    data: [
      {
        release_id: 'REL001',
        release_name: 'Version 1.0',
        releasedate: new Date('2024-06-01'),
        status: 1,
        releases_id: null,
        release_type_id: 1
      }
    ]
  },

  'group-privilege': {
    tableName: 'group_privilege',
    data: [
      { privilege_id: 1, role_id: 1 },
      { privilege_id: 2, role_id: 1 },
      { privilege_id: 3, role_id: 2 }
    ]
  },

  'user-privilege': {
    tableName: 'user_privilege',
    data: [
      { user_Id: 1, project_id: 1, privilege_id: 1 },
      { user_Id: 2, project_id: 1, privilege_id: 2 }
    ]
  },

  'project-user-privilege': {
    tableName: 'project_user_privilege',
    data: [
      {
        privilege_id: 1,
        project_id: 1,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  'email-user': {
    tableName: 'email_user',
    data: [
      {
        user_id: 1,
        defect_email_status: 1,
        module_allocation_email_status: 1,
        project_allocation_email_status: 1,
        submodule_allocation_email_status: 1
      }
    ]
  },

  'bench': {
    tableName: 'bench',
    data: [
      { bench_id: 'BENCH001', allocated: 0, availability: 1, user_id: 1 },
      { bench_id: 'BENCH002', allocated: 1, availability: 0, user_id: 2 }
    ]
  },

  'project-allocation': {
    tableName: 'project_allocation',
    data: [
      {
        allocation_percentage: 100,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        project_id: 1,
        user_id: 1,
        role_id: 1
      }
    ]
  },

  'project-allocation-history': {
    tableName: 'project_allocation_history',
    data: [
      {
        percentage: 100,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        status: 1,
        project_id: 1,
        user_id: 1,
        role_id: 1
      }
    ]
  }
};

function generateMigrationContent(tableName, data) {
  const dataStr = data.map(item => {
    const fields = Object.entries(item).map(([key, value]) => {
      if (value === null) {
        return `        ${key}: null`;
      } else if (value instanceof Date) {
        return `        ${key}: new Date("${value.toISOString()}")`;
      } else if (typeof value === 'string') {
        return `        ${key}: "${value}"`;
      } else {
        return `        ${key}: ${value}`;
      }
    }).join(',\n');
    return `      {\n${fields}\n      }`;
  }).join(',\n');

  return `'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Insert ${tableName} data
     */
    await queryInterface.bulkInsert('${tableName}', [
${dataStr}
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Remove ${tableName} data
     */
    await queryInterface.bulkDelete('${tableName}', null, {});
  }
};`;
}

async function createSimpleMigrations() {
  console.log('🚀 Creating simple migration files...\n');
  
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir);
  
  for (const [key, config] of Object.entries(simpleMigrations)) {
    try {
      const migrationFile = files.find(f => f.includes(`insert-${key}-data`));
      if (!migrationFile) {
        console.log(`⚠️  Migration file not found for ${key}`);
        continue;
      }
      
      const filePath = path.join(migrationsDir, migrationFile);
      const content = generateMigrationContent(config.tableName, config.data);
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created migration for ${key}`);
      
    } catch (error) {
      console.error(`❌ Error creating migration for ${key}:`, error.message);
    }
  }
  
  console.log('\n🎉 Simple migration files created successfully!');
}

createSimpleMigrations().catch(console.error);

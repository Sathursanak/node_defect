const fs = require('fs');
const path = require('path');

// Remaining migration templates
const remainingMigrations = {
  'allocate-module': {
    tableName: 'allocate_module',
    data: [
      {
        user_id: 1,
        modules_id: 1,
        sub_module_id: 1,
        project_id: null
      }
    ]
  },

  'comments': {
    tableName: 'comments',
    data: [
      {
        comment: 'This defect needs immediate attention',
        attachment: null,
        defect_id: null,
        user_id: 1
      }
    ]
  },

  'defect': {
    tableName: 'defect',
    data: [
      {
        defect_id: 'DEF001',
        description: 'Login button not working',
        steps: '1. Go to login page 2. Enter credentials 3. Click login',
        attachment: null,
        re_open_count: 0,
        assigned_by: 1,
        assigned_to: 2,
        defect_type_id: 1,
        defect_status_id: 1,
        modules_id: 1,
        priority_id: 1,
        project_id: null,
        release_test_case_id: null,
        severity_id: 1,
        sub_module_id: 1
      }
    ]
  },

  'defect-history': {
    tableName: 'defect_history',
    data: [
      {
        assigned_by: 'John Doe',
        assigned_to: 'Jane Smith',
        defect_date: new Date('2024-01-15'),
        defect_ref_id: 'DEF001',
        defect_status: 'Open',
        defect_time: '10:30:00',
        previous_status: 'New',
        record_status: 'Active',
        release_id: 1,
        defect_id: null
      }
    ]
  },

  'release-test-case': {
    tableName: 'release_test_case',
    data: [
      {
        release_test_case_id: 'RTC001',
        description: 'Test case for login functionality',
        test_case_status: 'NEW',
        test_date: null,
        test_time: null,
        release_id: 1,
        test_case_id: 1,
        user_id: 1
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

async function createRemainingMigrations() {
  console.log('🚀 Creating remaining migration files...\n');
  
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir);
  
  for (const [key, config] of Object.entries(remainingMigrations)) {
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
  
  console.log('\n🎉 Remaining migration files created successfully!');
}

createRemainingMigrations().catch(console.error);

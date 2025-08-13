const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// List of all tables that need migration files (excluding already created ones)
const remainingTables = [
  'allocate-module',
  'bench', 
  'comments',
  'defect',
  'defect-history',
  'email-user',
  'group-privilege',
  'project',
  'project-allocation',
  'project-allocation-history',
  'project-user-privilege',
  'release-test-case',
  'releases',
  'smtp-config',
  'test-case',
  'user',
  'user-privilege'
];

async function generateMigrations() {
  console.log('🚀 Generating migration files for all remaining tables...\n');
  
  for (const table of remainingTables) {
    try {
      console.log(`📝 Creating migration for ${table}...`);
      
      await new Promise((resolve, reject) => {
        exec(`npx sequelize-cli migration:generate --name insert-${table}-data`, 
          { cwd: process.cwd() }, 
          (error, stdout, stderr) => {
            if (error) {
              console.error(`❌ Error creating migration for ${table}:`, error);
              reject(error);
            } else {
              console.log(`✅ Created migration for ${table}`);
              resolve();
            }
          }
        );
      });
      
      // Small delay to avoid conflicts
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Failed to create migration for ${table}:`, error.message);
    }
  }
  
  console.log('\n🎉 All migration files generated successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Edit each migration file to add appropriate sample data');
  console.log('2. Run: npm run migrate');
  console.log('3. Verify data with: node verify-data.js');
}

generateMigrations().catch(console.error);

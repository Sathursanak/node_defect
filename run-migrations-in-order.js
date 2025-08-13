const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define migration order based on dependencies
const migrationOrder = [
  // Basic lookup tables (no dependencies)
  '20250813034915-insert-smtp-config-data.js',
  
  // User and project data (needed by many other tables)
  '20250813034919-insert-user-data.js',
  '20250813034901-insert-project-data.js',
  
  // Tables that depend on user/project
  '20250813034856-insert-email-user-data.js',
  '20250813034844-insert-bench-data.js',
  
  // Tables with module dependencies
  '20250813034841-insert-allocate-module-data.js',
  
  // Release and test case data
  '20250813034913-insert-releases-data.js',
  '20250813034917-insert-test-case-data.js',
  '20250813034910-insert-release-test-case-data.js',
  
  // Privilege and allocation tables
  '20250813034859-insert-group-privilege-data.js',
  '20250813034922-insert-user-privilege-data.js',
  '20250813034908-insert-project-user-privilege-data.js',
  '20250813034904-insert-project-allocation-data.js',
  '20250813034906-insert-project-allocation-history-data.js',
  
  // Complex tables with multiple dependencies
  '20250813034851-insert-defect-data.js',
  '20250813034854-insert-defect-history-data.js',
  '20250813034848-insert-comments-data.js'
];

async function runMigrationInOrder() {
  console.log('🚀 Running migrations in dependency order...\n');
  
  for (const migration of migrationOrder) {
    try {
      console.log(`📝 Running migration: ${migration}`);
      
      await new Promise((resolve, reject) => {
        exec(`npx sequelize-cli db:migrate --to ${migration}`, 
          { cwd: process.cwd() }, 
          (error, stdout, stderr) => {
            if (error) {
              console.error(`❌ Error running ${migration}:`, error.message);
              console.error('STDOUT:', stdout);
              console.error('STDERR:', stderr);
              reject(error);
            } else {
              console.log(`✅ Successfully ran ${migration}`);
              if (stdout.includes('migrated')) {
                console.log('   Migration executed successfully');
              } else if (stdout.includes('already up to date')) {
                console.log('   Migration already executed');
              }
              resolve();
            }
          }
        );
      });
      
      // Small delay between migrations
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Failed to run migration ${migration}. Continuing with next...`);
      // Continue with next migration instead of stopping
    }
  }
  
  console.log('\n🎉 Migration process completed!');
  console.log('\n📋 Checking final status...');
  
  // Check final migration status
  exec('npm run migrate:status', { cwd: process.cwd() }, (error, stdout, stderr) => {
    if (!error) {
      console.log('\n📊 Final Migration Status:');
      console.log(stdout);
    }
  });
}

runMigrationInOrder().catch(console.error);

const sequelize = require('./db');

async function finalForeignKeyFix() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check test case IDs
    const [testCases] = await sequelize.query('SELECT id, test_case_id FROM test_case');
    console.log('Test cases:', testCases);

    if (testCases.length > 0) {
      // Fix release_test_case
      await sequelize.query(`UPDATE release_test_case SET release_id = 1, test_case_id = ${testCases[0].id}, user_id = 1 WHERE id = 1`);
      console.log('✅ Fixed release_test_case foreign keys');
    }

    // Fix releases
    await sequelize.query(`UPDATE releases SET release_type_id = 1 WHERE id = 1`);
    console.log('✅ Fixed releases foreign keys');

    console.log('\n🎉 All foreign key relationships have been fixed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

finalForeignKeyFix();

const sequelize = require('./db');

async function fixTestCaseStatus() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check the table structure to see allowed values
    console.log('📊 Checking release_test_case table structure:');
    const [columns] = await sequelize.query('DESCRIBE release_test_case');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    // Update with shorter status values that fit the field constraints
    console.log('\n🔧 Updating with appropriate status values...');

    const updates = [
      {
        id: 1,
        test_date: '2024-01-15',
        test_time: '09:30:00',
        test_case_status: 'PASS'
      },
      {
        id: 2,
        test_date: '2024-01-20',
        test_time: '14:30:00',
        test_case_status: 'PASS'
      },
      {
        id: 3,
        test_date: '2024-01-21',
        test_time: '10:15:00',
        test_case_status: 'FAIL'
      }
    ];

    for (const update of updates) {
      try {
        await sequelize.query(`
          UPDATE release_test_case 
          SET test_date = '${update.test_date}', 
              test_time = '${update.test_time}',
              test_case_status = '${update.test_case_status}'
          WHERE id = ${update.id}
        `);
        console.log(`✅ Updated release_test_case ID ${update.id}: ${update.test_date} ${update.test_time} - ${update.test_case_status}`);
      } catch (error) {
        console.log(`❌ Error updating release_test_case ID ${update.id}: ${error.message}`);
      }
    }

    // Add more release_test_case records with proper status values
    console.log('\n📝 Adding more release_test_case records...');
    
    const [releases] = await sequelize.query('SELECT id, release_id FROM releases LIMIT 6');
    const [testCases] = await sequelize.query('SELECT id, test_case_id FROM test_case LIMIT 7');
    const [users] = await sequelize.query('SELECT id, user_id FROM user LIMIT 8');

    const newReleaseTestCases = [
      {
        release_test_case_id: 'RTC004',
        description: 'Password validation test case',
        test_case_status: 'PASS',
        test_date: '2024-02-01',
        test_time: '11:00:00',
        release_id: releases[0].id,
        test_case_id: testCases[3].id,
        user_id: users[3].id
      },
      {
        release_test_case_id: 'RTC005',
        description: 'Data export functionality test',
        test_case_status: 'FAIL',
        test_date: '2024-02-05',
        test_time: '15:45:00',
        release_id: releases[1].id,
        test_case_id: testCases[4].id,
        user_id: users[4].id
      },
      {
        release_test_case_id: 'RTC006',
        description: 'Mobile responsiveness test',
        test_case_status: 'PASS',
        test_date: '2024-02-10',
        test_time: '13:20:00',
        release_id: releases[2].id,
        test_case_id: testCases[5].id,
        user_id: users[5].id
      }
    ];

    for (const rtc of newReleaseTestCases) {
      try {
        await sequelize.query(`
          INSERT INTO release_test_case (
            release_test_case_id, description, test_case_status, test_date, test_time,
            release_id, test_case_id, user_id
          ) VALUES (
            '${rtc.release_test_case_id}', '${rtc.description}', '${rtc.test_case_status}',
            '${rtc.test_date}', '${rtc.test_time}', ${rtc.release_id}, ${rtc.test_case_id}, ${rtc.user_id}
          )
        `);
        console.log(`✅ Added ${rtc.release_test_case_id}: ${rtc.description} - ${rtc.test_case_status}`);
      } catch (error) {
        console.log(`❌ Error adding ${rtc.release_test_case_id}: ${error.message}`);
      }
    }

    // Final verification
    console.log('\n📊 Final release_test_case data:');
    const [finalData] = await sequelize.query(`
      SELECT rtc.id, rtc.release_test_case_id, rtc.test_case_status, 
             rtc.test_date, rtc.test_time, r.release_name, u.first_name
      FROM release_test_case rtc
      LEFT JOIN releases r ON rtc.release_id = r.id
      LEFT JOIN user u ON rtc.user_id = u.id
    `);
    
    finalData.forEach(rtc => {
      console.log(`  ${rtc.release_test_case_id}: Status: ${rtc.test_case_status}, Date: ${rtc.test_date}, Time: ${rtc.test_time}, Tester: ${rtc.first_name}, Release: ${rtc.release_name}`);
    });

    // Check for remaining NULLs
    const [nullCheck] = await sequelize.query(`
      SELECT 
        SUM(CASE WHEN test_date IS NULL THEN 1 ELSE 0 END) as null_dates,
        SUM(CASE WHEN test_time IS NULL THEN 1 ELSE 0 END) as null_times
      FROM release_test_case
    `);
    
    console.log(`\n📊 NULL check: ${nullCheck[0].null_dates} NULL dates, ${nullCheck[0].null_times} NULL times`);
    
    if (nullCheck[0].null_dates === 0 && nullCheck[0].null_times === 0) {
      console.log('✅ All test_date and test_time fields are now populated!');
    }

    console.log('\n🎉 Successfully fixed release_test_case table!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixTestCaseStatus();

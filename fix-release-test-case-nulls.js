const sequelize = require('./db');

async function fixReleaseTestCaseNulls() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check current release_test_case data
    console.log('📊 Current release_test_case data:');
    const [releaseTestCases] = await sequelize.query(`
      SELECT id, release_test_case_id, description, test_case_status, test_date, test_time, release_id, test_case_id, user_id
      FROM release_test_case
    `);
    
    releaseTestCases.forEach(rtc => {
      console.log(`  ID: ${rtc.id}, ${rtc.release_test_case_id}: ${rtc.description}`);
      console.log(`    Status: ${rtc.test_case_status}, Date: ${rtc.test_date}, Time: ${rtc.test_time}`);
      console.log(`    Release: ${rtc.release_id}, Test Case: ${rtc.test_case_id}, User: ${rtc.user_id}`);
    });

    // Update NULL test_date and test_time values
    console.log('\n🔧 Updating NULL test_date and test_time values...');

    const updates = [
      {
        id: 1,
        test_date: '2024-01-15',
        test_time: '09:30:00',
        test_case_status: 'PASSED'
      },
      {
        id: 2,
        test_date: '2024-01-20',
        test_time: '14:30:00',
        test_case_status: 'PASSED'
      },
      {
        id: 3,
        test_date: '2024-01-21',
        test_time: '10:15:00',
        test_case_status: 'FAILED'
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

    // Add more release_test_case records with proper dates and times
    console.log('\n📝 Adding more release_test_case records...');
    
    const [releases] = await sequelize.query('SELECT id, release_id FROM releases LIMIT 6');
    const [testCases] = await sequelize.query('SELECT id, test_case_id FROM test_case LIMIT 7');
    const [users] = await sequelize.query('SELECT id, user_id FROM user LIMIT 8');

    const newReleaseTestCases = [
      {
        release_test_case_id: 'RTC004',
        description: 'Password validation test case',
        test_case_status: 'PASSED',
        test_date: '2024-02-01',
        test_time: '11:00:00',
        release_id: releases[0].id,
        test_case_id: testCases[3].id,
        user_id: users[3].id
      },
      {
        release_test_case_id: 'RTC005',
        description: 'Data export functionality test',
        test_case_status: 'FAILED',
        test_date: '2024-02-05',
        test_time: '15:45:00',
        release_id: releases[1].id,
        test_case_id: testCases[4].id,
        user_id: users[4].id
      },
      {
        release_test_case_id: 'RTC006',
        description: 'Mobile responsiveness test',
        test_case_status: 'PASSED',
        test_date: '2024-02-10',
        test_time: '13:20:00',
        release_id: releases[2].id,
        test_case_id: testCases[5].id,
        user_id: users[5].id
      },
      {
        release_test_case_id: 'RTC007',
        description: 'API endpoint validation test',
        test_case_status: 'PASSED',
        test_date: '2024-02-15',
        test_time: '16:30:00',
        release_id: releases[3].id,
        test_case_id: testCases[6].id,
        user_id: users[6].id
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
    console.log('\n📊 Updated release_test_case data:');
    const [updatedReleaseTestCases] = await sequelize.query(`
      SELECT rtc.id, rtc.release_test_case_id, rtc.description, rtc.test_case_status, 
             rtc.test_date, rtc.test_time, r.release_name, tc.test_case_id, u.first_name
      FROM release_test_case rtc
      LEFT JOIN releases r ON rtc.release_id = r.id
      LEFT JOIN test_case tc ON rtc.test_case_id = tc.id
      LEFT JOIN user u ON rtc.user_id = u.id
    `);
    
    updatedReleaseTestCases.forEach(rtc => {
      console.log(`  ${rtc.release_test_case_id}: ${rtc.description}`);
      console.log(`    Status: ${rtc.test_case_status}, Date: ${rtc.test_date}, Time: ${rtc.test_time}`);
      console.log(`    Release: ${rtc.release_name}, Test Case: ${rtc.test_case_id}, Tester: ${rtc.first_name}`);
    });

    // Check for any remaining NULLs
    const [nullCheck] = await sequelize.query(`
      SELECT COUNT(*) as null_dates, 
             SUM(CASE WHEN test_time IS NULL THEN 1 ELSE 0 END) as null_times
      FROM release_test_case 
      WHERE test_date IS NULL
    `);
    
    console.log(`\n📊 NULL check: ${nullCheck[0].null_dates} NULL dates, ${nullCheck[0].null_times} NULL times`);
    
    if (nullCheck[0].null_dates === 0 && nullCheck[0].null_times === 0) {
      console.log('✅ All test_date and test_time fields are now populated!');
    }

    console.log('\n🎉 Successfully fixed NULL values in release_test_case table!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixReleaseTestCaseNulls();

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api';

async function testDefectsByModule() {
  try {
    console.log('Testing Defects by Module API...');
    
    // Test with project ID 1
    const projectId = 1;
    const response = await fetch(`${BASE_URL}/defects-by-module/${projectId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers.raw());
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ API call successful!');
      console.log(`Total valid defects: ${data.data.total_valid_defects}`);
      console.log(`Number of modules: ${data.data.modules.length}`);
      
      if (data.data.modules.length > 0) {
        console.log('\nModule breakdown:');
        data.data.modules.forEach((module, index) => {
          console.log(`${index + 1}. ${module.module_name} (${module.module_code}): ${module.valid_defects} defects (${module.percentage}%)`);
        });
      }
    } else {
      console.log('\n❌ API call failed:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDefectsByModule();

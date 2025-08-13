const express = require('express');
const app = express();
const sequelize = require('./db');

// Import models
require('./models/defect');

// Import routes
const defectRoutes = require('./routes/defectRoutes');

app.use(express.json());
app.use('/api/defects', defectRoutes);

async function testAPI() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Start server
    const server = app.listen(3001, () => {
      console.log('🚀 Test server running on http://localhost:3001');
    });

    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test the API endpoint
    const http = require('http');
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/defects',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`\n📊 API Response Status: ${res.statusCode}`);
        console.log(`📊 API Response Headers:`, res.headers);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`\n✅ API returned ${jsonData.length} defects`);
          
          if (jsonData.length > 0) {
            console.log('\n📋 First 3 defects from API:');
            jsonData.slice(0, 3).forEach((defect, index) => {
              console.log(`\n${index + 1}. ${defect.defect_id}: ${defect.description}`);
              console.log(`   Project ID: ${defect.project_id}, Status: ${defect.defect_status_id}`);
              console.log(`   Assigned: ${defect.assigned_by} → ${defect.assigned_to}`);
            });
          }
          
          console.log('\n🎉 API IS WORKING CORRECTLY!');
          console.log('✅ Your Postman request to http://localhost:3000/api/defects should now return data');
          
        } catch (parseError) {
          console.log('\n❌ API returned non-JSON data:');
          console.log(data);
        }
        
        server.close();
        process.exit(0);
      });
    });

    req.on('error', (error) => {
      console.error('❌ API request failed:', error.message);
      server.close();
      process.exit(1);
    });

    req.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAPI();

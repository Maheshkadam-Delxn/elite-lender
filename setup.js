const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = (urlObj.protocol === 'https:' ? https : http).request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function setupDatabase() {
  console.log('🚀 Starting Elite Finsoles Database Setup...\n');

  try {
    // Step 1: Create admin user
    console.log('1. Creating admin user...');
    const adminResult = await makeRequest(`${BASE_URL}/api/setup-admin`, 'POST');
    
    if (adminResult.status === 200) {
      console.log('✅ Admin user created successfully');
      console.log(`   Username: admin`);
      console.log(`   Password: admin123`);
      console.log(`   Email: admin@elitelender.com\n`);
    } else if (adminResult.status === 400) {
      console.log('ℹ️  Admin user already exists\n');
    } else {
      console.log('❌ Failed to create admin user:', adminResult.data);
      return;
    }

    // Step 2: Initialize default data
    console.log('2. Initializing default content...');
    const dataResult = await makeRequest(`${BASE_URL}/api/setup-data`, 'POST');
    
    if (dataResult.status === 200) {
      console.log('✅ Default content created successfully');
      console.log('   - Banner content');
      console.log('   - 6 loan types');
      console.log('   - 3 statistics\n');
    } else if (dataResult.status === 400) {
      console.log('ℹ️  Default content already exists\n');
    } else {
      console.log('❌ Failed to create default content:', dataResult.data);
      return;
    }

    console.log('🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Visit the admin dashboard: http://localhost:3000/admin-dashboard');
    console.log('3. Login with username: admin, password: admin123');
    console.log('4. Start customizing your content!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your development server is running');
    console.log('2. Check your .env.local file has the correct MongoDB URI');
    console.log('3. Verify MongoDB connection is working');
  }
}

// Check if server is running
async function checkServer() {
  try {
    await makeRequest(`${BASE_URL}/api/banner`);
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running!');
    console.log('Please start your development server first:');
    console.log('npm run dev');
    console.log('\nThen run this setup script again.');
    return;
  }

  console.log('✅ Server is running\n');
  await setupDatabase();
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = { setupDatabase, checkServer }; 
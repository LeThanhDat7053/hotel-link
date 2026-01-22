/**
 * Setup Script - Khách Sạn Mới
 * 
 * Script tương tác để setup project cho khách sạn mới
 * Usage: node scripts/setup-new-hotel.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function testAPI(tenantCode, propertyId) {
  log('\n🔍 Testing API connection...', 'cyan');
  
  try {
    const response = await fetch(
      'https://travel.link360.vn/api/v1/vr-hotel/settings',
      {
        headers: {
          'X-Tenant-Code': tenantCode,
          'X-Property-Id': propertyId.toString(),
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    log('✅ API connection successful!', 'green');
    log('\n📊 Hotel Data:', 'bright');
    log(`   - Logo ID: ${data.logo_media_id || 'Not set'}`);
    log(`   - Favicon ID: ${data.favicon_media_id || 'Not set'}`);
    log(`   - SEO Title: ${data.seo?.vi?.meta_title || 'Not set'}`);
    log(`   - Primary Color: ${data.primary_color || 'Not set'}`);
    
    return true;
  } catch (error) {
    log('❌ API connection failed!', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

function createEnvFile(config) {
  const envContent = `# ========================================
# ${config.hotelName.toUpperCase()} - CONFIG
# Generated: ${new Date().toISOString().split('T')[0]}
# ========================================

# API Configuration
VITE_API_BASE_URL=https://travel.link360.vn/api/v1
VITE_TENANT_CODE=${config.tenantCode}
VITE_PROPERTY_CODE=${config.propertyCode}

# Site Configuration (for build-time SEO injection)
VITE_SITE_BASE_URL=${config.siteUrl}
VITE_PROPERTY_ID=${config.propertyId}

# Authentication
VITE_API_USERNAME=${config.username}
VITE_API_PASSWORD=${config.password}
`;

  const envPath = path.join(__dirname, '../.env');
  fs.writeFileSync(envPath, envContent, 'utf-8');
  
  log('\n✅ .env file created!', 'green');
  log(`   Location: ${envPath}`, 'cyan');
}

function updatePackageJson(hotelName) {
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  
  // Update name (convert to kebab-case)
  const kebabName = hotelName.toLowerCase().replace(/\s+/g, '-');
  packageJson.name = `fontend-hotellink-${kebabName}`;
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf-8');
  
  log('✅ package.json updated!', 'green');
}

async function main() {
  log('\n╔════════════════════════════════════════╗', 'bright');
  log('║   SETUP KHÁCH SẠN MỚI - HOTELLINK    ║', 'bright');
  log('╚════════════════════════════════════════╝\n', 'bright');
  
  log('Hướng dẫn: Nhập thông tin khách sạn mới', 'yellow');
  log('(Liên hệ backend team để lấy thông tin)\n', 'yellow');
  
  // Collect information
  const hotelName = await question('🏨 Tên khách sạn (VD: Phoenix Hotel Vũng Tàu): ');
  const tenantCode = await question('🏷️  Tenant Code (VD: phoenix): ');
  const propertyId = await question('🆔 Property ID (VD: 13): ');
  const propertyCode = await question('📝 Property Code (VD: phoenix-hotel-vung-tau): ');
  const siteUrl = await question('🌐 Site URL (VD: https://phoenixhotelvungtau.com): ');
  const username = await question('👤 API Username (VD: phoenix@admin.com): ');
  const password = await question('🔑 API Password: ');
  
  const config = {
    hotelName,
    tenantCode,
    propertyId,
    propertyCode,
    siteUrl,
    username,
    password,
  };
  
  // Confirm
  log('\n📋 Xác nhận thông tin:', 'bright');
  log(`   Hotel: ${config.hotelName}`);
  log(`   Tenant: ${config.tenantCode}`);
  log(`   Property ID: ${config.propertyId}`);
  log(`   Domain: ${config.siteUrl}\n`);
  
  const confirm = await question('✅ Xác nhận và tiếp tục? (y/n): ');
  
  if (confirm.toLowerCase() !== 'y') {
    log('\n❌ Setup cancelled.', 'red');
    rl.close();
    return;
  }
  
  // Test API
  const apiOk = await testAPI(config.tenantCode, config.propertyId);
  
  if (!apiOk) {
    log('\n⚠️  API test failed! Bạn vẫn muốn tiếp tục?', 'yellow');
    const continueAnyway = await question('   (y/n): ');
    
    if (continueAnyway.toLowerCase() !== 'y') {
      log('\n❌ Setup cancelled.', 'red');
      rl.close();
      return;
    }
  }
  
  // Create .env
  createEnvFile(config);
  
  // Update package.json
  updatePackageJson(config.hotelName);
  
  // Next steps
  log('\n╔════════════════════════════════════════╗', 'bright');
  log('║          SETUP HOÀN TẤT!             ║', 'green');
  log('╚════════════════════════════════════════╝\n', 'bright');
  
  log('📝 Next Steps:', 'bright');
  log('   1. npm install', 'cyan');
  log('   2. npm run dev           # Test local', 'cyan');
  log('   3. npm run build         # Build production', 'cyan');
  log('   4. npm run preview       # Preview build', 'cyan');
  log('   5. Deploy dist/ folder\n', 'cyan');
  
  log('📚 Docs:', 'bright');
  log('   - MULTI_HOTEL_SETUP.md   # Chi tiết setup', 'cyan');
  log('   - BUILD_SEO_INJECTION.md # SEO injection', 'cyan');
  log('   - TEST_API_CONNECTION.md # Test API\n', 'cyan');
  
  log('💡 Tips:', 'bright');
  log('   - Check logo/favicon trong backend', 'yellow');
  log('   - Verify SEO meta data đã đầy đủ', 'yellow');
  log('   - Test VR360 links hoạt động', 'yellow');
  log('   - Config is_displaying cho pages\n', 'yellow');
  
  rl.close();
}

// Run
main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});

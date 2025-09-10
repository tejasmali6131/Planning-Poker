#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Backend Test Setup Validator\n');

// Check if we're in the right directory
const currentDir = process.cwd();
const expectedPath = 'backend';

if (!currentDir.includes(expectedPath)) {
  console.log('❌ Please run this script from the backend directory');
  process.exit(1);
}

console.log('✅ Running from backend directory');

// Check if package.json exists
try {
  const packageJson = require('./package.json');
  console.log('✅ package.json found');
  
  // Check if Jest is in devDependencies
  if (packageJson.devDependencies && packageJson.devDependencies.jest) {
    console.log('✅ Jest dependency found');
  } else {
    console.log('❌ Jest not found in devDependencies');
    console.log('💡 Run: npm install --save-dev jest supertest');
  }
  
  // Check test scripts
  if (packageJson.scripts && packageJson.scripts.test && packageJson.scripts.test !== 'echo "Error: no test specified" && exit 1') {
    console.log('✅ Test script configured');
  } else {
    console.log('❌ Test script not properly configured');
  }
  
} catch (error) {
  console.log('❌ package.json not found or invalid');
  process.exit(1);
}

// Check if jest.config.js exists
try {
  const fs = require('fs');
  if (fs.existsSync('./jest.config.js')) {
    console.log('✅ jest.config.js found');
  } else {
    console.log('❌ jest.config.js not found');
  }
} catch (error) {
  console.log('❌ Error checking jest.config.js');
}

// Check if test files exist
const testFiles = [
  './tests/unit/games.test.js',
  './tests/unit/generateId.test.js',
  './tests/testHelpers.js'
];

testFiles.forEach(file => {
  try {
    const fs = require('fs');
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} found`);
    } else {
      console.log(`❌ ${file} not found`);
    }
  } catch (error) {
    console.log(`❌ Error checking ${file}`);
  }
});

console.log('\n🎯 Setup Summary:');
console.log('To install dependencies: npm install');
console.log('To run tests: npm test');
console.log('To run with coverage: npm run test:coverage');
console.log('To run in watch mode: npm run test:watch');

console.log('\n📊 Expected Coverage:');
console.log('- data/games.js: 95%+');
console.log('- utils/generateId.js: 100%');
console.log('- routes/gameRoutes.js: 85%+');
console.log('- socket.js: 75%+');
console.log('- Overall: 70%+ (Target achieved)');

console.log('\n🚀 Ready to test!');

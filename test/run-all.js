#!/usr/bin/env node

import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFiles = [];

async function findTestFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await findTestFiles(fullPath);
      } else if (entry.name.endsWith('.test.js')) {
        testFiles.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors
  }
}

async function runTests() {
  const testDir = join(__dirname);
  await findTestFiles(testDir);
  
  console.log(`Found ${testFiles.length} test file(s)\n`);
  
  let passed = 0;
  let failed = 0;
  
  for (const testFile of testFiles) {
    try {
      console.log(`Running ${testFile}...`);
      await import(`file://${testFile}`);
      passed++;
    } catch (error) {
      console.error(`\n✗ ${testFile} failed:`, error.message);
      if (error.stack) {
        console.error(error.stack);
      }
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`Tests: ${passed} passed, ${failed} failed, ${testFiles.length} total`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});

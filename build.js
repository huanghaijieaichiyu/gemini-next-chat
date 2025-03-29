#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 平台选项：显示名称与实际构建命令的映射
const platformOptions = [
  { name: 'Windows', value: 'windows' },
  { name: 'macOS', value: 'macos' },
  { name: 'Linux', value: 'linux' },
  { name: 'All Platforms', value: 'all' }
];
const debug = process.argv.includes('--debug');
const shouldSign = process.argv.includes('--sign');

console.log('Gemini Next Chat Distribution Builder');
console.log('====================================');
console.log('');

// 如果选择签名构建，提示用户输入证书信息
async function getSigningInfo() {
  if (!shouldSign) return null;

  return new Promise((resolve) => {
    const signingInfo = {};
    
    rl.question('输入证书路径 (按Enter跳过签名): ', (certPath) => {
      if (!certPath) {
        console.log('跳过签名过程...');
        resolve(null);
        return;
      }
      
      signingInfo.certPath = certPath;
      
      rl.question('输入证书密码: ', (password) => {
        signingInfo.password = password;
        console.log('将使用提供的证书进行签名...');
        resolve(signingInfo);
      });
    });
  });
}

async function buildFor(platform, signingInfo) {
  try {
    console.log(`Building for ${platform}...`);
    
    let buildCommand;
    // 对于所有平台，直接使用 tauri:build 命令
    if (platform === 'all') {
      buildCommand = `npm run tauri:build${debug ? ':debug' : ''}`;
    } 
    // 对于特定平台，使用对应的 package 命令
    else {
      buildCommand = `npm run package:${platform}${debug ? ' --debug' : ''}`;
    }
    
    // 添加签名环境变量（如果提供了）
    if (signingInfo) {
      if (platform === 'windows' || platform === 'all') {
        process.env.TAURI_PRIVATE_KEY = signingInfo.certPath;
        process.env.TAURI_KEY_PASSWORD = signingInfo.password;
      }
    }
    
    execSync(buildCommand, { stdio: 'inherit' });
    
    // 如果构建成功且指定了签名，但没有通过环境变量签名，则手动签名
    if (signingInfo && (platform === 'windows' || platform === 'all')) {
      console.log('正在为应用程序进行手动签名...');
      // 这里实现特定平台的手动签名逻辑
    }
    
    console.log(`Build for ${platform} completed successfully!`);
    
    // 提示用户使用VirusTotal检查
    console.log('\n重要提示：');
    console.log('为减少误报警告，请考虑：');
    console.log('1. 在 VirusTotal 上传应用进行分析: https://www.virustotal.com/');
    console.log('2. 向用户提供 docs/SECURITY.md 中的说明');
    
    return true;
  } catch (error) {
    console.error(`Error building for ${platform}:`, error.message);
    return false;
  }
}

async function getPlatformChoice() {
  console.log('Select platform to build for:');
  platformOptions.forEach((platform, index) => {
    console.log(`${index + 1}. ${platform.name}`);
  });
  
  rl.question('Enter your choice (1-4): ', async (answer) => {
    const choice = parseInt(answer, 10);
    
    if (choice >= 1 && choice <= platformOptions.length) {
      const platform = platformOptions[choice - 1].value;
      
      // 获取签名信息
      const signingInfo = await getSigningInfo();
      rl.close();
      
      // First ensure Next.js export build is completed
      console.log('Preparing Next.js export build...');
      try {
        execSync('npm run build:export', { stdio: 'inherit' });
        await buildFor(platform, signingInfo);
      } catch (error) {
        console.error('Error during Next.js build:', error.message);
      }
    } else {
      console.log('Invalid choice. Please enter a number between 1 and 4.');
      getPlatformChoice();
    }
  });
}

// Start the build process
getPlatformChoice(); 
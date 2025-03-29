#!/usr/bin/env node

const { execSync } = require('child_process');
const { platform } = require('os');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('OhMyGemini 快速构建工具');
console.log('=======================');
console.log('');

// 自动检测操作系统
const currentPlatform = platform();
let defaultTarget = 'windows';

switch (currentPlatform) {
  case 'win32':
    defaultTarget = 'windows';
    break;
  case 'darwin':
    defaultTarget = 'macos';
    break;
  case 'linux':
    defaultTarget = 'linux';
    break;
}

// 提示用户确认构建目标
rl.question(`检测到您正在 ${defaultTarget} 平台上。是否为此平台构建？(Y/n) `, (answer) => {
  const buildTarget = answer.toLowerCase() === 'n' ? null : defaultTarget;
  
  if (!buildTarget) {
    console.log('请选择要构建的平台：');
    console.log('1. Windows');
    console.log('2. macOS');
    console.log('3. Linux');
    console.log('4. 所有桌面平台');
    
    rl.question('请输入选项 (1-4): ', (choice) => {
      handlePlatformChoice(choice);
    });
  } else {
    console.log(`将为 ${buildTarget} 平台构建安装包...`);
    buildForPlatform(buildTarget);
    rl.close();
  }
});

function handlePlatformChoice(choice) {
  let target;
  
  switch (choice) {
    case '1':
      target = 'windows';
      break;
    case '2':
      target = 'macos';
      break;
    case '3':
      target = 'linux';
      break;
    case '4':
      target = 'desktop';
      break;
    default:
      console.log('无效的选择。请输入1-4之间的数字。');
      rl.question('请输入选项 (1-4): ', handlePlatformChoice);
      return;
  }
  
  buildForPlatform(target);
  rl.close();
}

function buildForPlatform(target) {
  try {
    console.log('正在构建 Next.js 应用...');
    execSync('npm run build:export', { stdio: 'inherit' });
    
    console.log(`正在为 ${target} 平台构建安装包...`);
    
    if (target === 'desktop') {
      console.log('构建所有桌面平台...');
      execSync('npm run tauri:build', { stdio: 'inherit' });
    } else {
      execSync(`npm run build:${target}`, { stdio: 'inherit' });
    }
    
    console.log('');
    console.log('✅ 构建成功完成！');
    console.log('');
    
    // 显示输出位置
    let outputPath = '';
    switch (target) {
      case 'windows':
        outputPath = 'src-tauri/target/release/bundle/msi/ 或 src-tauri/target/release/bundle/nsis/';
        break;
      case 'macos':
        outputPath = 'src-tauri/target/release/bundle/dmg/ 或 src-tauri/target/release/bundle/macos/';
        break;
      case 'linux':
        outputPath = 'src-tauri/target/release/bundle/deb/ 或 src-tauri/target/release/bundle/appimage/';
        break;
      case 'desktop':
        outputPath = 'src-tauri/target/release/bundle/';
        break;
    }
    
    console.log(`安装包已生成在: ${outputPath}`);
    console.log('');
    console.log('提示: 安装包可能会被杀毒软件误报为病毒，这是正常的。');
    console.log('      请参考 docs/SECURITY.md 文件了解更多信息。');
    
  } catch (error) {
    console.error('构建过程中出错:', error.message);
    process.exit(1);
  }
} 
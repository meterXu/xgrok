// obfuscate.js
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const {copyFolder} = require('./src/libs/util.js');

const sourceDir = path.resolve(__dirname, 'src'); // 源代码目录
const outputDir = path.resolve(__dirname, 'frame'); // 输出目录

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 读取源代码并混淆
copyFolder(sourceDir,outputDir,(oldPath,newPath)=>{
    const code = fs.readFileSync(oldPath, 'utf8');
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(code).getObfuscatedCode();
    // 写入混淆后的代码
    fs.writeFileSync(newPath, obfuscatedCode, 'utf8');
    console.log(`Obfuscated: ${oldPath}`);
})
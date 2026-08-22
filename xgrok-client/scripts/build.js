/**
 * 按 arch 拆分构建 electron 产物。
 *
 * 背景：electron-builder 的 files/asarUnpack 覆盖 execute 目录下全部文件，
 * 单次运行会把 execute/<os> 下所有 arch 的 xgrok-core 全部打进每个产物。
 * 这里从 package.json 的 build 配置读取目标 arch，逐 arch 构建，
 * 每次构建前把「非目标 arch」的 core 目录临时移走，构建完再恢复，
 * 从而保证每个 DMG/zip 只携带对应 arch 的 core。
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const buildConfig = pkg.build || {};

// 当前平台 → electron-builder 配置 key / 命令行参数 / execute 目录名
const platform = process.platform; // darwin | win32 | linux
const PLATFORM_CONFIG = {
  darwin: { key: 'mac', flag: '--mac' },
  win32: { key: 'win', flag: '--win' },
  linux: { key: 'linux', flag: '--linux' },
};
const platformConf = PLATFORM_CONFIG[platform];
if (!platformConf) {
  console.error(`[build] 不支持的平台: ${platform}`);
  process.exit(1);
}

// electron-builder 的 arch 名 → execute 目录名（与 src/project.js 的 getArch 保持一致）
const ARCH_DIR_MAP = {
  x64: 'amd64',
  arm64: 'arm64',
  mips64: 'mips64',
};

// electron-builder 的 arch 名 → CLI 布尔参数（electron-builder 26 不再提供 --arch <value>）
const ARCH_FLAG_MAP = {
  x64: '--x64',
  ia32: '--ia32',
  armv7l: '--armv7l',
  arm64: '--arm64',
  universal: '--universal',
};

// 从 build.<platform>.target[].arch 收集目标 arch（去重、保序）
function collectArchs(platformCfg) {
  if (!platformCfg) return [];
  const set = new Set();
  const add = (arch) => {
    if (!arch) return;
    if (Array.isArray(arch)) arch.forEach(add);
    else set.add(String(arch));
  };
  const target = platformCfg.target;
  if (Array.isArray(target)) {
    for (const t of target) {
      if (t && typeof t === 'object' && t.arch) add(t.arch);
    }
  }
  add(platformCfg.arch);
  return [...set];
}

const archs = collectArchs(buildConfig[platformConf.key]);
// 未配置 arch 时退回到当前机器 arch（一般即 x64 / arm64，与 electron-builder 命名一致）
const targetArchs = archs.length ? archs : [process.arch];

const executeRoot = path.join(root, 'execute', platform); // execute/<os>
const backupRoot = path.join(root, '.execute-backup');

// 清理上次异常中断可能残留的备份
if (fs.existsSync(backupRoot)) {
  for (const entry of fs.readdirSync(backupRoot)) {
    const dst = path.join(executeRoot, entry);
    if (!fs.existsSync(dst)) {
      fs.renameSync(path.join(backupRoot, entry), dst);
      console.log(`[build] 恢复上次残留备份: ${path.relative(root, dst)}`);
    }
  }
  fs.rmSync(backupRoot, { recursive: true, force: true });
}

// 把 execute/<os> 下除 keepDir 外的目录临时移出
function moveOtherArchDirs(keepDir) {
  const moved = [];
  if (!fs.existsSync(executeRoot)) return moved;
  for (const entry of fs.readdirSync(executeRoot)) {
    if (entry === keepDir) continue;
    const src = path.join(executeRoot, entry);
    if (!fs.statSync(src).isDirectory()) continue;
    const dst = path.join(backupRoot, entry);
    fs.mkdirSync(backupRoot, { recursive: true });
    fs.renameSync(src, dst);
    moved.push({ src, dst });
  }
  return moved;
}

// 把移走的目录恢复原状
function restoreArchDirs(moved) {
  for (const { src, dst } of moved) {
    if (fs.existsSync(dst)) fs.renameSync(dst, src);
  }
  if (fs.existsSync(backupRoot)) fs.rmSync(backupRoot, { recursive: true, force: true });
}

const electronBuilderBin = path.join(
  root,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'electron-builder.cmd' : 'electron-builder',
);

let failed = false;
for (const arch of targetArchs) {
  const archFlag = ARCH_FLAG_MAP[arch];
  if (!archFlag) {
    console.error(`[build] 不支持的 arch: ${arch}`);
    failed = true;
    break;
  }

  const dirArch = ARCH_DIR_MAP[arch] || arch;
  const keepPath = path.join(executeRoot, dirArch);
  console.log(`\n[build] 目标 arch=${arch}，对应 core 目录 execute/${platform}/${dirArch}`);

  if (!fs.existsSync(keepPath)) {
    console.warn(`[build] 警告: 未找到 ${path.relative(root, keepPath)}，该 arch 产物将不包含 core`);
  }

  const moved = moveOtherArchDirs(dirArch);
  if (moved.length) {
    console.log(`[build] 已临时移走: ${moved.map((m) => path.relative(executeRoot, m.dst)).join(', ')}`);
  }

  try {
    const res = spawnSync(electronBuilderBin, [platformConf.flag, archFlag], {
      stdio: 'inherit',
      cwd: root,
    });
    if (res.status !== 0) {
      console.error(`[build] arch=${arch} 构建失败 (exit ${res.status})`);
      failed = true;
      break;
    }
  } finally {
    restoreArchDirs(moved);
  }
}

if (failed) process.exit(1);
console.log('\n[build] 全部 arch 构建完成');

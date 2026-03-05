import fs from 'fs-extra';
import { execSync } from 'child_process';
import path from 'path'

async function buildProject() {
    const root = process.cwd();
    const clientPath = path.resolve(root, '../xgrok-client');
    const webPath = path.resolve(root, '../xgrok-client-web');

    try {
        console.log('正在清理 web 目录...');
        await fs.remove(path.join(root, 'web'));
        await fs.remove(path.join(root, 'conf/xgrok-core.log'));
        await fs.remove(path.join(root, 'conf/xgrokApp.json'));

        console.log('正在构建客户端...');
        execSync('npm run build:brower', { cwd: clientPath, stdio: 'inherit' });

        console.log('正在同步产物...');
        await fs.copy(
            path.join(clientPath, 'dist'),
            path.join(webPath, 'web'),
            { overwrite: true }
        );

        console.log('正在进行 Babel 转换...');
        await fs.remove(path.join(webPath, 'dist'));
        execSync('npx babel src -d dist', { cwd: webPath, stdio: 'inherit' });
        console.log('✨ 构建任务全部完成');
    } catch (err) {
        console.error('构建过程中出错:', err);
    }
}

buildProject();

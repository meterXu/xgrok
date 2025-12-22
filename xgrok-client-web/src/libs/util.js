import fs from "node:fs";
import path from "path";

export function copyFolder(src, dest, callback) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    let items = fs.readdirSync(src);
    items.forEach(item => {
        let oldPath = path.join(src, item);
        let newPath = path.join(dest, item);

        if (fs.statSync(oldPath).isDirectory()) {
            // 如果是文件夹，递归
            copyFolder(oldPath, newPath, callback);
        } else {
            // 如果是文件，拷贝
            if (path.extname(oldPath) === '.js') {
                callback && callback(oldPath, newPath)
            } else {
                fs.copyFileSync(oldPath, newPath);
            }
        }
    });
}

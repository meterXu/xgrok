import dotenv from 'dotenv'
import path from 'path'
dotenv.config({
    path: path.resolve(`.env.${(process.env.NODE_ENV||'development').trim()}`)
})
const baseApi = process.env.VITE_APP_baseApi
const oss = process.env.VITE_APP_oss
let _tmpVersion = null;
export function load({ fetch }) {
    const _version = async () => {
        if(!_tmpVersion){
            const res = await fetch(`${baseApi}/version/latest`);
            if (!res.ok) throw new Error('Failed to fetch version');
            const data = await res.json();
            _tmpVersion = data.tag_name?.replace(/^v/gi, '');
        }
        return _tmpVersion;
    };

    return {
        oss: oss,
        // 不加 await，触发 SvelteKit 服务端流式传输
        version: _version()
    };
}

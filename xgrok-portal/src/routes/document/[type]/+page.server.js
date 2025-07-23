import fs from 'fs'
import markdownit from 'markdown-it'
import {resolve} from 'path'

export function load({params}){
    const filePath = resolve(process.cwd(), process.env.NODE_ENV==='development'?'static':'client','doc',`${params.type}.md`)
    const data = fs.readFileSync(filePath, {encoding:'utf8'})
    const md = markdownit()
    const result = md.render(data);
    return {
        content:result
    };
}

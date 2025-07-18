import fs from 'fs'
import markdownit from 'markdown-it'

export function load({params}){
    const data = fs.readFileSync(`src/assets/doc/${params.type}.md`, {encoding:'utf8'})
    const md = markdownit()
    const result = md.render(data);
    return {
        content:result
    };
}
// place files you want to import through the `$lib` alias in this folder.
function getMarkDownContent(type){
    let converter = new showdown.Converter();
    return new Promise((resolve, reject) => {
        fetch(`./assets/doc/${type}.md`).then(response=>response.text()).then(res=>{
            resolve(converter.makeHtml(res))
        }).catch(err=>{
            reject(err)
        })
    })
}
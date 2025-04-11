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
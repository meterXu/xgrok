export function isEmpty(str){
    return str===null||str===undefined||str===''||str==='undefined'||str==='null'
}

export function getStoreValue(value){
    return isEmpty(value)?null:value
}

export function getLsValue(value){
    return isEmpty(value)?'':value
}
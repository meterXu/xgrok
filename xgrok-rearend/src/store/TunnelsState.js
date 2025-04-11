class Store{
    constructor() {
        this._store=new Map()
    }
    commit(key,data){
        this._store[key]=data
    }
    getters(key){
        return this._store[key]
    }
}

class ServiceItem{
    constructor() {
        this._name = null
        this._type = null
        this._error = null
    }

    get name(){
        return this._name
    }
    get type(){
        return this._type
    }
    get error(){
        return this._error
    }
    set name(value){
        this._name = value
    }
    set type(value){
        this._type = value
    }
    set error(value){
        this._error = value
    }



}


export default new Store()

function sign(){
    this.create=function(params,timestamp){
        let keys = Object.keys(params);
        let sortKeys = keys.sort(function (s1,s2) {
            if(s1>s2){
                return -1;
            }
            if(s1<s2){
                return 1;
            }
            return 0;
        });
        let paramStr='';
        sortKeys.forEach(k=>{
            paramStr+=params[k].toString();
        })
    }
}

function paramSortToStr() {
    
}

import {enums} from "@/utils/enums";

export function coverEnum(enumType,value){
    if(enums[enumType]){
        const entriesRes = Object.entries(enums[enumType])
        const findIndex =  entriesRes.findIndex(c=>c[1]===value)
        if(findIndex>-1){
            return entriesRes[findIndex][0]
        }else{
            return null
        }
    }else{
        return null
    }
}

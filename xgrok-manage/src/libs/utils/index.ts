import type {NotificationTypeEnum} from "../enum";
import {ElNotification} from 'element-plus';
import dayjs from "dayjs";
import type {ShallowReactive} from "vue";

export function showNotification(type: NotificationTypeEnum, message: string, title?: string | undefined) {
    ElNotification({
        type: type,
        title,
        message,
        position: 'bottom-right'
    })
}

export function useFormatDateTime(dateTime?: string): string | null {
    return dateTime ? dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss') : null
}

export function mappingDic(promiseArray: Promise<ResultType<any>>[], dest: ShallowReactive<DictItemType[]>[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let ress = await Promise.all(promiseArray)
            ress.forEach((res, index) => {
                if (res.success && res.data) {
                    dest[index].splice(0, dest[index].length, ...res.data.records)
                }
            })
            resolve(dest)
        } catch (e) {
            reject(e)
        }
    })
}

export function useFormatDic(dicData?: DictItemType[], code?: string): string {
    if (dicData && code) {
        return dicData.find(c => c.code === code)?.chn_value || ''
    } else {
        return ''
    }
}

export function EnumToArray(enumObj: object): DictItemType[] {
    return Object.entries(enumObj).map(([key, value]) => {
        return {
            key: key,
            code: value,
        } as DictItemType
    });
}

export function resetObj(obj:{[key:string]:any},defaultValue?:{[key:string]:any}):void{
    Object.keys(obj).forEach(key=>{
        if(obj[key] instanceof Array) {
            obj[key] = []
        }else{
            obj[key]=null
        }
    })
    Object.assign(obj,defaultValue)
}
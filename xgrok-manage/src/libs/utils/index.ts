import type {NotificationTypeEnum} from "../enum";
import {ElNotification} from 'element-plus';
import dayjs from "dayjs";
export function showNotification(type:NotificationTypeEnum,message:string,title?:string|undefined){
    ElNotification({
        type:type,
        title,
        message,
        position: 'bottom-right'
    })
}
export function useFormatDateTime(dateTime:string):string {
    return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
}

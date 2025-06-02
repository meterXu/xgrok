import type {NotificationTypeEnum} from "../enum";
import {ElNotification} from 'element-plus';
export function showNotification(type:NotificationTypeEnum,message:string,title?:string|undefined){
    ElNotification({
        type:type,
        title,
        message,
        position: 'bottom-right'
    })
}
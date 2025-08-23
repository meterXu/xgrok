import {getErrorText} from "xxweb-util";
import {ElMessageBox} from 'element-plus'
import {showNotification} from "@/libs/utils/message.ts";
import {appStore} from "@/store/index.ts";
import {NotificationTypeEnum} from "@/libs/enum";

const store = appStore()
export function dealWithError(error:any){
  try{
    let data = error.response?error.response.data:error;
    if(typeof(data)==="string"){
      if(data.indexOf("{")===0){
        data = JSON.parse(data);
      }else{
        data = {message:data}
      }
    }
    else {
      data.message = data.message||getErrorText(error.response.status)
    }
    if(error.response){
      switch (error.response.status){
        case 401:{
          showConfirm()
          break
        }
        default:
          showNotification(NotificationTypeEnum.error, data.message)
          break
      }
    }else{
      showNotification(NotificationTypeEnum.error, data.message)
    }
  }catch (error){}
  return error
}

function showConfirm (){
  ElMessageBox.confirm("很抱歉，登录已过期，请重新登录","登录已过期").then(()=>{
    store.setToken(null)
    store.setUserInfo(null)
    window.location.reload()
  }).catch(()=>{})
}

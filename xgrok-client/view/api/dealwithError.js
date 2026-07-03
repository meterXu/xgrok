import {getErrorText} from "xxweb-util";
import {alert} from "@/libs/common";
import { useAppStore } from '../store/index'
import {showNotification} from "@/libs/message";
import {NotificationType} from "@/libs/enums";

export async function dealWithError(error){
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
      data.message = (data.msg||data.message)||getErrorText(error.response.status)
    }
    if(error.response){
      switch (error.response.status){
        case 401:{
          showConfirm()
          break
        }
        default:
          showNotification(NotificationType.error,data.message||'网络错误')
          break
      }
    }else{
      showNotification(NotificationType.error,data.message||'网络错误')
    }
  }catch (err){}
  return error;
}

function showConfirm (){
  alert("很抱歉，登录已过期，请重新登录","登录已过期",{
    confirmButtonText:'我要重登',
    callback(){
      const store = useAppStore()
      store.setUserInfo(null)
      store.setToken(null)
      window.router.replace('/login')
    }
  })
}

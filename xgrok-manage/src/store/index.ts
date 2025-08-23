import {createPinia,defineStore} from "pinia";
import {ref,computed} from 'vue'
import {alterStoreValue, getLsValue, setLsValue,ACCESS_TOKEN,USER_INFO} from "xxweb-util";

export const useAppStore = defineStore('app', ()=>{
    const $ls = window.app.config.globalProperties.$ls
    let _userInfo = ref(null)
    let _token = ref(null)

    const userInfo = computed(()=>{
        _userInfo.value = alterStoreValue(getLsValue($ls.get(USER_INFO)))
        return _userInfo
    })
    const token = computed(()=>{
        _token.value = alterStoreValue(getLsValue($ls.get(ACCESS_TOKEN)))
        return _token
    })

    function setUserInfo(data:object){
        _userInfo.value = alterStoreValue(data)
        $ls.set(USER_INFO,setLsValue(data))

    }
    function setToken(data:string){
        _token.value=alterStoreValue(data)
        $ls.set(ACCESS_TOKEN,setLsValue(data))
    }
    return { token,userInfo,setUserInfo,setToken }
})

const pinia = createPinia()
export function appStore(){
    if(!self.appStore){
        self.appStore = useAppStore()
    }
    return self.appStore
}
export default pinia

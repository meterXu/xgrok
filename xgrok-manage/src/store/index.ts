import {createPinia,defineStore} from "pinia";
import {ref,computed} from 'vue'
import {alterStoreValue, getLsValue, setLsValue,ACCESS_TOKEN,USER_INFO,PERMISSION} from "xxweb-util";

export const useAppStore = defineStore('app', ()=>{
    const $ls = window.app.config.globalProperties.$ls
    const _userInfo = ref(null)
    const _token = ref(null)
    const _refreshToken = ref(null)

    const userInfo = computed(()=>{
        _userInfo.value = alterStoreValue(getLsValue($ls.get(USER_INFO)))
        return _userInfo
    })
    const token = computed(()=>{
        _token.value = alterStoreValue(getLsValue($ls.get(ACCESS_TOKEN)))
        return _token
    })
    const refreshToken = computed(()=>{
        _refreshToken.value = alterStoreValue(getLsValue($ls.get('refreshToken')))
        return _refreshToken
    })
    const permission = computed(()=>{
        return alterStoreValue(getLsValue($ls.get(PERMISSION)))
    })

    function setUserInfo(data:object){
        _userInfo.value = alterStoreValue(data)
        $ls.set(USER_INFO,setLsValue(data))

    }
    function setToken(data:string){
        _token.value=alterStoreValue(data)
        $ls.set(ACCESS_TOKEN,setLsValue(data))
    }
    function setRefreshToken(data:string){
        _refreshToken.value=alterStoreValue(data)
        $ls.set('refreshToken',setLsValue(data))
    }
    function setPermission(data:PermissionType[]){
        $ls.set(PERMISSION,setLsValue(data))
    }
    return { token,userInfo,permission,refreshToken,setUserInfo,setToken,setPermission,setRefreshToken}
})

const pinia = createPinia()
export function appStore(){
    if(!self.appStore){
        self.appStore = useAppStore()
    }
    return self.appStore
}
export default pinia

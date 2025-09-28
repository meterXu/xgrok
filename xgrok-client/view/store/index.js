import {createPinia,defineStore} from "pinia";
import {ref, computed, shallowReactive,shallowRef} from 'vue'
import {USER_INFO, ACCESS_TOKEN, setLsValue, getLsValue, alterStoreValue} from "xxweb-util";
import {payPlan} from "@/libs/enums";
import {$ss} from '@/libs/common'
import dayjs from 'dayjs'

export const useAppStore = defineStore('app', ()=>{
    const $ls = window.app.config.globalProperties.$ls
    const _userInfo = shallowRef(null)
    const _token = ref(null)
    const _pid = ref(null)
    const _selectedServer = shallowRef(null)
    const _clientId = ref(null)
    const _plan = reactive({})
    const _orderStatus = shallowReactive({orderId:null,isPaySuccess:null})
    const _tunnelForm = ref(null)
    const _userName= ref(null)
    const _configIsLock = ref(false)
    const _percentage = ref(0)
    const _headerBtnLoading=ref(false)
    const _systemInfo = shallowReactive({})
    const _appSetting = shallowReactive({
        theme: 'system',
        startAuto: true,
        exitInTaskBar: true,
        proxy: ''
    })

    //computed
    const userInfo = computed(()=>{
        if($ls.get(USER_INFO)){
            _userInfo.value = alterStoreValue(getLsValue($ls.get(USER_INFO)))
        }
        return _userInfo
    })
    const token = computed(()=>{
        if($ls.get(ACCESS_TOKEN)){
            _token.value = alterStoreValue(getLsValue($ls.get(ACCESS_TOKEN)))
        }
        return _token
    })
    const pid = computed(()=>{
        if($ss.get("pid")){
            _pid.value = alterStoreValue(getLsValue($ss.get("pid")))
        }
        return _pid
    })
    const selectedServer = computed(()=>{
        if($ls.get("selectedServer")){
            _selectedServer.value = alterStoreValue(getLsValue($ls.get("selectedServer")))
        }
        return _selectedServer
    })
    const clientId = computed(()=>{
        if($ls.get("clientId")){
            _clientId.value = alterStoreValue(getLsValue($ls.get("clientId")))
        }
        return _clientId
    })
    const plan = computed(()=>{
        if($ls.get("plan")){
            let value = alterStoreValue(getLsValue($ls.get("plan")))
            Object.keys(value).forEach(k=>{
                _plan[k] = value[k]
            })
        }
        if(_plan.hasOwnProperty('plan')){
            if(_plan.value===payPlan.free){
                _plan.plan.expired_time_str =  null
            }else{
                _plan.plan.expired_time_str  = dayjs(_plan.plan.expired_time).format('YYYY-MM-DD').toString()
            }
        }
        return _plan
    })
    const orderStatus = computed(()=>{
        return _orderStatus
    })
    const tunnelForm = computed(()=>{
        return _tunnelForm
    })
    const userName = computed(()=>{
        if($ls.get("username")){
            _userName.value = alterStoreValue(getLsValue($ls.get("username")))
        }
        return _userName
    })
    const configIsLock = computed(()=>{
        return _configIsLock
    })
    const isCloseEdit = computed(()=>{
        return Boolean(pid.value)&&configIsLock.value
    })
    const percentage = computed(()=>{
        if($ss.get("percentage")){
            _percentage.value = alterStoreValue(getLsValue($ss.get("percentage")))
        }
        return _percentage
    })
    const headerBtnLoading = computed(()=>{
        return _headerBtnLoading
    })
    const systemInfo = computed(()=>{
        return _systemInfo
    })
    const appSetting = computed(()=>{
        if($ls.get("appSetting")){
           Object.assign(_appSetting,alterStoreValue(getLsValue($ls.get("appSetting"))))
        }
        return _appSetting
    })

    //action
    function setUserInfo(data){
        _userInfo.value = data
        $ls.set(USER_INFO,setLsValue(data))
    }
    function setToken(data){
        _token.value=data?`Bearer ${data}`:null
        $ls.set(ACCESS_TOKEN,setLsValue(data?`Bearer ${data}`:null))
    }
    function setPid(data){
        _pid.value=data
        $ss.set("pid",setLsValue(data))
    }
    function setSelectedServer(data){
        _selectedServer.value = data
        $ls.set("selectedServer",setLsValue(data))
    }
    function setClientId(value){
        _clientId.value = value
        $ls.set("clientId",setLsValue(value))
    }
    function setPlan(value){
        Object.keys(value).forEach(k=>{
            _plan[k] = value[k]
        })
        $ls.set("plan",setLsValue(_plan))
    }
    function setOrderStatus(orderId,isPaySuccess){
        _orderStatus.orderId = orderId
        _orderStatus.isPaySuccess = isPaySuccess
    }
    function setUserName(data){
        _userName.value = data
        $ls.set('username',getLsValue(data))
    }
    function setConfigIsLock(data){
        _configIsLock.value=data
    }
    function setPercentage(data){
        _percentage.value = data
        $ss.set('percentage',getLsValue(data))
    }
    function setHeaderBtnLoading(data){
        _headerBtnLoading.value=data
    }
    function setSystemInfo(data){
        Object.assign(_systemInfo,data)
    }
    function setAppSetting(data){
        Object.assign(_appSetting,data)
        $ls.set("appSetting",setLsValue(data))
    }

    return {
        token,
        userInfo,
        pid,
        selectedServer,
        clientId,
        plan,
        orderStatus,
        tunnelForm,
        userName,
        configIsLock,
        isCloseEdit,
        percentage,
        headerBtnLoading,
        systemInfo,
        appSetting,
        setUserInfo,
        setToken,
        setPid,
        setSelectedServer,
        setClientId,
        setPlan,
        setOrderStatus,
        setUserName,
        setConfigIsLock,
        setPercentage,
        setHeaderBtnLoading,
        setSystemInfo,
        setAppSetting
    }
})
export default createPinia()

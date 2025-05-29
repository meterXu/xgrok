import {createPinia,defineStore} from "pinia";
import {ref, computed, shallowReactive,shallowRef} from 'vue'
import * as types from "xxweb-box/utils/mutation-types";
import {getStoreValue,getLsValue} from "../../src/libs/common"
import {payPlan} from "@/libs/enums";
import {$ss} from '@/libs/common'
import moment from 'moment'

export const useAppStore = defineStore('app', ()=>{
    const $ls = window.app.config.globalProperties.$ls
    const _userInfo = shallowRef(null)
    const _token = ref(null)
    const _pid = ref(null)
    const _selectedServer = shallowRef(null)
    const _clientId = ref(null)
    const _isDelete = shallowReactive({
        web:false,
        service:false
    })
    const _deleteIds = {
        web:ref([]),
        service:ref([])
    }
    const _dialogVisible = shallowReactive({
        web:false,
        service:false
    })
    const _plan = reactive({})
    const _orderStatus = shallowReactive({orderId:null,isPaySuccess:null})
    const _tunnelForm = ref(null)
    const _userName= ref(null)
    const _configIsLock = ref(false)
    const _percentage = ref(0)

    //computed
    const userInfo = computed(()=>{
        if($ls.get(types.USER_INFO)){
            _userInfo.value = JSON.parse($ls.get(types.USER_INFO))
        }
        return _userInfo
    })
    const token = computed(()=>{
        if($ls.get(types.ACCESS_TOKEN)){
            _token.value = $ls.get(types.ACCESS_TOKEN)
        }
        return _token
    })
    const pid = computed(()=>{
        if($ss.get("pid")){
            _pid.value = $ss.get("pid")
        }
        return _pid
    })
    const selectedServer = computed(()=>{
        if($ls.get("selectedServer")){
            _selectedServer.value = JSON.parse($ls.get("selectedServer"))
        }
        return _selectedServer
    })
    const isDelete = computed(()=>{
        return _isDelete
    })
    const deleteIds = computed(()=>{
        return _deleteIds
    })
    const dialogVisible = computed(()=>{
        return _dialogVisible
    })
    const clientId = computed(()=>{
        return _clientId
    })
    const plan = computed(()=>{
        if(_plan.hasOwnProperty('plan')){
            if(_plan.value===payPlan.free){
                _plan.plan.expired_time_str =  null
            }else{
                _plan.plan.expired_time_str  = new moment(_plan.plan.expired_time).format('YYYY-MM-DD').toString()
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
            _userName.value = $ls.get("username")
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
            _percentage.value = $ss.get("percentage")
        }
        return _percentage
    })

    //action
    function setUserInfo(data){
        _userInfo.value = getStoreValue(data)
        $ls.set(types.USER_INFO,_userInfo.value?JSON.stringify(data):getLsValue(data))

    }
    function setToken(data){
        if(getStoreValue(data)){
            _token.value="Bearer "+getStoreValue(data)
            $ls.set(types.ACCESS_TOKEN,"Bearer "+getLsValue(data))
        }else{
            _token.value=getStoreValue(data)
            $ls.set(types.ACCESS_TOKEN,getLsValue(data))
        }

    }
    function setPid(data){
        _pid.value=getStoreValue(data)
        $ss.set("pid",getLsValue(data))
    }
    function setSelectedServer(data){
        _selectedServer.value = data
        $ls.set("selectedServer",JSON.stringify(getLsValue(data)))
    }
    function setIsDelete(type,value){
        _isDelete[type]=value
    }
    function setDeleteIds(type,value){
        _deleteIds[type].value=value
    }
    function setDialogVisible(type,value){
        _dialogVisible[type]=value
    }
    function setIsDeleteAll(value){
        _isDelete.web=value
        _isDelete.service=value
    }
    function setDeleteIdsAll(value){
        _deleteIds.web.value=value
        _deleteIds.service.value=value
    }
    function setClientId(value){
        _clientId.value = value
    }
    function setPlan(value){
        Object.keys(value).forEach(k=>{
            _plan[k] = value[k]
        })
    }
    function setOrderStatus(orderId,isPaySuccess){
        _orderStatus.orderId = orderId
        _orderStatus.isPaySuccess = isPaySuccess
    }
    function setTunnelForm(value){
        _tunnelForm.value = value
    }
    function setUserName(data){
        _userName.value = getStoreValue(data)
        $ls.set('username',getLsValue(data))
    }
    function setConfigIsLock(data){
        _configIsLock.value=data
    }
    function setPercentage(data){
        _percentage.value = getStoreValue(data)
        $ss.set('percentage',getLsValue(data))
    }

    return {
        token,
        userInfo,
        pid,
        selectedServer,
        isDelete,
        deleteIds,
        dialogVisible,
        clientId,
        plan,
        orderStatus,
        tunnelForm,
        userName,
        configIsLock,
        isCloseEdit,
        percentage,
        setUserInfo,
        setToken,
        setPid,
        setSelectedServer,
        setIsDelete,
        setDeleteIds,
        setDialogVisible,
        setIsDeleteAll,
        setDeleteIdsAll,
        setClientId,
        setPlan,
        setOrderStatus,
        setTunnelForm,
        setUserName,
        setConfigIsLock,
        setPercentage
    }
})
export default createPinia()

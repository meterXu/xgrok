<script setup>
import {computed, defineProps, onUnmounted, ref, watchEffect} from 'vue'
import {detailProduct, createOrder, checkOrder, queryPayPlan} from '@/api'
import QRious from 'qrious'
import {useRouter} from "vue-router";
import {useAppStore} from "@/store";
import {NotificationType, useSysPayStatusToPayRes} from "@/libs/enums";
import {confirm} from "@/libs/common";
import {showNotification} from "@/libs/message";
import {useDonationAgreementUrl,onOpenLink} from "@/libs/useAction";

const props = defineProps(['productId','payNum'])
const qrcodeImg = ref(null)
const orderId = ref(null)
const _productName = ref(null)
const _price = ref(null)
const router = useRouter()
const payRes = ref(null)
const store = useAppStore()
const {orderStatus} = store
const paySuccessTimerNum = ref(5)
const donationAgreement = ref(true)
let paySuccessTimer = null

const productName = computed(()=>{
  if(props.payNum>1){
    return `【${_productName.value}×${props.payNum}】`
  }else{
    return `【${_productName.value}】`
  }
})
const closeBtn = computed(()=>{
  switch(payRes.value){
    case null:{
      return {
        type:'info',
        text:'我暂时不想捐赠'
      }
    }
    case true:{
      return {
        type:'success',
        text:`捐赠成功，(${paySuccessTimerNum.value}s)自动返回`
      }
    }
    case false:{
      return {
        type:'danger',
        text:'捐赠失败，点我返回'
      }
    }
  }
})

watchEffect(()=>{
  if(orderId.value===orderStatus.orderId){
    payRes.value = orderStatus.isPaySuccess
    if(orderStatus.isPaySuccess){
      clearInterval(paySuccessTimer)
      paySuccessTimer = setInterval(()=>{
        paySuccessTimerNum.value--
        if(paySuccessTimerNum.value===0){
          router.replace({name:'Dashboard'})
        }
      },1000)
    }
  }
})

function created(){
  detailProduct(props.productId).then(res=>{
    if(res.success){
      _productName.value = res.data.name
      _price.value = res.data.price
    }
  })
  createOrder(props.productId,props.payNum).then(res=>{
    if(res.success){
      orderId.value = res.data.id
      qrcodeImg.value = new QRious({
        value: res.data.qrCode,
        size: 400
      }).toDataURL('image/jpeg');
    }
  })
}
function finishOrder(){
  if(payRes.value===null){
    checkOrder(orderId.value).then(res=>{
      if(res.success){
        payRes.value = useSysPayStatusToPayRes(res.data)
        if(payRes.value===null){
          showNotification(NotificationType.info,'未进行支付，请支付后再点击检查')
        }else {
          store.setOrderStatus(orderId.value,payRes.value)
          queryPayPlan().then(res=>{
            if(res.success){
              store.setPlan(res.data)
            }
          })
        }
      }else{
        showNotification(NotificationType.warning,'检查出错了')
      }
    })
  }
}
function closeOrder(){
  if(payRes.value===true){
    router.replace({name:'Dashboard'})
  }else if(payRes.value===false){
    router.replace({name:'Plan'})
  }else{
    confirm('确定要不捐赠了吗？',null,{
      confirmButtonText:'不，还想捐赠',
      cancelButtonText:'是的，不捐赠',
      cancelButtonClass:'el-button--danger is-plain'
    }).then(()=>{}).catch(()=>{
      router.replace({name:'Plan'})
    })
  }
}

created()
onUnmounted(()=>{
  paySuccessTimer&&clearInterval(paySuccessTimer)
})

</script>

<template>
  <div class="order-wrap">
    <div class="qr-wrap" :class="{'qr-warp-blur':!donationAgreement}">
      <div id="qrcode" class="qr-img" :class="{'qr-img-ok':payRes===true,'qr-img-error':payRes===false}"
           v-loading="!qrcodeImg" element-loading-custom-class="qr-loading">
        <div class="qr-img-wrap">
          <template v-if="qrcodeImg">
            <img :src="qrcodeImg" alt="qrcode">
            <div class="alipay-icon">
              <img src="../../assets/imgs/alipay.svg" alt="alipay"/>
            </div>
          </template>
        </div>
        <div v-if="qrcodeImg" class="qr-remark text-[14px]">
          打开支付宝【扫一扫】
        </div>
        <el-result
            class="pay-result"
            :icon="payRes?'success':'error'"
            :title="payRes?'支付成功':'支付失败'"
            :sub-title="payRes?'谢谢惠顾':'支付超时或其他问题'">
        </el-result>
      </div>
    </div>
    <div class="qr-title">
      {{productName}}￥{{_price}}
    </div>
    <el-checkbox v-model="donationAgreement">
      我已阅读并同意
      <a class="link" href="javascript:;" @click="onOpenLink(useDonationAgreementUrl())">捐赠须知</a>
    </el-checkbox>
    <div class="order-remark">
      <el-alert :closable="false">
        <ul class="remark-ul">
          <li>
            请仔细阅读《捐赠须知》！
          </li>
          <li>
            请在5分之内完成捐赠，过期后，此捐赠通道将会关闭！
          </li>
          <li>
            捐赠不支持7天无理由退款！
          </li>
          <li>
            若捐赠失败，请带上支付截图发送邮件至<a href="mailto:xgrok@xdog.icu">xgrok@xdog.icu</a>。
          </li>
        </ul>
      </el-alert>
    </div>
    <div class="btn-list">
      <div class="btn-item">
        <el-button size="default" v-show="payRes===null" type="success" @click="finishOrder" plain>
          我已完成了付款
        </el-button>
      </div>
      <div class="btn-item">
        <el-button size="default" :type="closeBtn.type" @click="closeOrder" plain>
          {{closeBtn.text}}
        </el-button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.order-wrap{
  position: absolute;
  left:50%;
  top: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
  .link{
    text-decoration: underline;
    color: var(--el-color-success);
  }
}
.qr-wrap{
  display: inline-block;
  border: 4px solid var(--el-border-color);
  box-sizing: border-box;
  position: relative;
  border-radius: 4px;
  text-align: center;
  padding: 12px;
}
.qr-warp-blur{
  &:after{
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    backdrop-filter: blur(5px);
  }
}
.qr-remark{
  margin-top: 12px;
  color: #0082FF;
}
.qr-img-wrap{
  width: 200px;
  height: 200px;
  position: relative;
  display: inline-block;
}
.qr-img{
  display: inline-block;
  width: 100%;
  height: 100%;
  img{
    border-radius: 4px;
    width: 100%;
    object-fit: contain;
  }
  .pay-result{
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%,-50%);
    z-index: 2;
    padding: 0;
  }
  &::after{
    display: none;
    content: '';
    backdrop-filter: blur(3px);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
.alipay-icon{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  img{
    box-sizing: content-box;
    width: 40px;
    object-fit: contain;
    border: 4px solid #fff;
  }
}
.qr-img-ok,.qr-img-error{
  .pay-result{
    display: block;
    animation: result-show .3s ease-in 1 forwards;
  }
  &::after{
    display: block;
    animation: overlay-show .3s ease-in 1 forwards;
  }
}
.qr-title{
  margin-top: 12px;
  font-size:20px;
  font-weight: 600;
  text-align: center;
}
.order-remark{
  margin-top: 12px;
  text-align: center;
}
.remark-ul{
  text-align: left;
  list-style: disc inside;
}
.btn-list{
  margin-top: 24px;
  display: flex;
  align-items: center;
  flex-flow: column;
  justify-content: center;
  grid-gap: 8px;
}
.btn-item{
  height: 32px;
}
@keyframes overlay-show{
  from{
    background-color: rgba(255,255,255,0);
  }
  to{
    background-color: rgba(255,255,255,0.8);
  }
}
@keyframes result-show{
  from{
    opacity: 0;
  }
  to{
    opacity: 1;
  }
}
</style>
<style lang="less">
.qr-loading{
  .el-loading-spinner .path{
    stroke: var(--el-border-color);;
  }
  background-color: transparent !important;
}
.pay-result{
  .el-result__icon{
    display: flex;
    justify-content: center;
  }
  .el-result__title,.el-result__subtitle{
    p{
      font-weight: bold;
      color: var(--pay-result-text);
    }
  }
}
.close-messageBox-confirm{
  width: 280px;
  .el-message-box__header{
    padding-top: 12px;
  }
  .el-message-box__title{
    font-size: 48px;
  }
  .el-message-box__btns{
    padding-top: 24px;
    padding-bottom: 12px;
  }
}
</style>

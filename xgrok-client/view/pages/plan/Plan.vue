<script setup>
import {queryProduct} from '@/api'
import {ref,onMounted} from "vue";
import {SuccessFilled} from '@element-plus/icons-vue'
import {useAppStore} from "@/store";
import {useRouter} from "vue-router";
import moment from 'moment'
import {payType} from "@/libs/enums";

const store = useAppStore()
const {plan} = store
let productList = ref([])
const router = useRouter()
const showWillPlan = ref(false)
const willPlanExpiredTime = ref(null)

onMounted(()=>{
  queryProduct().then(res=>{
    if(res.success){
      productList.value = res.data.records
      productList.value.splice(1,0,{
        isInfoCard:true
      })
    }
  })
})

function subscribe(productId){
  router.push({name:'Order',params:{productId:productId,payNum:1}})
}

function onWillPlanEnter(item){
  showWillPlan.value = plan.plan.type!==payType.free&&item.type!== payType.free;
  if(showWillPlan.value)
    onWillPlanExpiredTime(item)
}

function onWillPlanLeave(){
  showWillPlan.value = false
}

function onWillPlanExpiredTime(item){
  let expired_time = plan.plan.expired_time
  switch (item.type){
    case payType.month:{
      willPlanExpiredTime.value = new moment(expired_time).add(1,'month').format('yyyy-MM-DD').toString()
    }break
    case payType.quarter:{
      willPlanExpiredTime.value = new moment(expired_time).add(3,'month').format('yyyy-MM-DD').toString()
    }break
    case payType.year:{
      willPlanExpiredTime.value = new moment(expired_time).add(1,'year').format('yyyy-MM-DD').toString()
    }break
  }

}

</script>

<template>
  <div class="text-center">
    <div class="inline-block">
      <div class="mt-8 grid grid-cols-6 gap-18 p-12">
        <template v-for="(item,index) in productList" :key="item.id">
          <el-card v-if="item.isInfoCard" class="col-start-4 col-span-3 cursor-pointer m-[-1px] box-content border hover:border-(--el-color-success)! product-card product-card-info">
            <template #header>
              <div class="text-[14px] font-bold">
                <span>订阅信息</span>
              </div>
            </template>
            <div class="p-[0_20px_0px_20px]">
              <el-descriptions class="mt-24 my-descriptions" :column="1">
                <el-descriptions-item label="当前订阅：">{{plan?.plan.name}}</el-descriptions-item>
                <el-descriptions-item label="到期日期：">{{plan?.plan.expired_time_str||'-'}}</el-descriptions-item>
                <el-descriptions-item v-if="showWillPlan" label="将延长至：">{{willPlanExpiredTime}}</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
          <el-card v-else class="cursor-pointer min-w-240 m-[-1px] box-content border hover:border-(--el-color-success)! product-card"
                   :class="{'product-card-active':item.type===plan?.plan?.type,'col-start-1 col-span-3':index===0,'col-span-2':index!==0}">
            <template #header>
              <div class="font-bold text-[14px]">
                <span>{{item.name}}</span>
              </div>
            </template>
            <div class="text-[24px] font-600 bg-[#e9ecef] px-20 py-8" v-if="item.type!==0">
              <span class="relative">{{item.price}}</span>
            </div>
            <div class="p-[0_20px_20px_20px]">
              <ul class="mt-24! flex flex-col items-start justify-start gap-8">
                <li class="flex flex-row items-center justify-start gap-4 text-[14px]" v-for="remark in item.remark.split('\n')">
                  <el-icon class="text-(--el-color-success)!" size="18">
                    <SuccessFilled v-if="item.type===0"/>
                    <i-icon-park-outline-lightning v-else/>
                  </el-icon>
                  <span>{{remark}}</span>
                </li>
              </ul>
            </div>
            <template v-if="item.type!==0" #footer>
              <el-button type="success" plain @click="subscribe(item.id)" @mouseenter="onWillPlanEnter(item)" @mouseleave="onWillPlanLeave">
                <template #icon>
                  <i-icon-park-outline-hand-right/>
                </template>
                {{plan.value===0?'立即订阅':'延长订阅'}}
              </el-button>
            </template>
          </el-card>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.product-card-active{
  position: relative;
  margin: -4px !important;
  border: 4px solid var(--el-color-success);
  &::after{
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 36px;
    height: 36px;
    background-color: var(--el-color-success);
    border-bottom-left-radius: 4px;
    background-image: url(../../assets/check-white.svg);
    background-repeat: no-repeat;
    background-size: 20px;
    background-position: center center;
  }
}
.price{
  span::before{
    position: absolute;
    content: '¥';
    left: -24px;
  }
}
</style>
<style lang="less">
.product-card{
  .el-card__header{
    --el-card-padding:12px;
  }
  .el-card__footer{
    padding: 6px;
  }
  .el-card__body{
    padding: 0;
  }
}
.product-card-info{
  .el-card__footer{
    height: 120px;
    align-items: center;
    display: flex;
    justify-content: center;
  }
}
.my-descriptions{
  .el-descriptions__table{
    width: fit-content;
    margin: 0 auto;
    .el-descriptions__cell{
      padding-bottom: 8px!important;
    }
    .el-descriptions__label,.el-descriptions__content{
      font-size: 14px;
    }
  }
}
</style>
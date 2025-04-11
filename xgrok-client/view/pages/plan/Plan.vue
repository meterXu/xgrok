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
  <div style="text-align: center">
    <div style="display: inline-block">
      <div class="product-ul">
        <template v-for="(item) in productList" :key="item.id">
          <el-card v-if="item.isInfoCard" class="product-card product-card-info">
            <template #header>
              <div class="card-header" :class="`card-header-0`">
                <span>订阅信息</span>
              </div>
            </template>
            <template #footer>
              <el-descriptions class="my-descriptions" :column="1">
                <el-descriptions-item labelClassName="my-label" contentClassName="my-content" label="当前订阅：">{{plan?.plan.name}}</el-descriptions-item>
                <el-descriptions-item labelClassName="my-label" contentClassName="my-content" label="到期日期：">{{plan?.plan.expired_time_str||'-'}}</el-descriptions-item>
                <el-descriptions-item v-if="showWillPlan" labelClassName="my-label" contentClassName="my-content" label="将延长至：">{{willPlanExpiredTime}}</el-descriptions-item>
              </el-descriptions>
            </template>
          </el-card>
          <el-card v-else class="product-card" :class="{'product-card-active':item.type===plan?.plan?.type}">
            <template #header>
              <div class="card-header" :class="`card-header-${item.type}`">
                <span>{{item.name}}</span>
              </div>
            </template>
            <div class="price" v-if="item.type!==0">
              <span>{{item.price}}</span>
            </div>
            <div class="remark">
              <ul class="remark-content-ul">
                <li v-for="remark in item.remark.split('\n')">
                  <el-icon class="line-icon" size="18"><SuccessFilled/></el-icon>
                  <span>{{remark}}</span>
                </li>
              </ul>
            </div>
            <template v-if="item.type!==0" #footer>
              <el-button type="success" plain @click="subscribe(item.id)" @mouseenter="onWillPlanEnter(item)" @mouseleave="onWillPlanLeave">
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
.product-ul{
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(3,  240px);
  grid-template-rows: auto 1fr;
  grid-gap: 18px 24px;
  padding: 12px;
  .product-card{
    width: 240px;
    cursor: pointer;
    margin: -1px;
    box-sizing: content-box;
    &:hover{
      border-color: var(--el-color-success);
    }
  }
  .product-card:nth-child(2){
    width: 100%;
    grid-column: 2 / span 2;
  }
}
.product-card-active{
  position: relative;
  margin: -4px !important;
  border: 4px solid var(--el-color-success);
  &::after{
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    background-color: var(--el-color-success);
    border-bottom-left-radius: 4px;
    background-image: url(../../assets/check-white.svg);
    background-repeat: no-repeat;
    background-size: 20px;
    background-position: center center;
  }
}
.card-header-1,.card-header-2,.card-header-3{
  font-weight: bold;
}
.price{
  font-size: 36px;
  font-weight: 600;
  background-color: #e9ecef;
  padding: 12px 20px;
  span{
    position:relative;
  }
  span::before{
    position: absolute;
    content: '¥';
    left: -24px;
  }
}
.remark{
  padding: 0 20px 20px 20px;
}
.remark-content-ul{
  margin-top: 24px;
  .line-icon{
    color: var(--el-color-success);
  }
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-flow: column;
  grid-gap: 8px;
  li{
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    align-items: center;
    grid-gap: 4px;
  }
}
</style>
<style lang="less">
.product-card{
  .el-card__footer{
    padding: 12px;
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
  .el-descriptions__cell{
    font-size: 18px !important;
    padding-bottom: 0!important;
    height: 32px;
    line-height: 32px;
  }
}
</style>
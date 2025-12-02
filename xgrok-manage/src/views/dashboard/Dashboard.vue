<script setup lang="ts">
import {reactive, ref} from "vue";
import dayjs from "dayjs";
import {numberStatistics} from "@/api";
import {useTransition} from '@vueuse/core'
import 'dayjs/locale/zh-cn';
import SalesVolume from "@/views/dashboard/module/SalesVolume.vue";
import ProductSales from "@/views/dashboard/module/ProductSales.vue";
import UserOrderTop from "@/views/dashboard/module/UserOrderTop.vue";
import UserTunnelTop from "@/views/dashboard/module/UserTunnelTop.vue";
import TunnelUsage from "@/views/dashboard/module/TunnelUsage.vue";
import ServerUsage from "@/views/dashboard/module/ServerUsage.vue";
import {debounce} from "lodash-es";

dayjs.locale('zh-cn');

const statisticsData = {
  allOrder: ref(0),
  allUsers: ref(0),
  allSales: ref(0),
  numberOfNewOrders: ref(0),
  numberOfNewUsers: ref(0),
  salesVolume: ref(0)
}
const defaultDate = [
  dayjs().startOf('year').toDate(),
  dayjs().endOf('year').toDate()
]
const searchForm = reactive<{ type: string, tunnelType: string, dateRange: Date[] }>({
  type: 'month',
  tunnelType: 'web',
  dateRange: [
    defaultDate[0],
    defaultDate[1]
  ],
})

function onCurrentTimeChange(value:string){
  searchForm.dateRange[0] = dayjs().startOf(value.replace('current','').toLowerCase() as dayjs.OpUnitType).toDate()
  searchForm.dateRange[1] = dayjs().endOf(value.replace('current','').toLowerCase() as dayjs.OpUnitType).toDate()
  debounceLoadData()
}

async function loadData() {
  numberStatistics(searchForm.dateRange[0].valueOf(), searchForm.dateRange[1].valueOf()).then(res => {
    statisticsData.numberOfNewOrders.value = res.data.newData.order_count
    statisticsData.numberOfNewUsers.value = res.data.newData.user_count
    statisticsData.salesVolume.value = res.data.newData.sales_volume
    statisticsData.allOrder.value = res.data.totalData.order_count
    statisticsData.allUsers.value = res.data.totalData.user_count
    statisticsData.allSales.value = res.data.totalData.sales_volume
  })
}

const debounceLoadData = debounce(() => {
  loadData()
}, 500)

debounceLoadData()
const numberOfNewOrdersRef = useTransition(statisticsData.numberOfNewOrders, {duration: 1000})
const numberOfNewUsersRef = useTransition(statisticsData.numberOfNewUsers, {duration: 1000})
const salesVolumeRef = useTransition(statisticsData.salesVolume, {duration: 1000})

</script>
<template>
  <div class="h-full flex flex-col gap-24">
    <div class="flex flex-col md:flex-row gap-12 items-center">
      <el-radio-group v-model="searchForm.type" @change="debounceLoadData">
        <el-radio-button label="按年" value="year"/>
        <el-radio-button label="按月" value="month"/>
        <el-radio-button label="按周" value="week"/>
      </el-radio-group>
      <el-radio-group @change="onCurrentTimeChange">
        <el-radio-button label="本年" value="currentYear"></el-radio-button>
        <el-radio-button label="本月" value="currentMonth"></el-radio-button>
        <el-radio-button label="本周" value="currentWeek"></el-radio-button>
      </el-radio-group>
      <div>
        <el-date-picker type="daterange"
                        @change="loadData"
                        v-model="searchForm.dateRange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :default-time="defaultDate">
        </el-date-picker>
      </div>
    </div>
    <div class="flex-1 md:flex md:flex-col md:gap-24 overflow-auto">
      <el-card>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
            <el-statistic title="全部 / 新增订单数" :value="numberOfNewOrdersRef">
              <template #prefix>
                {{ statisticsData.allOrder }} /
              </template>
            </el-statistic>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
            <el-statistic title="全部 / 新增用户数" :value="numberOfNewUsersRef">
              <template #prefix>
                {{ statisticsData.allUsers }} /
              </template>
            </el-statistic>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
            <el-statistic title="全部 / 总销售额" :value="salesVolumeRef">
              <template #prefix>
                {{ statisticsData.allSales }} /
              </template>
            </el-statistic>
          </el-col>
        </el-row>
      </el-card>
      <div class="md:flex-1 md:flex md:flex-col md:gap-24 md:mt-0 mt-24">
        <el-card class="md:flex-1/2" body-class="p-0 h-full relative">
          <div class="w-full h-full grid gap-48 md:gap-24 grid-cols-1 md:grid-cols-3">
            <SalesVolume class="min-h-300 md:min-h-0" v-bind="searchForm"/>
            <ProductSales class="min-h-300 md:min-h-0" v-bind="searchForm"></ProductSales>
            <UserOrderTop class="min-h-300 md:min-h-0" v-bind="searchForm"></UserOrderTop>
          </div>
        </el-card>
        <el-card class="md:flex-1/2 mt-24 md:mt-0" body-class="h-full relative">
          <el-radio-group v-model="searchForm.tunnelType" size="small"
                          class="absolute z-1 left-[50%] -translate-x-[50%] md:left-20 md:translate-x-0">
            <el-radio-button label="网页隧道" value="web"/>
            <el-radio-button label="服务隧道" value="service"/>
          </el-radio-group>
          <div class="w-full h-full grid gap-48 md:gap-24 grid-cols-1 md:grid-cols-3 mt-48 md:mt-0 gap-24">
            <UserTunnelTop class="min-h-300 md:min-h-0" v-bind="searchForm"></UserTunnelTop>
            <TunnelUsage class="min-h-300 md:min-h-0" v-bind="searchForm"></TunnelUsage>
            <ServerUsage class="min-h-300 md:min-h-0" v-bind="searchForm"></ServerUsage>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style lang="less">
</style>

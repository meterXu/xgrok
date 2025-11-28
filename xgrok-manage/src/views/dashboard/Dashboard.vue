<script setup lang="ts">
import {reactive, ref} from "vue";
import dayjs from "dayjs";
import {numberStatistics} from "@/api";
import {useTransition} from '@vueuse/core'
import 'dayjs/locale/zh-cn';
import SalesVolumeStatistics from "@/views/dashboard/module/SalesVolumeStatistics.vue";

dayjs.locale('zh-cn');

const statisticsData = {
  numberOfNewOrders: ref(0),
  numberOfNewUsers: ref(0),
  salesVolume: ref(0)
}
const defaultDate = [
  dayjs().startOf('week').toDate(),
  dayjs().endOf('week').toDate()
]
const searchForm = reactive<{ type: string, dateRange: Date[] }>({
  type: 'week',
  dateRange: [
    defaultDate[0],
    defaultDate[1]
  ],
})

function onTypeChange(value: dayjs.OpUnitType) {
  searchForm.dateRange = [
    dayjs().startOf(value).toDate(),
    dayjs().endOf(value).toDate()
  ]
  loadData()
}

async function loadData() {
  numberStatistics(searchForm.dateRange[0].valueOf(), searchForm.dateRange[1].valueOf()).then(res => {
    statisticsData.numberOfNewOrders.value = res.data.newData.order_count as number
    statisticsData.numberOfNewUsers.value = res.data.newData.user_count as number
    statisticsData.salesVolume.value = res.data.newData.sales_volume as number
  })
}

loadData()
const numberOfNewOrdersRef = useTransition(statisticsData.numberOfNewOrders, {duration: 1000})
const numberOfNewUsersRef = useTransition(statisticsData.numberOfNewUsers, {duration: 1000})
const salesVolumeRef = useTransition(statisticsData.salesVolume, {duration: 1000})
</script>

<template>
  <div class="h-full flex flex-col gap-24">
    <div class="flex flex-row gap-12 items-center">
      <el-radio-group v-model="searchForm.type" @change="onTypeChange">
        <el-radio-button label="按年" value="year"/>
        <el-radio-button label="按月" value="month"/>
        <el-radio-button label="按周" value="week"/>
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
    <el-card>
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
          <el-statistic title="新增订单数" :value="numberOfNewOrdersRef"/>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
          <el-statistic title="新增用户数" :value="numberOfNewUsersRef">
          </el-statistic>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
          <el-statistic title="总销售额" :value="salesVolumeRef"/>
        </el-col>
      </el-row>
    </el-card>
    <div class="flex-1 flex flex-col gap-24">
      <el-card class="flex-1/2 my-card">
        <div class="h-full grid grid-cols-3 gap-24">
          <div class="relative">
            <SalesVolumeStatistics v-bind="searchForm"/>
          </div>
          <div>

          </div>
          <div>

          </div>
        </div>
      </el-card>
      <el-card class="flex-1/2">
        <div class="grid grid-cols-3 gap-24">
          <div>用户隧道数top 10</div>
          <div>隧道使用分布图</div>
          <div>服务器使用分布图</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="less">
.my-card{
.el-card__body{
  padding: 0;
  height: 100%;
}
}
</style>
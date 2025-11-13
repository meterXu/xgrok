<script setup lang="ts">
import {shallowReactive, shallowRef} from "vue";
const defaultDate = shallowRef<[Date,Date]>([
    new Date(2000,1,1,0,0,0),
    new Date(2000,2,1,23,59,59)
])
const searchForm=shallowReactive<{type:string,dateRange?:[]}>({
  type:'year',
  dateRange:[],
})
</script>

<template>
  <div class="h-full flex flex-col gap-24">
    <div class="flex flex-row gap-12 items-center">
      <el-radio-group v-model="searchForm.type">
        <el-radio-button label="按年" value="year" />
        <el-radio-button label="按月" value="month" />
        <el-radio-button label="按周" value="week" />
      </el-radio-group>
      <div>
        <el-date-picker type="daterange"
                        v-model="searchForm.dateRange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        :default-time="defaultDate"
                        end-placeholder="结束日期"></el-date-picker>
      </div>
    </div>
    <el-card>
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
          <el-statistic title="新增订单数" :value="268500" />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
          <el-statistic title="新增用户数" :value="138">
          </el-statistic>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
          <el-statistic title="总销售额" :value="333"/>
        </el-col>
      </el-row>
    </el-card>
    <div class="flex-1 flex flex-col gap-24">
      <el-card class="flex-1/2">
        <div class="grid grid-cols-3 gap-24">
          <div>图表1</div>
          <div>图表2</div>
          <div>图表3</div>
        </div>
      </el-card>
      <el-card class="flex-1/2">
        <div class="grid grid-cols-3 gap-24">
          <div>图表1</div>
          <div>图表2</div>
          <div>图表3</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
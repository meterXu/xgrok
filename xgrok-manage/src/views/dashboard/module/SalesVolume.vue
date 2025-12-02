<script setup lang="ts">
import {onMounted, onUnmounted, useTemplateRef, watchEffect} from "vue";
import * as echarts from 'echarts/core';
import {salesVolumeStatistics} from "@/api";
import {TitleComponent, TooltipComponent, GridComponent} from 'echarts/components';
import {LineChart} from 'echarts/charts';
import {UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import themes from '@/libs/utils/echarts-theme.ts'
import {debounce} from 'lodash-es'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

const props = defineProps<{
  dateRange: Date[],
  type: string
}>()
const option = Object.assign({
  title: {
    text: '销售额',
    top:0,
    textStyle: {
      fontSize: '12px',
      fontWeight: 'normal',
      color: '#606266'
    }
  },
  grid:{
    bottom:0
  },
  tooltip: {
    trigger: 'item',
    formatter(params: any) {
      return `<div style="display: flex; align-items: center;gap:4rem">
                <span>
                    <span style="display: inline-block;width: 2.5rem; height: 2.5rem; border-radius: 50%;background-color:${params.color}"></span>
                    ${params.name}
                </span>
                <strong>¥${params.value}</strong>
               </div>
              `;
    }
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'line',
      label: {
        show: true,
        formatter: '¥{c}',
        rich: {
          c: {
            fontWeight: 'bold'
          }
        }
      }
    }
  ]
}, themes)
const chartRef = useTemplateRef('chartRef')
let myChart = null as any

function initChart(startDate:number,endDate:number,type:string) {
  loadData(startDate,endDate,type).then(resOption => {
    myChart.setOption(resOption)
  })
}

const debounceInitChart = debounce((startDate:number,endDate:number,type:string)=>{
  initChart(startDate,endDate,type)
},500)


function loadData(startDate:number,endDate:number,type:string) {
  return new Promise((resolve, reject) => {
    salesVolumeStatistics(startDate,endDate,type).then(res => {
      if (props.type === 'week') {
        option.xAxis.data = res.data.map((d: any) => {
          return `${d.year.toString().substring(2)}年${d.week}周`
        })
      } else if(props.type==='month'){
        option.xAxis.data = res.data.map((d: any) => {
          return d[props.type]+'月'
        })
      }else{
        option.xAxis.data = res.data.map((d: any) => {
          return d[props.type]+'年'
        })
      }
      option.series[0].data = res.data.map((d: any) => {
        return d.amount
      })
      resolve(option)
    })
  })
}

const resizeObserver = new ResizeObserver(() => {
  myChart?.resize();
});

watchEffect(() => {
  debounceInitChart(props.dateRange[0].valueOf(), props.dateRange[1].valueOf(), props.type)
})
onMounted(() => {
  myChart = echarts.init(chartRef.value as HTMLElement);
  resizeObserver.observe(chartRef.value as HTMLElement)
})
onUnmounted(() => {
  resizeObserver.disconnect()
})

</script>

<template>
  <div class="h-full w-full" ref="chartRef"></div>
</template>

<style scoped lang="less">

</style>

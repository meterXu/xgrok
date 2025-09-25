<script setup>
import {defineProps} from 'vue'
import {useAppStore} from "@/store";

const store = useAppStore()
const {systemInfo} = useAppStore()

</script>

<template>
<div class="systemInfo w-full h-full p-16 rounded-4xl bg-(--primary-bg-0) flex flex-col gap-16 justify-center">
  <div class="text-[14px] font-bold">{{systemInfo?.hostname}}</div>
  <div class="overflow-hidden whitespace-nowrap text-ellipsis">{{systemInfo?.osVersion}}</div>
</div>
</template>

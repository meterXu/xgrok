<script setup>
import LeftCon from "@/components/left-aside/LeftCon.vue";
import {createClient, getSystemInfo, queryClient, updateClient} from "@/api";
import {onMounted, ref} from "vue"
import {useAppStore} from "@/store";

const store = useAppStore()

const {clientId,systemInfo} = useAppStore()

async function initClient() {
  let res = await getSystemInfo()
  if (res.success) {
    store.setSystemInfo(res.data)
    if (!clientId.value) {
      res = await queryClient(res.data.hostname)
      if (res.success) {
        if (res.data.records.length > 0) {
          store.setClientId(res.data.records[0].id)
        } else {
          res = await createClient({
            hostname: systemInfo.hostname,
            osVersion: systemInfo.osVersion
          })
          res.success && store.setClientId(res.data)
        }
      }
    } else {
      updateClient({
        id: clientId.value,
        hostname: systemInfo.hostname,
        osVersion: systemInfo.osVersion
      })
    }
  }
}

onMounted(async () => {
  await initClient()
})

</script>

<template>
  <div class="h-full">
    <el-container class="h-full! flex flex-row justify-start items-start">
      <LeftCon></LeftCon>
      <el-container class="flex flex-col! h-full bg-(--container-bg)">
        <el-main class="p-0! relative">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.content-wrap {
  padding: 0;
  position: relative;
}
</style>

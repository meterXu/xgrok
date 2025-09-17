<script setup>
import LinkButton from "@/components/LinkButton.vue";

function onCheckUpdate() {
  console.log(new Date().valueOf())
  // window.electronAPI.checkUpdate()
}
</script>

<template>
  <div class="flex flex-row gap-24">
    <LinkButton v-debounce:click="onCheckUpdate">
      <template #icon>
        <MdiUpdate/>
      </template>
      检查更新
    </LinkButton>
    <LinkButton href="https://www.xdo.icu">
      <template #icon>
        <MdiWeb></MdiWeb>
      </template>
      官方网站
    </LinkButton>
    <LinkButton href="https://github.com/meterXu/xgrok/issues">
      <template #icon>
        <MdiGithub/>
      </template>
      建议反馈
    </LinkButton>
  </div>
</template>

<style scoped lang="less">

</style>

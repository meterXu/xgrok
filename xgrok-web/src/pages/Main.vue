<script setup>

import permission from "../permission";
const appConfig = app.config.globalProperties.$project
</script>

<template>
  <XXWebBox :appConfig="appConfig" :permission="permission"></XXWebBox>
</template>

<style scoped>

</style>

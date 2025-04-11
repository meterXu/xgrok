<script setup>
import DashboardRight from "@/pages/views/modules/DashboardRight.vue";
import DashboardLeft from "@/pages/views/modules/DashboardLeft.vue";

</script>

<template>
  <div class="dashboard-wrap">
    <DashboardLeft class="left"/>
    <DashboardRight class="right"/>
  </div>
</template>

<style scoped>
.dashboard-wrap{
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 12px;
  height: 100%;
}
.left{
  flex: 1;
}
.right{
  width: 600px;
}
.left,.right{
  height: 100%;
  position: relative;
}
</style>

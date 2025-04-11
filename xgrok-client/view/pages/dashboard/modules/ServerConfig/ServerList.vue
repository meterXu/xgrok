<script setup>
import {defineProps, defineEmits} from 'vue'
import ServerConfigItem from "@/components/ServerConfigItem.vue";
import {useAppStore} from "@/store";
import {useStatusClass} from "@/libs/enums";

const props = defineProps(['serverConfigs'])
const emit=defineEmits(['selectServerConfig'])
const {selectedServer}=useAppStore()

function onSelectConfigItem(item){
  emit('selectServerConfig',item)
}

</script>

<template>
  <ul class="serverConfigs-ul">
    <li v-for="item in props.serverConfigs" :key="item.id" :class="{'selected':item.id===selectedServer.id}" @click="onSelectConfigItem(item)">
      <ServerConfigItem :serverConfig="item" :statusClass="useStatusClass(item.is_online)"></ServerConfigItem>
    </li>
  </ul>
</template>

<style scoped>
.serverConfigs-ul{
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
  li{
    cursor: pointer;
    &:hover{
      .selected-server-info-wrap{
        border: 1px solid var(--el-color-success);
      }
    }
  }
  .selected{
    .selected-server-info-wrap{
      border: 1px solid var(--el-color-success);
    }
  }
}
@media screen and (max-width:900px) {
  .serverConfigs-ul{
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}
</style>
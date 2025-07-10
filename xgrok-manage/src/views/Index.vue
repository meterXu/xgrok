<script setup lang="ts">
import {expandFullProject} from 'xxweb-util/lib/util.js'
import {ACCESS_TOKEN} from 'xxweb-util/lib/types.js';
import permission from "@/api/permission.ts";
import {useRouter} from "vue-router";
const router = useRouter();
const _project = expandFullProject(window.project) as ProjectType
function onDropdownMenuClick(command:string){
  switch(command){
    case 'exitSystem':{
      window.$ls.remove(ACCESS_TOKEN);
      router.push(_project.redirect.login+`?path=${router.currentRoute.value.path}`);
    }break;
  }
}
</script>

<template>
  <XXWebBox :appConfig="_project" :permission="permission" @dropdownMenuClick="onDropdownMenuClick"></XXWebBox>
</template>

<style scoped lang="less">

</style>
<script setup lang="ts">
import {expandFullProject,redirectSsoLogin} from 'xxweb-util/lib/util.js'
import permission from "@/api/permission.ts";

const _project = expandFullProject(window.project) as ProjectType
function onDropdownMenuClick(command:string){
  switch(command){
    case 'exitSystem':{
      redirectSsoLogin(_project.redirect.login)
    }break;
  }
}
</script>

<template>
  <XXWebBox :appConfig="_project" :permission="permission" @dropdownMenuClick="onDropdownMenuClick"></XXWebBox>
</template>

<style scoped lang="less">

</style>
<script setup lang="ts">
import {expandFullProject, type Project} from 'xxweb-util'
import {ACCESS_TOKEN} from 'xxweb-util';
import {useRouter} from "vue-router";
import {appStore} from "@/store";

const store = appStore()
const {permission,userInfo} = store
const router = useRouter();
const _project = expandFullProject(window.project) as Project;
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
  <XXWebBox :appConfig="_project" :permission="permission" @dropdownMenuClick="onDropdownMenuClick">
    <template #head-user-userName>
      {{userInfo?.user?.username||userInfo?.user?.nickname}}
    </template>
  </XXWebBox>
</template>

<style scoped lang="less">

</style>

<script setup lang="jsx">
import IconParkOutlineHomeTwo from '~icons/icon-park-outline/home-two';
import IconParkOutlinePlanet from '~icons/icon-park-outline/planet';
import IconParkOutlineWholeSiteAccelerator from '~icons/icon-park-outline/whole-site-accelerator';
import IconParkOutlineSettingTwo from '~icons/icon-park-outline/setting-two';
import IconParkOutlineInfo from '~icons/icon-park-outline/info';

const menuList = [
  {
    title: '主页',
    icon: <IconParkOutlineHomeTwo/>,
    name: 'Dashboard',
  },
  {
    title: '网页',
    icon: <IconParkOutlinePlanet/>,
    name: 'Web',
  },
  {
    title: '服务',
    icon: <IconParkOutlineWholeSiteAccelerator/>,
    name: 'Service',
  },
  // {
  //   title: '组网',
  //   icon: <IconParkOutlineLinkThree/>,
  //   name: 'Vpn',
  // },
  {
    title: '捐赠',
    icon: <IconParkOutlineCooperativeHandshake/>,
    name: 'Plan',
  },
  {
    title: '日志',
    icon: <IconParkOutlineDocSearchTwo/>,
    name: 'Log',
  },
  {
    title: '设置',
    icon: <IconParkOutlineSettingTwo/>,
    name: 'Setting',
  },
  {
    title: '关于',
    icon: <IconParkOutlineInfo/>,
    name: 'About',
  }
]


</script>
<template>
  <ul class="w-full flex flex-col items-center justify-start gap-28">
    <router-link v-for="(item,index) in menuList" :key="index" :to="{name:item.name}"
                 custom
                 v-slot="{ isActive, href, navigate }">
      <li :class="isActive ? 'bg-gray-600/50 text-(--aside-menu-text-hover)' : ''"
          class="w-48 h-48 text-center rounded-4xl flex justify-center items-center
              text-[18px] cursor-pointer text-(--aside-menu-text)
              hover:text-(--aside-menu-text-hover)"
          @click="navigate">
        <el-tooltip
            class="box-item"
            placement="bottom-end"
            :content="item.title"
            effect="light"
        >
          <component :is="item.icon"></component>
        </el-tooltip>
      </li>
    </router-link>
  </ul>
</template>

<style lang="less">
.fine-stroke {
  g, path {
    stroke-width: 3;
  }
  &:focus{
    outline-style: none;
  }
}
</style>

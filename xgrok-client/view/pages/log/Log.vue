<script setup>
import {useGoBack} from "@/libs/useAction";
</script>

<template>
  <div class="flex w-full h-full flex-col gap-12 p-12">
    <div>
      <el-button type="success" plain class="text-[14px]! py-14!" size="small" @click="useGoBack">
        <template #icon>
          <i-ep-back/>
        </template>
        返回</el-button>
      <el-button type="danger" plain class="text-[14px]! py-14!" size="small">
        <template #icon>
          <i-ep-refresh/>
        </template>
        刷新</el-button>
    </div>
    <div class="flex-1 w-full relative text-[14px] overflow-y-auto rounded-2xl p-12 bg-gray-800 text-(--el-color-primary)">
      2025-07-05 21:20:24.602 [E] [client/service.go:299] token in login doesn't match token from configuration <br/>
      2025-07-05 21:20:24.602 [W] [client/service.go:317] connect to server error: token in login doesn't match token from configuration<br/>
      2025-07-05 21:20:24.602 [I] [sub/root.go:167] frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg] stopped<br/>
      2025-07-05 21:20:25.763 [I] [sub/root.go:149] start frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg]<br/>
      2025-07-05 21:20:25.763 [I] [client/service.go:314] try to connect to server...<br/>
      2025-07-05 21:20:25.841 [E] [client/service.go:299] token in login doesn't match token from configuration<br/>
      2025-07-05 21:20:25.841 [W] [client/service.go:317] connect to server error: token in login doesn't match token from configuration<br/>
      2025-07-05 21:20:25.841 [I] [sub/root.go:167] frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg] stopped<br/>
      2025-07-05 21:20:26.990 [I] [sub/root.go:149] start frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg]<br/>
      2025-07-05 21:20:26.991 [I] [client/service.go:314] try to connect to server...<br/>
      2025-07-05 21:20:24.602 [E] [client/service.go:299] token in login doesn't match token from configuration <br/>
      2025-07-05 21:20:24.602 [W] [client/service.go:317] connect to server error: token in login doesn't match token from configuration<br/>
      2025-07-05 21:20:24.602 [I] [sub/root.go:167] frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg] stopped<br/>
      2025-07-05 21:20:25.763 [I] [sub/root.go:149] start frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg]<br/>
      2025-07-05 21:20:25.763 [I] [client/service.go:314] try to connect to server...<br/>
      2025-07-05 21:20:25.841 [E] [client/service.go:299] token in login doesn't match token from configuration<br/>
      2025-07-05 21:20:25.841 [W] [client/service.go:317] connect to server error: token in login doesn't match token from configuration<br/>
      2025-07-05 21:20:25.841 [I] [sub/root.go:167] frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg] stopped<br/>
      2025-07-05 21:20:26.990 [I] [sub/root.go:149] start frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg]<br/>
      2025-07-05 21:20:26.991 [I] [client/service.go:314] try to connect to server...<br/>
      2025-07-05 21:20:24.602 [E] [client/service.go:299] token in login doesn't match token from configuration <br/>
      2025-07-05 21:20:24.602 [W] [client/service.go:317] connect to server error: token in login doesn't match token from configuration<br/>
      2025-07-05 21:20:24.602 [I] [sub/root.go:167] frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg] stopped<br/>
      2025-07-05 21:20:25.763 [I] [sub/root.go:149] start frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg]<br/>
      2025-07-05 21:20:25.763 [I] [client/service.go:314] try to connect to server...<br/>
      2025-07-05 21:20:25.841 [E] [client/service.go:299] token in login doesn't match token from configuration<br/>
      2025-07-05 21:20:25.841 [W] [client/service.go:317] connect to server error: token in login doesn't match token from configuration<br/>
      2025-07-05 21:20:25.841 [I] [sub/root.go:167] frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg] stopped<br/>
      2025-07-05 21:20:26.990 [I] [sub/root.go:149] start frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg]<br/>
      2025-07-05 21:20:26.991 [I] [client/service.go:314] try to connect to server...<br/>
      2025-07-05 21:20:24.602 [E] [client/service.go:299] token in login doesn't match token from configuration <br/>
      2025-07-05 21:20:24.602 [W] [client/service.go:317] connect to server error: token in login doesn't match token from configuration<br/>
      2025-07-05 21:20:24.602 [I] [sub/root.go:167] frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg] stopped<br/>
      2025-07-05 21:20:25.763 [I] [sub/root.go:149] start frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg]<br/>
      2025-07-05 21:20:25.763 [I] [client/service.go:314] try to connect to server...<br/>
      2025-07-05 21:20:25.841 [E] [client/service.go:299] token in login doesn't match token from configuration<br/>
      2025-07-05 21:20:25.841 [W] [client/service.go:317] connect to server error: token in login doesn't match token from configuration<br/>
      2025-07-05 21:20:25.841 [I] [sub/root.go:167] frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg] stopped<br/>
      2025-07-05 21:20:26.990 [I] [sub/root.go:149] start frpc service for config file [/Users/isaac/Library/Logs/xgrok/.xgrok.cfg]<br/>
      2025-07-05 21:20:26.991 [I] [client/service.go:314] try to connect to server...<br/>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>

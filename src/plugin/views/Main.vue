<template>
    <div id="BIMAI" ref="root"></div>
</template>

<script setup lang="ts">
import RenderMgr from "@/base/manager/RenderMgr";
import { UIMgr } from "@/base/manager/UIMgr";
import BIM from "@/BIM";
import ConstDef from "@/libs/ConstDef";
import { onMounted, ref } from "vue";
import PluginMain from "../PluginMain";


//主场景挂载点
const root = ref<HTMLElement>(document.createElement('div'));

onMounted(()=>{
    console.log("views:mainview onmounted")
    BIM.container = root.value;

    let mgr = BIM.mgr[ConstDef.WEBGL_RENDER_MGR] as RenderMgr;
    mgr.create3DView();
    // 启动功能
    BIM.main.startFunc();
});


</script>

<style scoped lang="scss">
.bimui {
    position: fixed;
    z-index: 1000;
}
.bim2d {
    position: fixed;
    z-index: 100;
}
.bim3d {
    position: fixed;
    z-index: 0;
}

.layer
{
  position:fixed;
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.group
{
  position: absolute;
  display: flex;
}

#uiLayer{
   position: fixed;
   width: 100%;
   height: 100px;
   
   background-color: rgb(240, 83, 11);

   z-index: 10;    
}
</style>
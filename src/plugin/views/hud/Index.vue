<template>
    <div id="hud" ref="hud"></div>
</template>

<script setup lang="ts">
import RenderMgr from '@/base/manager/RenderMgr';
import BIM from '@/BIM';
import ConstDef from '@/libs/ConstDef';
import { onMounted, ref } from 'vue';

const hud = ref<HTMLElement>(document.createElement('div'));

onMounted(() => {

    console.log("views:hud onmounted")
    BIM.hud = hud.value;
    let mgr = BIM.mgr[ConstDef.WEBGL_RENDER_MGR] as RenderMgr;
    mgr.create2DView();
});

</script>

<style lang="scss" scoped>
#hud {
    display: flex;
    position: fixed;
    padding: 0px;
    height: 240px;
    width: 240px;
    background-color: #eeeeee;
    top: 80px;
    right: 0px;
    justify-content: center;
    align-items: center;
}
</style>
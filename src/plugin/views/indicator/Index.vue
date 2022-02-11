<template>
    <div id="indicator" ref="indicator"></div>
</template>

<script setup lang="ts">
import RenderMgr from '@/base/manager/RenderMgr';
import BIM from '@/BIM';
import ConstDef from '@/libs/ConstDef';
import { onMounted, ref } from 'vue';

const indicator = ref<HTMLElement>(document.createElement('div'));

onMounted(() => {

    console.log("views:hud onmounted")
    BIM.indicator = indicator.value;
    let mgr = BIM.mgr[ConstDef.WEBGL_RENDER_MGR] as RenderMgr;
    mgr.createIndicatorView();
});

</script>

<style lang="scss" scoped>
#indicator {
    display: flex;
    position: fixed;
    padding: 0px;
    height: 120px;
    width: 120px;
    // background-color: #eeeeee;
    top: 80px;
    left: 270px;
    justify-content: center;
    align-items: center;
}
</style>
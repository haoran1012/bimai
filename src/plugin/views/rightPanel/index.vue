<template>
    <div class="rightPanel">
        <div class="mapDiv">小地图区</div>
        <div class="objectDiv" :class="showpanel ? '' : 'displaynone'">
            <div class="inputItem">
                <span>长:</span>
                <div class="demensionDiv">
                    <input v-model="length" @keyup.enter="onInputEnter" />
                    <span>mm</span>
                </div>
            </div>

            <div class="inputItem">
                <span>宽:</span>
                <div class="demensionDiv">
                    <input v-model="width" @keyup.enter="onInputEnter" />
                    <span class="demension">mm</span>
                </div>
            </div>

            <div class="inputItem" ref="input3">
                <span>高:</span>
                <div class="demensionDiv">
                    <input v-model="height" @keyup.enter="onInputEnter" />
                    <span>mm</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.rightPanel {
    position: fixed;

    top: $headerHeight + $topSideBarHeight;
    right: 0px;
    width: $rightPanelWidth;
    // height: 100%;

    background-color: white;

    box-shadow: -1px 0px 3px #b3b1b1;

    .mapDiv {
        width: 260px;
        height: 240px;

        background-color: yellow;
    }

    .objectDiv {
        display: flex;

        flex-direction: column;

        height: 600px;

        margin: 20px 0px 0px 20px;

        gap: 5px;

        .inputItem {
            position: relative;
            display: flex;

            gap: 12px;

            width: 200px;
            height: 30px;

            justify-content: center;
            align-items: center;

            // input{
            //     height: 30px;

            //     // width: 70%;

            //     background-color: yellow;

            //     outline: none;
            // }
        }

        // .show{
        //     display: flex;
        // }

        // .hidden{
        //     display: none !important;
        // }
    }
}
</style>

<script lang="ts" async setup>
import MeshControlsMgr from '@/base/manager/MeshControlsMgr';
import { BIMAIGroup } from '@/base/meshcontrols/BIMAIGroup';
import { BIMAIMesh } from '@/base/meshcontrols/BIMAIMesh';
import BIM from '@/BIM';
import ConstDef from '@/libs/ConstDef';
import eventInstance from '@/plugin/eventTower';
import { EventConst } from '@/plugin/eventTower/EventConst';
import { Object3D } from 'three';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

const length = ref();
const width = ref();
const height = ref();

const showpanel = ref(true);

const onInputEnter = (el) => {

    let trueLength: number = length.value ? (length.value > 0 ? length.value : 1) : undefined;
    let trueWidth: number = width.value ? (width.value > 0 ? width.value : 1) : undefined;
    let trueheight: number = height.value ? (height.value > 0 ? height.value : 1) : undefined;

    (BIM.mgr[ConstDef.MESH_CONTROL_MGR] as MeshControlsMgr).changeMeshSize([trueLength, trueWidth, trueheight]);
}

const onEntityChange = (arg) => {
    console.log("entitychange");

    console.log(arg)

    if (arg && Array.isArray(arg) && arg.length == 1 && (!(arg[0] instanceof BIMAIGroup))) {

        // showpanel.value = true;

        let mesh: BIMAIMesh = arg[0];
        length.value = mesh.Length.toString();
        width.value = mesh.Width.toString();
        height.value = mesh.Height.toString();
    }
    else {
        // showpanel.value = false;
    }
}

onMounted(() => {
    eventInstance.addListenEvent(EventConst.SELECT_CHANGE, onEntityChange);
})

onUnmounted(() => {
    eventInstance.removeAddListen(EventConst.SELECT_CHANGE, onEntityChange);
})
</script>
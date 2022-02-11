<template>  
    <div class="container"> 
        <!-- <div class="panelContainer"> -->
            <div class="opertionDiv">
                <TabView @itemChanged="onItemClicked1" :sources="tab1"></TabView>   
                <div class="resize_bar">
                    
                    <BuildPanel v-if="viewStr === 'tab0'"></BuildPanel>
                    <ConfigPanel v-else-if="viewStr === 'tab1'"></ConfigPanel>
                    <DrwaPanel v-else-if="viewStr === 'tab2'"></DrwaPanel>
                </div>
                <!-- <div class="resize_save">
                    
                </div> -->
                
            </div>  
            <div class="listDiv">
                <TabView @itemChanged="onItemClicked2" :sources="tab2"></TabView> 
                <LayerList v-if="viewStr2 === 'tab0'"></LayerList>
                <StructList v-else-if="viewStr2 === 'tab1'"></StructList>
                <ModelList v-else-if="viewStr2 === 'tab2'"></ModelList>
            </div>
            
        <!-- </div> -->
    </div>

</template>
<script lang="ts" setup>

import { ref } from "vue";
import {BuildPanel, ConfigPanel, DrwaPanel, LayerList, StructList, ModelList} from "./components";
import TabView from "../components/TabView.vue";

const tab1 = ref(["建模","配模","图纸清单"])
const tab2 = ref(["图层列表","结构件列表","铝模板列表"])

const viewStr = ref("tab1");

const viewStr2 = ref("tab1");

const onItemClicked1 = (arg)=>{
    // console.log("change")

    viewStr.value = "tab" + arg;
}

const onItemClicked2 = (arg)=>{
    viewStr2.value = "tab" + arg;
}

</script>
    
<style lang="scss" scoped>
    .container {   
        position: fixed;
        height: 100%;
        top: 40px;
        left: 0px;
        display: flex;
        width: $leftPanelWidth;

        flex-direction: column;
        background-color: rgb(255, 255, 255);

        box-shadow: 1px 0px 5px #b3b1b1;


        .opertionDiv{
            // min-height: 600px;
            // overflow: hidden;
        }

        .resize_save
        {
            position:absolute;

            overflow-y:auto;

            width: 100%;

            top: 0px;

            max-height: 800px;

        }

        .listDiv{
            height: auto;
        }

        
    }
</style>
<template>
    <div id="messageBox" class = "messageBox">
        <!-- <div class=""></div> -->
        <!-- <img src="" /> -->
        <label class="" >{{ message }}</label>
    </div>
</template>

<script setup lang="ts">
    //超时消失 

import { reactive } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
     
    const props = defineProps([ 'message']);
    
    const timeout = 10;

    const state = reactive({
        visibled: false
    });

    const onOpen = ()=>{
        // state.visibility = true;

        setTimeout(()=>{
            onClose()
        }, 10000);
    }

    const onClose = ()=>{
         state.visibled = false;
         console.log("clos");

    }

    onMounted(()=>{
        onOpen();
    })

</script>

<style scoped>
    #messageBox
    {
        width: 100px;
        height: 40px;
        border-radius: 4px;
        background-color: brown;
    }
</style>

<template>
     <div class="container">
         <div style="font-size:18px;">
             <SvgIcon icon="logo"></SvgIcon>   
         </div>
         <span>广州必劢科技有限公司技术支持</span>
         
    </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/base/components/svg-icon.vue';

</script>

<style lang="scss" scoped>
.container {
        display: flex;
        position: fixed;
        padding: 0px;
        height: 40px;
        width: 100%;
        // background-color: rgb(150, 141, 141);

        bottom: 0px;
        left: 0px;

        justify-content: center;
        align-items: center;

        color: rgb(50, 51, 49);
    }

</style>

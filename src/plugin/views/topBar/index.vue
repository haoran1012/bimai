<template>
    
        <div class="header">
            <div class="top_content">
                    <div class="top_left">
                        <div class="img_container">
                            <img src="@/assets/img/bimai.png" />
                            <img src="@/assets/img/bimaikeji.png" />
                        </div>
            <div class="pro_info">
                <span>工程版本: v1</span>
                <img src="@/assets/img/list.png" />
            </div>

        </div>
        <div class="center_continer">
            <IconButton label="保存" icon="save" @clicked="onButtonClick" :index="1"></IconButton>
            <IconButton label="撤销" icon="back" @clicked="onButtonClick" :index="2"></IconButton>
            <IconButton label="恢复" icon="next" @clicked="onButtonClick" :index="3"></IconButton>
            <IconButton label="清空" icon="empty" @clicked="onButtonClick" :index="4"></IconButton>
            <IconButton label="测量" icon="celian" @clicked="onButtonClick" :index="5"></IconButton>
            <!-- <IconButton label="组合" icon="combine" @clicked="onButtonClick" :index="6"></IconButton> -->
            <!-- <IconButton label="解组" icon="break" @clicked="onButtonClick" :index="7"></IconButton> -->
            <IconButton label="渲染" icon="render" @clicked="onButtonClick" :index="8"></IconButton>
            <IconButton label="图册" icon="pics" @clicked="onButtonClick" :index="9"></IconButton>
        </div>
        <div class="top_right">
            <div class="svgGroup">
                <SvgButton icon="setter" @clicked="onSettingClick"></SvgButton>
                <SvgButton icon="help" @clicked="onHelpClick"></SvgButton>
                <SvgButton icon="message" @clicked="onMessageClick"></SvgButton>
                <div class="line"></div>
            </div>  
            <roler></roler>
        </div>
            </div>
        
    </div>
</template>

<script setup lang="ts">
import { IconButton, SvgButton } from '@/plugin/views/components/button';
import roler from '@/plugin/views/components/roler.vue'
import { ToastManagerInstace } from '@/plugin/views/components/toast'



const onSettingClick = ()=>{
    ToastManagerInstace.show("功能持续完善中");
}

const onHelpClick = ()=>{
    ToastManagerInstace.show("功能持续完善中");
}

const onMessageClick = ()=>{
    ToastManagerInstace.show("功能持续完善中");
}

const onButtonClick = (arg)=>{
    switch(arg)
    {
        case 1:
        {
            console.log(1)
            break;
        }
        case 2:
        {
              console.log(2)
            break;
        }
        case 3:
        {
            console.log(3)
            break;
        }
    }

    ToastManagerInstace.show("功能持续完善中");
}

</script>
    
<style lang="scss" scoped>
    .header {
        position: fixed;
        height: 40px;
        width: 100%;
        background-color: white;
    
        top: 0px;
        left: 0px;

        z-index: 1001;

        border-bottom: 1px solid rgb(209, 204, 204);
        
        
        .top_content
        {
            position: relative;
            display: flex;

            height: 100%;
            width: 100%;

            justify-content: flex-start;
        }
        .top_left{
            // width: 20%;
            height: 100%;
            display: flex;
            
            .img_container{
                display: inline-flex;
            }

            .pro_info{
                display: inline-flex;

                justify-content: center;
                align-items: center;

                gap: 5px;

                margin-left: 50px;
                font-size: 14px;
                color: rgb(73, 155, 250);
            }

            img{
                // width: 60px;
                height: 40px;
                &:last-child{
                    height: 30px;
                    margin-bottom: 5px;


                }

                
            }
        }

        .center_continer{
        display: flex;
        
        justify-content: center;
        align-items: center;

        // gap: 5px;
        // background: rgb(109, 13, 13);
        // width: 100%;
        // height: 100%;

        margin: 0 auto;
    }

    .top_right{
        height: 100%;
        // background: yellow;
        right: 10px;
        display:flex;
        justify-content:flex-end;
        align-items: center;

        .svgGroup{
            display: flex;
            gap: 10px;

            font-size: 22px;
            // line-height: 14px;      
        }

        
    }
    }
    
</style>
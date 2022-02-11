<template>
    <div class="rolerBox">     
        <div class="rolerInfo">
            <div style="font-size: 28px">
                <SvgIcon icon="default_vater"></SvgIcon>
            </div>
            
                <span>{{ roles.name }}</span>
                <div :class="showSetting ? 'droparrow' : 'normalarrow'">
                     <SvgIcon icon="arrow" @click="onClickArrow"></SvgIcon>
                </div>      
        </div>

        <div class="settingBox" :class=" showSetting ? 'show' : 'hidden'">

            <div class="setting_info">

                <div style="font-size: 45px">
                    <SvgIcon icon="default_vater"></SvgIcon>
                </div>

                <div class="setting_name">
                    <div>
                        <span>{{ roles.name }}</span>
                        <!-- <div style="font-size: 12px">
                            <SvgIcon icon=""></SvgIcon>
                            <SvgIcon icon=""></SvgIcon>
                        </div> -->
                        <br />

                        <a style="color:rgb(6, 236, 6); font-size: 12px">升级账户</a>
                        
                    </div>
                </div>
            </div>
            <div class="setting_manager">

                <div style="font-size: 22px">
                    <SvgIcon icon="setting_user"></SvgIcon>     
                </div>

                <a>个人主页</a>
                
                <span style="width: 60px"></span>

                <div style="font-size: 22px">
                    <SvgIcon icon="setting_control"></SvgIcon>     
                </div>

                <a>企业后台</a>
            </div>
            <div class="loginOut">
                <a>账号设置</a>
                <a>退出</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import SvgIcon from '@/base/components/svg-icon.vue';
import { EnterpriseInfo } from '@/base/datas/EnterpriseInfo';
import { store } from '@/base/store';
import { computed, ref } from 'vue';

const showSetting = ref(false);

const onClickArrow = ()=>{
    showSetting.value = !showSetting.value;
}

const roles = computed<EnterpriseInfo>(()=>{

    console.log(store.getters["user/getcurrEnrieList"].name);
    return store.getters["user/getcurrEnrieList"];
})


</script>

<style lang="scss" scoped>
    .rolerBox{
        display: flex;
        flex-direction: column;
        align-items: center;
        // gap: 8px;
        width:140px;
        height: 40px;

        flex-shrink: 0;
        margin-left: 10px;

        a{
            cursor: pointer;

            &:hover
            {
                color:green
            }
        }
    }

    .rolerInfo{
        display: flex;
        align-items: center;
        gap:8px;

        height: inherit;

        // height: 30px;
        flex-shrink: 0;

        .show{
            transform:rotate(-90deg);
        }

        // background-color: yellowgreen;
    }

    .settingBox{
        flex-shrink: 0;

        width: 400px;
        height: 150px;

        background-color: rgb(252, 248, 248);

        display: flex;
        flex-direction: column;

        position: relative;
        z-index: 33;

        .setting_info{
            display: flex;

            gap: 15px;

            padding-left: 12px;
            padding-top: 12px;
        }

        .setting_name{
            margin-top: 12px;

            display: flex;
        }

        .setting_manager{
            display: flex;

            margin-top: 12px;
            padding-left: 12px;

            align-items: baseline;

            gap: 5px;
        }

        .loginOut
        {
            background-color: gray;

            margin-top: 12px;

            height: 40px;

            padding-bottom: 10px;
            padding-left: 12px;

            display: flex;

            // justify-content:;
            gap: 160px;
            align-items: flex-end;
        }
    }
</style>
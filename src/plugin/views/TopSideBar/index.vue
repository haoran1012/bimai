<template>
    <div class="topSideBar">
        <div class="activeTabGroup">
            <IconButton label="AI生成构件" class="tabButton"></IconButton>
            <div class="upload" style="">
                <input type="file" name="" id="" multiple :onchange="importJson" />
                <IconButton label="导入CAD" class="tabButton"></IconButton>
            </div>
            <IconButton label="图纸纠错" class="tabButton"></IconButton>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.topSideBar {
    position: fixed;
    background-color: white;
    top: $headerHeight;
    left: $leftPanelWidth;
    width: 100%;
    height: $topSideBarHeight;
    padding-left: 100px;
    border-bottom: 1px solid rgb(223, 217, 217);

    .activeTabGroup {
        display: flex;
    }

    .upload {
        flex-shrink: 0;
        position: relative;
        overflow: hidden;

        cursor: pointer;

        &:hover {
            background-color: rgb(31, 157, 241);
            // color: ;
        }

        input {
            width: 100%;
            height: 100%;

            position: absolute;
            top: 0px;
            left: 0px;

            opacity: 0;
        }
    }
}
</style>

<script lang="ts" setup>
import SC from '@/base/server/ServiceContainer';
import TestMod from '@/plugin/test/TestMod';
import { IconButton } from '@/plugin/views/components/button'

const importJson = (e) => {
    console.log(e)
    const input = e.target;
    const files = input.files;

    console.log(files[0]);

    var reader = new FileReader();
    reader.readAsText(files[0], "UTF-8");
    reader.onload = (evt) => {
        let fileString = evt.target.result;
        let str = fileString as string;

        let data = null;
        try {
            data = JSON.parse(str)
        } catch (e) {

         }

        SC.cad.readJson(data);
    }
}

</script>
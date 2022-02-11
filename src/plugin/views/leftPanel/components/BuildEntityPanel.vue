<template>
    <div class="entityContainer">
        <IconButton label="墙" icon="wall" ref="tab0" className="EPButton" :index="0" @clicked="itemClicked"></IconButton>
        <IconButton label="圆柱" icon="zhuzi"  ref="tab1" className="EPButton" :index="1" @clicked="itemClicked"></IconButton>
        <IconButton label="方形柱" icon="zhuzi"  ref="tab2" className="EPButton" :index="2" @clicked="itemClicked"></IconButton>
        <IconButton label="梁" icon="liang"  ref="tab3" className="EPButton" :index="3" @clicked="itemClicked"></IconButton>
        <IconButton label="楼板" icon="louban"  ref="tab4" className="EPButton" :index="4" @clicked="itemClicked"></IconButton>
    </div>
</template>

<style lang="scss" scoped>
.entityContainer{
    margin: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .EPButton{
        width: 70px;
        height: 90px;
        
        border: none ;
        background-color: rgb(3, 9, 17,0.03);

        &:hover{
            background-color: white ;
            border:1px solid rgb(124, 119, 119);
        }

        gap: 12px;
    }

    .selected{
        background-color: white ;
        border:1px solid rgb(124, 119, 119);
    }
}

</style>

<script lang="ts" setup>
import { ref } from "vue";
import { IconButton } from '@/plugin/views/components/button';

import { ToastManagerInstace } from '@/plugin/views/components/toast'
import BIM from "@/BIM";
import ConstDef from "@/libs/ConstDef";
import MeshControlsMgr from "@/base/manager/MeshControlsMgr";
import { MeshControlconst } from "@/base/meshcontrols/meshControlconst";

var currIndex: number = -1;

const tab0 = ref(null); 
const tab1 = ref(null);
const tab2 = ref(null);
const tab3 = ref(null);
const tab4 = ref(null);

const tabs = [tab0, tab1, tab2, tab3, tab4];

const itemClicked = (arg)=>{
        if(arg != currIndex)
        {  
            currIndex = arg;

            for(let i: number = 0; i < tabs.length; i++)
                {
                    (tabs[i]).value.selected = ((currIndex as Number) == i);
                }


                //选择模式
            switch(currIndex) 
            {
                case 0:
                    {
                        (BIM.mgr[ConstDef.MESH_CONTROL_MGR] as MeshControlsMgr).drawBaseBIMAIMesh(MeshControlconst.DRAW_Mesh_WALL); 
                        break;
                    };
                    case 1:
                        {
                            (BIM.mgr[ConstDef.MESH_CONTROL_MGR] as MeshControlsMgr).drawBaseBIMAIMesh(MeshControlconst.DRAW_Mesh_CIRCLE); 
                            break;
                        };
                    case 2:
                        {
                            (BIM.mgr[ConstDef.MESH_CONTROL_MGR] as MeshControlsMgr).drawBaseBIMAIMesh(MeshControlconst.DRAW_Mesh_RECT);
                            break;
                        }
                        ;
                    case 3:
                        {
                            (BIM.mgr[ConstDef.MESH_CONTROL_MGR] as MeshControlsMgr).drawBaseBIMAIMesh(MeshControlconst.DRAW_Mesh_BEAM); 
                            break;
                        }
                        ;
                    case 4:
                        {
                            (BIM.mgr[ConstDef.MESH_CONTROL_MGR] as MeshControlsMgr).drawBaseBIMAIMesh(MeshControlconst.DRAW_Mesh_BOARD); 
                            break;
                        }
            }    
           
        }
    }

</script>
<template>
    <div class="side-tab">
        <IconButton v-for="(item, i) in sources" :key="i" :label="item" :className="className" :ref="setRefItems" :index="i" @clicked="itemClicked"></IconButton>
    </div>
</template>

<style lang="scss" scoped>
    .side-tab{
        // background-color: white;
        width: inherit;
        height: 40px;

        display: flex;      
    }
</style>


<script lang="ts" setup>
    import { computed, nextTick, onMounted, ref } from 'vue';    
    import { IconButton } from '@/plugin/views/components/button';
    

    const props = defineProps({
        sources: {
            type: Array as ()=> Array<string>,
            default: ()=>[]
        },
        className: String
    })

    const className = computed(()=>{
        return props.className ? props.className : "tabButton"
    })

    const tabNames = computed(()=>{
        return props.sources;
    })

    const emits = defineEmits(["itemChanged"]);

    var currIndex = -1;

    const tabs = [];

    const setRefItems = (el)=>{

        if(el)
        {
            tabs.push(el);
        }
    };



    onMounted(()=>{
        itemClicked(0);
    });

     
    const itemClicked = (arg)=>{
        if(arg != currIndex)
        {
            emits('itemChanged', arg);
            currIndex = arg;

            for(let i: number = 0; i < tabs.length; i++)
                {
                    (tabs[i]).selected = ((currIndex as Number) == i);
                }
        }
    }
</script>
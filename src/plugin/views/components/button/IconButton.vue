<template>
    <div class="iconButton" :class="[className, {'hasIcon' : (hasIcon && hasLabel) }, {'selected' : selected}]" @click.prevent="onClick">
        <SvgIcon :icon="icon" v-if="hasIcon"   className="svg"></SvgIcon>
        <span v-if="hasLabel">{{ label }}</span>
    </div>
</template>

<style lang="scss" scoped>
.iconButton{

    display: flex;
    flex-direction: row;

    justify-content: center;
    align-items: center;
    gap: 2px;

    width: 60px;
    height: 100%;

    border:1px solid rgb(124, 119, 119);
    color: gray;

    cursor: pointer;

    &:hover
    {
        background-color: rgb(31, 157, 241);
    }  

}

.hasIcon{
    flex-direction: column  !important;
}

.selected{
    background-color: rgb(31, 157, 241);
}

.svg
{
    font-size: 30px
}

</style>

<script lang="ts" setup>
import SvgIcon from '@/base/components/svg-icon.vue';
import { computed, ref, watch } from 'vue';

const props = defineProps({
    label: String,
    icon: String,
    className: String,
    index: {
        type: Number,
    },
    iconClass: String,
    selectedEnbale: Boolean
});

const emits = defineEmits(["clicked", "selected"]);


const label = computed(()=>{
    return props.label;
});

const icon = computed(()=>{
    return props.icon;
})

const className = computed(()=>{
    return props.className;
})

const hasIcon = computed(()=>{
    return Boolean(props.icon && props.icon != "");
})

const hasLabel = computed(()=>{
    return Boolean(props.label && props.label != "")
})

const selectedEnbale = computed(()=>{
    return Boolean(props.selectedEnbale);
})

const index = computed(()=>{
    return props.index;
})

const iconClass = computed(()=>{
    return props.iconClass;
})

const selected = ref();

// watch(selected, ()=>{
//     console.log("selected", selected.value)
// })

const onClick = ()=>{
    // if(!selectedEnbale.value)
    // {
        emits("clicked", index.value);
    // }
    // else
    // {
    //     if(!selected.value)
    //     {
    //         selected.value = !selected.value;
    //     }
    // }  
}



defineExpose({
    selected
})

</script>
<template>
    <div class="svgButton"  @click.prevent="onClick">
        <SvgIcon :icon="icon"></SvgIcon>
    </div>
</template>

<style lang="scss" scoped>

.svgButton{
        width: auto; 
        border: none ;

        height: 100%;

        font-size: 19px;
        cursor: pointer;
            
        }

</style>

<script lang="ts" setup>
import SvgIcon from '@/base/components/svg-icon.vue';
import { computed, ref, watch } from 'vue';

const props = defineProps({
    icon: String
});

const emits = defineEmits(["clicked", "selected"]);

const icon = computed(()=>{
    return props.icon;
})

const onClick = ()=>{
        emits("clicked");
}


</script>
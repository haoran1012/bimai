<template>
<div class="toast_container">
    <div class="toast" ref="toast">
        {{ message }}
    </div>
</div>
    
</template>

<script lang="ts" setup>
import { computed, onMounted , ref} from "vue";

const props = defineProps({
    message: String
})

const message = computed(()=>{
    return props.message;
})

const toast = ref(null);

</script>

<style lang="scss" scoped>

.toast_container{
    display: flex;

    justify-content: center;
    align-items: center;

    position: fixed;
    top: 100px;

    width: 100%;
}
.toast{
    display: flex;

    justify-content: center;
    align-items: center;

    // left: 50%;

    background-color: rgb(48, 47, 47);

    border-radius: 6px;

    color: white;

    font-size: 14px;

    padding: 4px 4px 5px 5px;
}
</style>
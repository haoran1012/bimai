<script setup lang="ts">
import Main from './plugin/views/Main.vue';

</script>

<template>
  <Main></Main>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}

.layer {
  position: fixed;
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
  width: 100%;
}

.group {
  position: absolute;
  display: flex;
  width: 100%;
}

button {
  cursor: pointer;
  border-radius: 3px;

  width: 70px;
  height: 35px;
}
</style>

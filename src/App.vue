<template>
  <div id="app">
    <AgeGate />
    <router-view/>
  </div>
</template>

<script>
import AgeGate from './components/AgeGate.vue';

export default {
  name: 'App',
  components: {
    AgeGate
  }
}
</script>

<style>
/* GLOBAL RESET */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(circle at top right, #1a0505, #0c0b0b);
  background-attachment: fixed;
  overflow-x: hidden;
}

#app {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
}
</style>

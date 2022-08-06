<template>
  <div id="app">
   <router-link to="/login"></router-link>
    <router-view/>
  </div>
</template>

<script>
// import login from './views/login.vue'

export default {
  name: 'App',
  components: {
    // login,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    align-items: center;
    text-align: center;
    
}
</style>

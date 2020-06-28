<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: $base;
  font-size: 14px;
  max-width: 350px;
  margin: 0 auto;
  padding: 15px;
}
@import 'assets/scss/reset.scss';
</style>

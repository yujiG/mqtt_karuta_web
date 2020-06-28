<template>
  <router-link class="gameTitle" :to="{ name: 'GameUrl' }">
    karuta
  </router-link>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.gameTitle {
  margin-bottom: 15px;
  padding: 0 10px;
  font-size: 30px;
  color: $base;
  font-weight: bold;
  text-decoration: none;
  border-bottom: 2px solid $base;
  display: inline-block;
  line-height: 35px;
}
</style>

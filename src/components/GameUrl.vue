<template>
  <div class="game">
    <div class="game-title">karuta</div>
    <div class="game-urlBox">
      <i class="fa fa-files-o" />
      <p class="game-urlBox-url">{{ urlHash ? url : 'ここにURLが表示されます' }}</p>
    </div>
    <div class="game-buttons">
      <div class="game-buttons-item" :class="{ disabled: urlHash }" @click="makeGameUrl">URLを発行</div>
      <div class="game-buttons-item" :class="{ disabled: !urlHash }" @click="moveToGame">対戦ページに移動</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      urlHash: null
    }
  },
  computed: {
    url () {
      return `${location.host}/karuta/${this.urlHash}`
    }
  },
  methods: {
    makeGameUrl () {
      if (this.urlHash) return
      this.$store.dispatch('makeGameUrl').then(res => {
        this.urlHash = res.key
      })
    },
    moveToGame () {
      if (!this.urlHash) return
      this.$router.push({ name: 'Game', params: { game_key: this.urlHash } })
    }
  }
}
</script>

<style lang="scss" scoped>
.game {
  max-width: 350px;
  margin: 30vh auto 0;
  &-title {
    font-size: 30px;
    font-weight: bold;
    text-align: center;
  }
  &-urlBox {
    cursor: pointer;
    margin: 20px 30px;
    padding: 10px;
    border: 1px solid $base;
    border-radius: 100px;
    display: flex;
    align-items: center;
    &-url {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .fa {
      margin: 0 5px 0 5px;
      line-height: 1.7;
    }
  }
  &-buttons {
    margin: 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-item {
      cursor: pointer;
      border-radius: 2px;
      padding: 7px 15px;
      border: 1px solid $base;
      &.disabled {
        background-color: $base-bg;
        border: none;
      }
    }
  }
}
</style>

<template>
  <div class="gameUrl">
    <div class="gameUrl-title">karuta</div>
    <div class="gameUrl-urlBox" @click="copy">
      <i class="fa fa-files-o" />
      <p class="gameUrl-urlBox-url">{{ urlHash ? url : 'ここにURLが表示されます' }}</p>
      <div class="gameUrl-urlBox-copied" v-if="copied">copied!!</div>
    </div>
    <div class="gameUrl-buttons">
      <div class="gameUrl-buttons-item" :class="{ disabled: urlHash }" @click="makeGameUrl">URLを発行</div>
      <div class="gameUrl-buttons-item" :class="{ disabled: !urlHash }" @click="moveToGame">対戦ページに移動</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      urlHash: null,
      copied: false
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
    },
    copy () {
      if (!this.urlHash) return
      const tempTextArea = document.createElement('textarea')
      tempTextArea.value = this.url
      document.body.appendChild(tempTextArea)
      tempTextArea.select()
      document.execCommand('copy')
      document.body.removeChild(tempTextArea)
      this.copied = true
      setInterval(() => {
        this.copied = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.gameUrl {
  margin-top: 30vh;
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
    position: relative;
    &-url {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .fa {
      margin: 0 5px 0 5px;
      line-height: 1.7;
    }
    &-copied {
      position: absolute;
      left: 15px;
      top: -20px;
      font-size: 12px;
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

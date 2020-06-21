<template>
  <div v-if="data">
    <p>ここにデータ表示</p>
    <div class="button" @click="hitKaruta">カルタGET</div>
  </div>
  <div v-else>ロード中だよ</div>
</template>

<script>
export default {
  data () {
    return {
      data: null
    }
  },
  created () {
    if (this.$route.params.user_key) return this.getGameInfo()
    this.$store.dispatch('getUserKey', this.gameKey).then(res => {
      this.$router.replace({ params: { user_key: res.key } })
      this.getGameInfo()
    })
  },
  methods: {
    getGameInfo () {
      this.$store.dispatch('getGameInfo', { gameKey: this.gameKey, userKey: this.userkey }).then(res => {
        this.data = res
      })
    },
    hitKaruta () {
      this.$store.dispatch('hitKaruta', { userKey: this.userkey, karutaId: 1 })
    }
  },
  computed: {
    gameKey () {
      return this.$route.params.game_key
    },
    userkey () {
      return this.$route.params.user_key
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  cursor: pointer;
  border-radius: 2px;
  margin: 15px 30px;
  padding: 7px 15px;
  border: 1px solid $base;
}
</style>

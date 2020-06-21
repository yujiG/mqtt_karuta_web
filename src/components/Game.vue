<template>
  <div v-if="data">
    <p>ここにデータ表示</p>
    <div class="button" @click="hitKaruta">カルタGET</div>
  </div>
  <div v-else>ロード中だよ</div>
</template>

<script>
import KarutaMapper from '@/utils/karuta-mapper'
export default {
  data () {
    return {
      data: null,
      karutaMapper: null,
      targetKarutaId: 1
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
        this.karutaMapper = new KarutaMapper(res.karutas)
        this.$mqtt.on('message', this.subscribeMessage)
        this.$mqtt.subscribe(this.hitKarutaMqttPath)
      })
    },
    hitKaruta () {
      const postParams = { karutaId: this.targetKarutaId, userKey: this.userkey }
      this.$store.dispatch('hitKaruta', postParams)
      const mqttParams = { karutaId: this.targetKarutaId, userId: this.myId, timeStamp: new Date().getTime() }
      this.$mqtt.publish(this.hitKarutaMqttPath, JSON.stringify(mqttParams))
    },
    parseMqttpayload (payloadUint8Array) {
      try {
        return JSON.parse(new TextDecoder().decode(payloadUint8Array))
      } catch (e) {
        return null
      }
    },
    subscribeMessage (path, payloadUint8Array) {
      const payload = this.parseMqttpayload(payloadUint8Array)
      if (!payload) return console.log('parse Error!') // TODO: ログ出力の内容を調整する
      switch (path) {
        case this.hitKarutaMqttPath:
          this.hitKarutaFromMqtt(payload.karutaId, payload.userId, payload.timeStamp)
          break
      }
    },
    hitKarutaFromMqtt (karutaId, userId, timeStamp) {
      if (karutaId !== this.targetKarutaId || !Number.isInteger(userId) || !Number.isInteger(timeStamp)) return
      this.karutaMapper.hitKaruta(karutaId, userId, timeStamp)
    }
  },
  computed: {
    gameKey () {
      return this.$route.params.game_key
    },
    userkey () {
      return this.$route.params.user_key
    },
    hitKarutaMqttPath () {
      return `karuta/${this.gameKey}/karuta_id`
    },
    myId () {
      return this.data.users.find(v => v.is_me).id
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

<template>
  <div v-if="data">
    <game-title />
    <ul class="gameUsers">
      <li class="gameUsers-user" v-for="(v, i) in karutaMapper.usersInfo" :key="i">
        <i class="fa fa-stop" :class="`color-${i % COLOR_SIZE}`" />
        <p>ID : {{ v.userId }} /</p>
        <div class="gameUsers-user-point">{{ v.points }}点</div>
      </li>
    </ul>
    <div>現在のカルタID : {{ targetKarutaId }}</div>
  </div>
  <div v-else>ロード中だよ</div>
</template>

<script>
import GameTitle from '@/components/GameTitle'
import KarutaMapper from '@/utils/karuta-mapper'
const COLOR_SIZE = 3
export default {
  components: { GameTitle },
  data () {
    return {
      data: null,
      karutaMapper: null,
      targetKarutaId: null,
      COLOR_SIZE
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
        this.$mqtt.subscribe(this.targetKarutaMqttPath)
        this.publishInitialize()
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
          this.karutaMapper.hitKaruta(payload.karutaId, payload.userId, payload.timeStamp)
          break
        case this.targetKarutaMqttPath:
          this.targetKarutaId = payload.karutaId
          break
      }
    },
    publishInitialize () {
      this.$mqtt.publish(this.hitKarutaMqttPath, JSON.stringify({ userId: this.myId }))
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
      return `karuta/${this.gameKey}/hit_karuta`
    },
    targetKarutaMqttPath () {
      return `karuta/${this.gameKey}/new_target_karuta`
    },
    myId () {
      return this.data.users.find(v => v.is_me).id
    }
  }
}
</script>

<style lang="scss" scoped>
$user-color0: #CDD2EB;
$user-color1: #D8EBCD;
$user-color2: #EBCDCD;
.gameUsers {
  &-user {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .fa {
      font-size: 10px;
      line-height: 21px;
      margin-right: 5px;
      &.color-0 { color: $user-color0; }
      &.color-1 { color: $user-color1; }
      &.color-2 { color: $user-color2; }
    }
    &-point {
      margin-left: 10px;
      text-align: end;
      width: 40px;
    }
  }
}
</style>

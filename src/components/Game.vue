<template>
  <div>
    <game-title />
    <div v-if="data">
      <ul class="gameUsers">
        <li class="gameUsers-user" v-for="(v, i) in karutaMapper.usersInfo" :key="i">
          <i class="fa fa-stop" :class="userColor(v.userId)" />
          <p><span :class="{ me: v.userId === myId }">ID : {{ v.userId }}</span> /</p>
          <div class="gameUsers-user-point">{{ v.points }}点</div>
        </li>
      </ul>
      <ul class="karutas">
        <li class="karutas-item blank" />
        <li class="karutas-item blank" />
        <li class="karutas-item" :class="[{ target: v.karutaId === targetKarutaId }, userColor(v.userId)]" @click="hitKaruta(v.karutaId)" v-for="(v, i) in karutaMapper.karutasMinUserId" :key="i">
          {{ v.name }}
        </li>
      </ul>
    </div>
    <div class="loading" v-else-if="errorMessage">{{ errorMessage }}</div>
    <div class="loading" v-else>ロード中だよ</div>
  </div>
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
      errorMessage: null,
      COLOR_SIZE
    }
  },
  created () {
    if (this.$route.params.user_key) return this.getGameInfo()
    this.$store.dispatch('getUserKey', this.gameKey).then(res => {
      this.$router.replace({ params: { user_key: res.key } })
      this.getGameInfo()
    }).catch(e => {
      this.errorMessage = e.response.data.message
    })
  },
  methods: {
    getGameInfo () {
      this.$store.dispatch('getGameInfo', { gameKey: this.gameKey, userKey: this.userkey }).then(res => {
        this.data = res
        this.karutaMapper = new KarutaMapper(res.karutas, res.users, res.points)
        this.targetKarutaId = res.game.karuta_id
        this.$mqtt.on('message', this.subscribeMessage)
        this.$mqtt.subscribe(this.hitKarutaMqttPath)
        this.$mqtt.subscribe(this.targetKarutaMqttPath)
        this.publishInitialize()
      })
    },
    userColor (userId) {
      const index = this.karutaMapper.usersInfo.findIndex(v => v.userId === userId)
      return index === -1 ? null : `color-${index}`
    },
    hitKaruta (id) {
      if (id !== this.targetKarutaId || this.karutaMapper.isHitted(id)) return
      const postParams = { karutaId: id, userKey: this.userkey }
      this.$store.dispatch('hitKaruta', postParams)
      const mqttParams = { karutaId: id, userId: this.myId, timeStamp: new Date().getTime() }
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
$target-karuta: #F0697A;
.loading {
  text-align: center;
  margin-top: 30vh;
}
.gameUsers {
  &-user {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .me {
      color: $target-karuta;
    }
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
.karutas {
  margin-top: 50px;
  max-height: 360px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  border-top: 1px solid $base;
  border-left: 1px solid $base;
  &-item {
    text-align: center;
    width: calc((100% / 7) - 1px);
    height: 50px;
    line-height: 50px;
    border-right: 1px solid $base;
    border-bottom: 1px solid $base;
    &.target {
      cursor: pointer;
      color: white;
      background-color: $target-karuta;
    }
    &.color-0 { background-color: $user-color0; color: $base; }
    &.color-1 { background-color: $user-color1; color: $base; }
    &.color-2 { background-color: $user-color2; color: $base; }
    &.blank { background-color: $base-bg; }
  }
}
</style>

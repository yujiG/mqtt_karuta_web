<template>
  <div>
    <game-title />
    <game-result v-if="isFinished" :data="data" :karutaMapper="karutaMapper" />
    <template v-else-if="data">
      <ul class="gameUsers">
        <li class="gameUsers-user" v-for="(v, i) in karutaMapper.usersInfo" :key="i">
          <i class="fa fa-stop" :class="userColor(v.userId)" />
          <p><span :class="{ me: v.userId === myId }">{{ playerName(v.userId) }}</span> /</p>
          <div class="gameUsers-user-point">{{ v.points }}点</div>
        </li>
      </ul>
      <div class="gameMessage">{{ message }}</div>
      <ul class="karutas">
        <li class="karutas-item blank" />
        <template v-for="(v, i) in karutas">
          <li class="karutas-item blank" v-if="i === KARUTAS_CENTER_INDEX" :key="i" />
          <li class="karutas-item" :class="[{ target: v.karutaId === targetKarutaId }, userColor(v.userId)]" @click="hitKaruta(v.karutaId)" :key="i" v-else>
            {{ v.name }}
          </li>
        </template>
        <li class="karutas-item" :class="[{ target: centerKaruta.karutaId === targetKarutaId }, userColor(centerKaruta.userId)]" @click="hitKaruta(centerKaruta.karutaId)">
          {{ centerKaruta.name }}
        </li>
      </ul>
    </template>
    <div class="loading" v-else-if="errorMessage">{{ errorMessage }}</div>
    <div class="loading" v-else>ロード中だよ</div>
  </div>
</template>

<script>
import GameTitle from '@/components/GameTitle'
import GameResult from '@/components/GameResult'
import KarutaMapper from '@/utils/karuta-mapper'
import { shuffle } from '@/utils/array-actions'
import resultMessages from '@/resources/result-messages'
const KARUTAS_CENTER_INDEX = 23
export default {
  components: { GameTitle, GameResult },
  data () {
    return {
      data: null,
      karutaMapper: null,
      targetKarutaId: null,
      errorMessage: null,
      isLast: false,
      isFinished: false,
      karutasIndex: null,
      goodMessages: [],
      badMessages: [],
      hitMessage: null,
      KARUTAS_CENTER_INDEX
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
        this.isFinished = res.game.finished
        this.targetKarutaId = res.game.karuta_id
        this.isLast = res.game.is_last
        this.data = res
        this.karutaMapper = new KarutaMapper(res.karutas, res.users, res.points)
        this.karutasIndex = shuffle([...Array(res.karutas.length).keys()])
        this.$mqtt.on('message', this.subscribeMessage)
        this.$mqtt.subscribe(this.hitKarutaMqttPath)
        this.$mqtt.subscribe(this.targetKarutaMqttPath)
        this.publishInitialize()
        this.messageInitialize()
      })
    },
    userColor (userId) {
      const index = this.karutaMapper.usersInfo.findIndex(v => v.userId === userId)
      return index === -1 ? null : `color-${index}`
    },
    playerName (userId) {
      const index = this.karutaMapper.usersInfo.findIndex(v => v.userId === userId)
      return index === -1 ? null : `プレイヤー${index + 1}`
    },
    hitKaruta (id) {
      if (id !== this.targetKarutaId || this.targetHittedUserId) return
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
      if (!payload) return
      switch (path) {
        case this.hitKarutaMqttPath:
          this.karutaMapper.hitKaruta(payload.karutaId, payload.userId, payload.timeStamp)
          if (payload.karutaId) {
            const hitMessages = payload.userId === this.myId ? this.goodMessages : this.badMessages
            this.hitMessage = hitMessages[this.hittedKarutaSize]
          }
          if (this.isLast) this.isFinished = true
          break
        case this.targetKarutaMqttPath:
          this.targetKarutaId = payload.karutaId
          this.isLast = payload.is_last
          break
      }
    },
    publishInitialize () {
      this.$mqtt.publish(this.hitKarutaMqttPath, JSON.stringify({ userId: this.myId }))
    },
    messageInitialize () {
      this.goodMessages = resultMessages.good.pattern_1.concat(shuffle(resultMessages.good.pattern_2))
      this.badMessages = resultMessages.bad.pattern_1.concat(shuffle(resultMessages.bad.pattern_2))
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
    },
    karutas () {
      return this.karutasIndex.map(i => this.karutaMapper.karutasMinUserId[i])
    },
    centerKaruta () {
      return this.karutaMapper.karutasMinUserId[this.karutasIndex[KARUTAS_CENTER_INDEX]]
    },
    targetHittedUserId () {
      return this.karutaMapper.karutasMinUserId.find(v => v.karutaId === this.targetKarutaId).userId
    },
    hittedKarutaSize () {
      return this.karutaMapper.karutasMinUserId.filter(v => v.userId).length
    },
    message () {
      if (this.hittedKarutaSize > 0) {
        return this.hitMessage
      } else {
        return this.startAtText
      }
    },
    startAtText () {
      const date = new Date(this.data.game.start_at)
      const hour = `${date.getHours()}`.padStart(2, '0')
      const minute = `${date.getMinutes()}`.padStart(2, '0')
      return `カルタ開始は ${hour}:${minute}`
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  text-align: center;
  margin-top: 30vh;
}
.gameMessage {
  min-height: 42px;
}
.gameUsers {
  margin: 15px 0;
  height: 65px;
  &-user {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .me {
      color: $red;
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
      background-color: $red;
    }
    &.color-0 { background-color: $user-color0; color: $base; }
    &.color-1 { background-color: $user-color1; color: $base; }
    &.color-2 { background-color: $user-color2; color: $base; }
    &.blank { background-color: $base-bg; }
  }
}
</style>

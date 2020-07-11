<template>
  <div>
    <ul class="gameResult">
      <li class="gameResult-user" v-for="(v, i) in users()" :key="i">
        <div class="gameResult-user-name">
          <p>{{ i + 1 }}位</p>
          <i class="fa fa-stop" :class="userColor(v.userId)" />
          <p :class="{ me: v.userId === myId }">{{ playerName(v.userId) }}</p>
        </div>
        <div>{{ v.points }}点</div>
      </li>
    </ul>
    <router-link class="gameResultClose" :to="{ name: 'GameUrl' }">終了する</router-link>
  </div>
</template>

<script>
export default {
  props: {
    data: null,
    karutaMapper: null
  },
  methods: {
    userColor (userId) {
      const index = this.karutaMapper.usersInfo.findIndex(v => v.userId === userId)
      return index === -1 ? null : `color-${index}`
    },
    playerName (userId) {
      const index = this.karutaMapper.usersInfo.findIndex(v => v.userId === userId)
      return index === -1 ? null : `プレイヤー${index + 1}`
    },
    users () {
      return this.karutaMapper.usersInfo.sort((x, y) => y.points - x.points)
    }
  },
  computed: {
    myId () {
      return this.data.users.find(v => v.is_me).id
    }
  }
}
</script>

<style scoped lang="scss">
.gameResult {
  margin-top: 18vh;
  font-size: 20px;
  &-user {
    padding: 5px;
    margin-bottom: 15px;
    border-bottom: 1px solid $base;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-name {
      display: flex;
      align-items: center;
      .me {
        color: $red;
      }
      .fa {
        font-size: 16px;
        margin: 0 10px 0 20px;
        &.color-0 { color: $user-color0; }
        &.color-1 { color: $user-color1; }
        &.color-2 { color: $user-color2; }
      }
    }
  }
}
.gameResultClose {
  display: block;
  cursor: pointer;
  border-radius: 2px;
  margin: 50px auto;
  padding: 7px 15px;
  border: 1px solid $base;
  width: 100px;
  text-align: center;
  text-decoration: none;
  color: $base;
}
</style>

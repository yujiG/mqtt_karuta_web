import Vue from 'vue'
import Router from 'vue-router'
import GameUrl from '@/components/GameUrl'
import Game from '@/components/Game'
import GameResult from '@/components/GameResult'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GameUrl',
      component: GameUrl
    },
    {
      path: '/karuta/:game_key/:user_key?',
      name: 'Game',
      component: Game
    },
    {
      path: '/karuta/:game_key/:user_key/result',
      name: 'GameResult',
      component: GameResult
    }
  ]
})

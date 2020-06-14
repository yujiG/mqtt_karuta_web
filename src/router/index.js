import Vue from 'vue'
import Router from 'vue-router'
import GameUrl from '@/components/GameUrl'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GameUrl',
      component: GameUrl
    },
    }
  ]
})

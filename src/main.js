// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import VueMqtt from 'vue-mqtt'

Vue.use(VueMqtt, 'ws://127.0.0.1:1884', {clientId: 'WebClient-' + parseInt(Math.random() * 100000)})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

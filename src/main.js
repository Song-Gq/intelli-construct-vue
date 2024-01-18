// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
// import 'elementui-dark/theme/index.css';

Vue.use(VideoPlayer)
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$axios = axios
// let targetDomain = 'https://x.gqsong.xyz:443'
let targetDomain = 'http://localhost:5001'
Vue.prototype.$targetDomain = targetDomain

// axios.defaults.baseURL='/api'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  axios,
  targetDomain,
  router,
  components: { App },
  template: '<App/>'
})

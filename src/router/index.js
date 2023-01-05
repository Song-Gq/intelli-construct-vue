import Vue from 'vue'
import Router from 'vue-router'
import Uploader from '@/components/Uploader'
import Navi from '@/components/Navi'
import ExcavatorState from '@/components/ExcavatorState'
import WaveRecognition from '@/components/WaveRecognition';

// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'Navi',
      component: Navi
    },
    {
      path: '/excavatorState',
      name: 'ExcavatorState',
      component: ExcavatorState
    },
    {
      path: '/waveRecognition',
      name: 'WaveRecognition',
      component: WaveRecognition
    },
  ],
  mode: 'history'
})


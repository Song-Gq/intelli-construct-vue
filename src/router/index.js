import Vue from 'vue'
import Router from 'vue-router'
import Uploader from '@/components/Uploader'
import Navi from '@/components/Navi'
import ExcavatorState from '@/components/ExcavatorState'
import WaveRecognition from '@/components/WaveRecognition'
import DriverFace from '@/components/DriverFace';
import DriverAction from '@/components/DriverAction';
import Equip from "@/components/Equip";

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
    {
      path: '/driverFace',
      name: 'DriverFace',
      component: DriverFace
    },
    {
      path: '/driverAction',
      name: 'DriverAction',
      component: DriverAction
    },
    {
      path: '/equip',
      name: 'Equip',
      component: Equip
    },
  ],
  mode: 'history'
})


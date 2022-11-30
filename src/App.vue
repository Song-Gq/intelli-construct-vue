<template>
  <div id="app" style="margin: 0 auto">
    <el-container>
      <el-header style="padding: 0">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                 :router="true" style="height: 100%"
                 background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item index="index" style="font-size: 18px">基于人工智能的建造安全管理创新示范</el-menu-item>
          <el-menu-item index="1" style="font-size: 18px">人员识别</el-menu-item>
          <el-menu-item index="2" style="font-size: 18px">驾驶室动作</el-menu-item>
          <el-menu-item index="excavatorState" style="font-size: 18px">大型设备</el-menu-item>
          <el-menu-item index="4" style="font-size: 18px">设备操作</el-menu-item>
          <el-menu-item index="5" style="font-size: 18px">声纹识别</el-menu-item>
          <div>
            <el-image :src="require('@/assets/tongji-w.png')" fit="scale-down"
                      style="height: 80%; margin: 5px auto auto auto; position: absolute; right: 5%"></el-image>
            <el-image :src="require('@/assets/logo-w.png')" fit="scale-down"
                      style="height: 80%; margin: 5px auto auto auto; position: absolute; right: 1%"></el-image>
          </div>
        </el-menu>
<!--        <el-row type="flex" class="row-bg" justify="space-between" style="height: 100%"></el-row>-->
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer style="font-size: 12px; color: grey; height: 60px">
<!--        <div style="margin-top: 5px; color: black;">-->
<!--          已累计识别{{sumPicNum}}-->
<!--        </div>-->
        <div style="margin-top: 5px; color: royalblue">
          Source Code Repository on
          <el-link href="https://github.com/Song-Gq/intelli-construct-vue"
                   style="font-size: 12px; color: royalblue">
            https://github.com/Song-Gq/intelli-construct-vue
          </el-link>
        </div>
        <div style="margin-top: 5px;">
          Copyright © 2022 Trusted AI Lab, Shanghai. All Rights Reserved
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      activeIndex: 'index',
      sumPicNum: 0
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
    },
    // getSumPic() {
    //   return this.$axios.get(this.$targetDomain + '/api/getsum').then(response => {
    //     this.sumPicNum = response.data
    //   })
    // },
    getActiveMenu() {
      // console.log(this.$router.currentRoute.path.substring(1))
      this.activeIndex = this.$router.currentRoute.path.substring(1)
    }
  },
  created() {
    this.getActiveMenu()
  },
  mounted() {

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px;
}
.el-container {
  min-height: 96vh;
}
</style>

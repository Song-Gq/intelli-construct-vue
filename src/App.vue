<template>
  <div id="app" style="margin: 0 auto">
    <el-container>
      <el-header>
        <el-row type="flex" class="row-bg" justify="space-between" style="height: 100%">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                   style="height: 100%;">
            <el-menu-item index="1" style="font-size: 18px">上海地区核酸检测截图文本识别系统</el-menu-item>
          </el-menu>
          <el-col :span="4">
            <el-image :src="require('@/assets/tongji.png')" fit="scale-down"
                      style="height: 80%; width: 10%; margin: 5px auto auto auto; position: absolute; right: 50px"></el-image>
            <el-image :src="require('@/assets/logo.png')" fit="scale-down"
                      style="height: 80%; width: 10%; margin: 5px 5% auto auto; position: absolute;"></el-image>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer style="font-size: 12px; color: grey; height: 60px">
        <div style="margin-top: 5px; color: black;">
          已累计识别图片{{sumPicNum}}张
        </div>
        <div style="margin-top: 5px; color: royalblue">
          Source Code Repository on
          <el-link href="https://github.com/Song-Gq/shanghai-nucleic-acid-ocr"
                   style="font-size: 12px; color: royalblue">
            https://github.com/Song-Gq/shanghai-nucleic-acid-ocr
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
      activeIndex: '1',
      sumPicNum: 0
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      // this.$router.go(0)
    },
    getSumPic() {
      return this.$axios.get(this.$targetDomain + '/api/getsum').then(response => {
        this.sumPicNum = response.data
      })
    }
  },
  created() {
    this.getSumPic()
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

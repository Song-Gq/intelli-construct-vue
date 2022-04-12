<template>
  <div id="app" style="margin-top: 0">
    <el-container>
      <el-header>
        <el-row type="flex" class="row-bg" justify="space-between" style="height: 100%">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                   style="height: 100%">
            <el-menu-item index="1">Nucleic Acid Test Screenshot OCR</el-menu-item>
          </el-menu>
          <el-image :src="require('@/assets/logo.png')" fit="scale-down" style="height: 80%"></el-image>
        </el-row>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      activeIndex: '1',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      // this.$router.go(0)
    }
  },
  mode: 'history'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

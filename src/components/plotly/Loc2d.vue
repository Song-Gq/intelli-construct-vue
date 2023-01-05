<template>
  <Plotly :data="figData" :layout="figLayout" :display-mode-bar="false">}</Plotly>
</template>

<script>
import {Plotly} from "vue-plotly"

export default {
  props: ["figData", "figLayout"],
  components: {
    Plotly
  },
  name: "Loc2d",
  data() {
    return {
      // data:[{
      //   x: [1,2,3,4],
      //   y: [10,15,13,17],
      //   type:"scatter"
      // }],
      // layout:{
      //   title: ""
      // }
    }
  }
}
</script>

<style scoped>

</style>

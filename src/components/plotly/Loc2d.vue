<template>
  <Plotly :data="figData" :layout="layout" :display-mode-bar="false">}</Plotly>
</template>

<script>
import {Plotly} from "vue-plotly"

export default {
  props: ["figData"],
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
      layout:{
        title: "excavator"
      }
    }
  }
}
</script>

<style scoped>

</style>

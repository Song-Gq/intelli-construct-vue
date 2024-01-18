<template>
  <div margin-top="30px">
    <div v-show="in_prog">
      {{prog_text}}
      <el-progress :percentage="prog" style="margin: 5px auto 50px auto; width: 80%"
                   :text-inside="true" :stroke-width="26" :status="prog_stat"></el-progress>
    </div>
    <div>
      <div style="font-weight: bolder; font-size: larger; color: #FFF; float: left; margin-left: 400px">
        CAM1 挖机工作状态识别
      </div>
      <div style="font-weight: bolder; font-size: larger; color: #FFF; float: left; margin-left: 600px">
        CAM2 人体异常行为识别
      </div>
      <div style="font-weight: bolder; font-size: larger; color: #FFF; float: right; margin-right: 300px">
        CAM3 挖机工作状态识别
      </div>
    </div>
    <video height="950" src="/static/vid2-h264.mp4"
           style="float: right; margin: 20px 20px; padding-right: 100px"
           autoplay="autoplay"></video>
    <div>
      <div>
        <video width="800" src="/static/vid1.mp4" style="margin: 20px"
               autoplay="autoplay"></video>
        <video width="800" src="/static/vid3-h264.mp4" style="margin: 20px"
               autoplay="autoplay"></video>

      </div>
      <div>
        <video width="800" src="/static/vid4-h264.mp4" style="margin: 20px"
               autoplay="autoplay"></video>
        <video width="800" src="/static/vid5-h264.mp4" style="margin: 20px"
               autoplay="autoplay"></video>
      </div>
      <div>
        <div style="font-weight: bolder; font-size: larger; color: #FFF; float: left; margin-left: 400px">
          CAM4 人体异常行为识别
        </div>
        <div style="font-weight: bolder; font-size: larger; color: #FFF; float: left; margin-left: 600px">
          CAM5 人体异常行为识别
        </div>
      </div>
    </div>
<!--    <div style="margin-top: 40px;">-->
<!--      <Equip></Equip>-->
<!--    </div>-->
<!--    <div style="margin-top: 40px;">-->
<!--      <DriverFace></DriverFace>-->
<!--    </div>-->
<!--    <div style="margin-top: 40px;">-->
<!--      <ExcavatorState></ExcavatorState>-->
<!--    </div>-->
<!--    <div style="margin-top: 40px;">-->
<!--      <DriverAction></DriverAction>-->
<!--    </div>-->
<!--    <div style="margin-top: 40px;">-->
<!--      <WaveRecognition></WaveRecognition>-->
<!--    </div>-->
  </div>
</template>

<script>
import axios from "axios";
import DriverActionBatch from "./batch/DriverActionBatch";
import Loc2d from "./plotly/Loc2d";
import Equip from "./Equip";
import DriverFace from "./DriverFace";
import ExcavatorState from "./ExcavatorState";
import DriverAction from "./DriverAction";
import WaveRecognition from "./WaveRecognition";


export default {
  name: "Navi",
  components: {
    DriverActionBatch,
    Equip,
    DriverFace,
    ExcavatorState,
    DriverAction,
    WaveRecognition
  },
  data() {
    return {
      fileList: [],
      prog: 0,
      in_prog: false,
      prog_stat: null,
      prog_text: "正在上传文件，速度取决于网络状况，请耐心等待...",
      tableData: [],
      misData: [],
      timer: null,
      f_exist: false,
      server_available: false,
      recog_started: false
    };
  },
  computed: {
    chosenfilenum: function () {
      return this.fileList.length
    },
    resultfilenum: function () {
      return this.tableData.length
    }
  },
  methods: {
    rowStatus({row, rowIndex}) {
      return {'background-color': 'oldlace'}
    },
    handleChange(file, fileList) {
      let pos = file.name.lastIndexOf('.')
      let suffix = file.name.substring(pos, file.name.length)
      const isJSON = (suffix === '.json');
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isJSON) {
        this.$message.error('上传文件只能是 JSON 格式!');
        fileList.pop()
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!');
        fileList.pop()
      }
      if (fileList.length > 200) {
        this.$message.error('单次识别数量不能超过 200!');
        fileList.pop()
      }
      this.fileList = fileList;
    },
    submitUpload() {
      this.getToken().then(response => {
        // console.log(response)
        window.sessionStorage.setItem('token', response.data)
        this.server_available = true
        this.in_prog = true
        this.getProgress()
        // 创建新的数据对象
        let formData = new FormData();
        let id = 1
        // 将上传的文件放到数据对象中
        this.fileList.forEach(file => {
          formData.append("id=" + id.toString() + "=" + file.name, file.raw);
          // this.fileList.name.push(file.name);
          id += 1
        });
        // console.log("提交前",formData.getAll('file'));

        // 文件名
        // formData.append('fileName', this.fileList.name);
        // 自定义上传
        this.uploadFile(formData).then(response => {
          console.log(response);
          console.log(response.status);
          this.prog = 100
          this.prog_stat = "success"
          this.prog_text = "识别成功，刷新页面可重新上传"
          this.clearTimer()
          let res_d = response.data
          let res = res_d.res
          for (let i in res) {
            // console.log(res[i][3])
            this.tableData.push({'date': res[i][2], 'name': res[i][1], 'type': res[i][0], 'result': res[i][3]})
          }
          let mis = res_d.mis
          if(mis !== null) {
            for (let i in mis) {
              // console.log(res[i][3])
              this.misData.push({'date': mis[i][2], 'name': mis[i][1], 'type': mis[i][0], 'result': mis[i][3]})
            }
          }
          // if(response.code == 200){
          //   this.$refs.upload.clearFiles();
          //   this.msgSuccess('上传成功！');
          // }else{
          //   this.$message.error(response.msg);
          // }
        })
          .catch(error => {
            console.log(error)
            // this.$message.error('文件总大小不能超过20MB，请分批上传识别！');
            this.$message.error('上传识别失败！若文件总大小超过20MB，请尝试分批上传');
            this.prog_stat = "exception"
            this.prog_text = "请刷新页面重试"
            this.clearTimer()
          });
      })
        .catch(error => {
          console.log(error)
          this.server_available = false
          this.$message.error('服务当前同时使用人数过多！请稍后重试...');
        })
    },
    uploadFile(params) {
      // for(var pair of params.entries()) {
      //   console.log(pair[0]+ ', '+ pair[1]);
      // }
      return this.$axios.post(this.$targetDomain + `/api/recognition`, params,
        { headers: { 'Content-Type': 'multipart/form-data',
            token: window.sessionStorage.getItem('token')}
        })
    },
    getProgress() {
      this.timer = setInterval(() => {  //创建定时器
        this.getStatus().then(response => {
          // console.log(response);
          // token valid but upload not done
          if(response.data === -2) {
            if(!this.recog_started) {
              this.prog_text = "正在上传文件，速度取决于网络状况，请耐心等待..."
              this.prog = 0
            }
          }
          else if(response.data === -1) {
            this.$message.warning('进度获取出现问题...暂不显示实时进度');
            this.clearTimer()
            this.prog_text = "仍正在识别，请耐心等待数分钟...如仍无结果请刷新页面重试"
          }
          else {
            this.recog_started = true
            this.prog_text = "已上传完成，正在识别，请耐心等待..."
            this.prog = Math.round(response.data * 100)
            if(this.prog === 100) {
              this.clearTimer()
            }
          }
        })
          .catch(error => {
            this.$message.warning('进度获取出现问题...暂不显示实时进度');
            this.clearTimer()
          })
      }, 2000);
    },
    getStatus() {
      return this.$axios.get(this.$targetDomain + '/api/getprog', {params: {
          token: window.sessionStorage.getItem('token'), timeout: 2000
        }})
    },
    clearTimer() {//清除定时器
      clearInterval(this.timer);
      this.timer = null;
    },
    export2excel() {
      this.getExcel().then(response => {
        const blob = new Blob([response.data], {type: 'application/vnd.ms-excel'})
        const link = document.createElement('a')
        let d = new Date()
        link.download = "核酸检测报告-"
          + d.getFullYear() + "-"
          + d.getMonth() + "-"
          + d.getDate() + "-"
          + d.getHours() + '-'
          + d.getMinutes() + "-"
          + d.getSeconds() + ".xls" // a标签添加属性
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click() // 执行下载
        URL.revokeObjectURL(link.href)  // 释放 blob 对象
        document.body.removeChild(link)
      })
    },
    getExcel() {
      return this.$axios.get(this.$targetDomain + '/api/getexcel', {params: {
          token: window.sessionStorage.getItem('token')}, responseType: 'arraybuffer'})
    },
    getToken() {
      return this.$axios.get(this.$targetDomain + '/api/gettoken', {params: {
        }})
    },
    destroyToken() {
      let t = window.sessionStorage.getItem('token')
      if(t != null) {
        return this.$axios.delete(this.$targetDomain + '/api/destroytoken',{params: {
            token: t}
        })}
    }
  },
  mode: 'history',
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  beforeMount() {
    window.sessionStorage.removeItem('token')
    this.server_available = false
  },
  mounted() {
    window.addEventListener('beforeunload', (event) => {
      // this.destroyToken()
      // event.preventDefault()
    })},
  created() {
    this.$nextTick(() => {
      this.$refs.upload.$children[0].$refs.input.webkitdirectory = true
    })
  }
}
</script>

<style scoped>

</style>

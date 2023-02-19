<template>
  <div style="margin-top: 30px">
    <div v-show="in_prog">
      {{prog_text}}
      <el-progress :percentage="prog" style="margin: 5px auto 50px auto; width: 80%"
                   :text-inside="true" :stroke-width="26" :status="prog_stat"></el-progress>
    </div>
    <el-row :gutter="40">
      <el-col :span="1">
        <el-upload
          class="upload-demo"
          action="#"
          :multiple="true"
          :auto-upload="false"
          :on-change="handleChange"
          :file-list="fileList"
          :disabled="in_prog"
          :show-file-list="false"
          style="float: left; margin-left: 150%">
          <el-button slot="trigger" size="small" type="primary" :disabled="in_prog" style="font-size: 14px">
            批量选取JSON</el-button>
        </el-upload>
      </el-col>
      <el-col :span="3" style="pointer-events: none">
        <el-upload
          class="upload"
          ref="upload"
          action="#"
          :multiple="true"
          :auto-upload="false"
          :on-change="handleChange"
          :file-list="fileList"
          :disabled="in_prog">
          <div slot="tip" class="el-upload__tip" style="margin-top: 30px; font-size: 14px">
            文件大小不能超过10MB</div>
          <div slot="tip" class="el-upload__tip" style="margin-top: 5px; font-size: 14px">
            选取文件数：{{chosenfilenum}}</div>
        </el-upload>
      </el-col>
      <el-col :span="1">
        <el-button style="float: right; margin-right: 150%; font-size: 14px" size="small" type="success"
                   v-if="fileList.length === 0" :disabled="true">开始识别</el-button>
        <el-button style="float: right; margin-right: 150%; font-size: 14px" size="small" type="success"
                   @click="submitUpload" v-if="fileList.length !== 0" :disabled="in_prog">开始识别</el-button>
      </el-col>
      <el-col :span="19">
        <div v-show="in_prog">
          {{prog_text}}
          <el-progress :percentage="prog" style="margin: 5px auto 50px auto; width: 80%"
                       :text-inside="true" :stroke-width="26" :status="prog_stat"></el-progress>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Navi",
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
        // this.getProgress()
        for (let id = 0; id < this.fileList.length; id++) {
          let formData = new FormData();
          formData.append("id=" + id.toString() + "=" + file.name, file.raw);
          this.uploadFile(formData).then(response => {
            console.log(response);
            console.log(response.status);
            this.prog = id / this.fileList.length
            let res_d = response.data
            // console.log(res_d)
            let res = res_d.res
            // console.log(res)
          })
            .catch(error => {
              console.log(error)
              // this.$message.error('文件总大小不能超过20MB，请分批上传识别！');
              this.$message.error('上传识别失败！');
              this.prog_stat = "exception"
              this.prog_text = "请刷新页面重试"
              this.clearTimer()
            });
        }
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
      return this.$axios.post(this.$targetDomain + `/api/driverAction`, params,
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

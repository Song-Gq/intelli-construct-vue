<template>
  <div style="margin-top: 30px">
    <el-row :gutter="40">
      <el-col :span="12">
        <div v-show="in_prog" >
          {{prog_text}}
          <el-progress :percentage="prog" style="margin: 5px auto 20px auto; width: 80%"
                       :text-inside="true" :stroke-width="26" :status="prog_stat"></el-progress>
        </div>
        <el-upload
          class="upload-demo"
          action="#"
          :multiple="true"
          :auto-upload="false"
          :on-change="handleChange"
          :file-list="fileList"
          :disabled="in_prog">
          <!--      <el-button size="small" type="primary">点击上传</el-button>-->
          <el-button slot="trigger" size="small" type="primary" :disabled="in_prog">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload"
                     :disabled="in_prog">开始识别</el-button>
          <div slot="tip" class="el-upload__tip">批量上传核酸检测截图JPEG文件，每张建议不超过200KB</div>
        </el-upload>
      </el-col>
      <el-col :span="12">
        <template>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型">
            </el-table-column>
            <el-table-column
              prop="result"
              label="结果">
            </el-table-column>
          </el-table>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Uploader",
  data() {
    return {
      fileList: [],
      prog: 0,
      in_prog: false,
      prog_stat: null,
      prog_text: "正在上传识别，请耐心等待...",
      tableData: [],
      timer: null
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    submitUpload() {
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
        this.prog = 100
        this.prog_stat = "success"
        this.prog_text = "识别成功，刷新页面可重新上传"
        this.clearTimer()
        let res_d = response.data
        let res = res_d.res
        for (let i in res) {
          // console.log(res[i][3])
          this.tableData.push({'date': res[i][3], 'name': res[i][2], 'type': res[i][1], 'result': res[i][4]})
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
          this.$message.error('上传识别失败！');
          this.prog_stat = "exception"
          this.prog_text = "请刷新页面重试"
          this.clearTimer()
        });
    },
    uploadFile(params) {
      // for(var pair of params.entries()) {
      //   console.log(pair[0]+ ', '+ pair[1]);
      // }
      return this.$axios.post(`http://127.0.0.1:5000/api/recognition`, params,
        { headers: { 'Content-Type': 'multipart/form-data', token: window.localStorage.getItem('token')}})
    },
    getProgress() {
      this.timer = setInterval(() => {  //创建定时器
        this.getStatus().then(response => {
          // console.log(response);
          this.prog = Math.round(response.data * 100)
        })
        .catch(error => {
          this.$message.warning('进度获取出现问题...暂不显示实时进度');
          this.clearTimer()
        })
      }, 2000);
    },
    getStatus() {
      return this.$axios.get('http://127.0.0.1:5000/api/getprog', {params: {
          // ID !!!!!
          proc_ID: 1,
          headers: {token: window.localStorage.getItem('token')}
        }})
    },
    clearTimer() {//清除定时器
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  mode: 'history',
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
}
</script>

<style scoped>

</style>

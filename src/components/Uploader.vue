<template>
  <div>
    <el-upload
      class="upload-demo"
      action="#"
      :multiple="true"
      :auto-upload="false"
      :on-change="handleChange"
      :file-list="fileList">
<!--      <el-button size="small" type="primary">点击上传</el-button>-->
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">开始识别</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Uploader",
  data() {
    return {
      fileList: []
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    submitUpload() {
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
        // if(response.code == 200){
        //   this.$refs.upload.clearFiles();
        //   this.msgSuccess('上传成功！');
        // }else{
        //   this.$message.error(response.msg);
        // }
      })
        .catch(error => {
          this.$message.error('上传失败！');
        });
    },
    uploadFile(params) {
      // for(var pair of params.entries()) {
      //   console.log(pair[0]+ ', '+ pair[1]);
      // }
      return this.$axios.post(`http://127.0.0.1:5000/api/recognition`, params,
        { headers: { 'Content-Type': 'multipart/form-data', token: window.localStorage.getItem('token')}})
    }
  },
  mode: 'history'
}
</script>

<style scoped>

</style>

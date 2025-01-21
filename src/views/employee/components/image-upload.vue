<template>
  <el-upload class="avatar-uploader"
             action=""
             :show-file-list="false"
             :before-upload="beforeAvatarUpload"
             :http-request="uploadImage">
    <!-- (自动上传)action是上传地址 人资项目不需要 人资项目(手动上传)  -->
    <!-- show-file-list不展示列表 -->
    <img v-if="value"
         :src="value"
         class="avatar">
    <i v-else
       class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 检查函数 判断文件的类型还有大小 return  true(继续上传)/false(停止上传)
    beforeAvatarUpload (file) {
      // jpeg png gif bmp

      const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 5 // 5M

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    uploadImage (params) {
      const cos = new COS({
        SecretId: 'AKIDmQpxuLjsDJ9l8F8mBLGWggS3auzqSpzu',
        SecretKey: 'nLfldIjwvfARTHsEUVIuGPQBgx41jDRQ'
      })
      cos.putObject({
        Bucket: 'pauli-1327145049',
        Region: 'ap-nanjing',
        Key: 'params.file.name',
        StorageClass: 'STANDARD',
        Body: params.file
      }, (err, data) => {
        if (data.statusCode === 200 && data.Location) {
          this.$emit('input', 'http://' + data.Location)
        } else {
          this.$message.error(err.message)
        }
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

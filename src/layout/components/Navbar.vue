<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="username">{{ name?.charAt(0) }}</span>
          <span class="name">{{ name }}</span>
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 弹出层 -->
    <el-dialog width="500px" title="修改密码" :visible.sync="showDialog" @close="btnCancel">
      <el-form ref="passForm" label-width="120px" :model="passForm" :rules="rules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" show-password size="small" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="btnOk">确认修改</el-button>
          <el-button size="mini">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'
// import router from '@/router'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      showDialog: false,
      passForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }], // 旧密码
        newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          min: 6,
          max: 16,
          message: '新密码的长度为6-16位之间'
        }], // 新密码
        confirmPassword: [{ required: true, message: '重复密码不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          validator: (rule, value, callback) => {
            // value
            if (this.passForm.newPassword === value) {
              callback()
            } else {
              callback(new Error('重复密码和新密码输入不一致'))
            }
          }
        }] // 确认密码字段
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    updatePassword() {
      this.showDialog = !this.showDialog
    },
    btnOk() {
      this.$refs.passForm.validate(async isOK => {
        if (isOK) {
          await updatePassword(this.passForm)
          this.$message.success('修改密码成功')
          this.btnCancel()
          this.$router.push('/login')
        }
      })
    },
    btnCancel() {
      this.$refs.passForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .username {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
          background: #04c9be;
          color: #fff;
          margin-right: 4px;
        }

        .name {
          //  用户名称距离右侧距离
          margin-right: 10px;
          font-size: 16px;
        }
        .el-icon-setting {
          font-size: 20px;
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

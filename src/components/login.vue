<template>
  <div class="loginPage">
    <div class="loginBox">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <!-- 登录表单 -->
      <el-form ref="loginRef"
               :model="loginForm"
               label-width="80px"
               :rules="loginRules"
               class="login_form">
        <!-- 用户名 -->
        <el-form-item label="用户名："
                      prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码："
                      prop="password">
          <el-input v-model="loginForm.password"
                    show-password></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary"
                     @click="loginBtn">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur'
          }]
      }
    }
  },
  methods: {
    loginBtn () {
      this.$refs.loginRef.validate(async valid => {
        console.log(valid)
        if (!valid) { return }
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) { return this.$message.error('输入错误') }
        this.$message.success('登录成功！')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/index')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.loginPage {
  background-color: #2b5b6b;
  height: 100%;
}
.loginBox {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

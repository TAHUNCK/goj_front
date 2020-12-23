<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Register</h3>
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="email"
          v-model="registerForm.email"
          placeholder="Email"
          name="email"
          type="email"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="rePassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="rePassword"
          v-model="registerForm.rePassword"
          :type="passwordType"
          placeholder="RePassword"
          name="rePassword"
          tabindex="3"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="captcha">
        <span class="svg-container">
          <svg-icon icon-class="nested" />
        </span>
        <el-input
          v-model="registerForm.captcha"
          placeholder="Captcha"
        >
          <el-button slot="suffix" :loading="codeLoading" class="captcha-btn" type="info" @click="sendCaptcha">发送验证码</el-button>
        </el-input>
      </el-form-item>

      <el-button :loading="loading" type="success" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">Register</el-button>
      <router-link to="/login/index">
        <el-button type="primary" style="width:100%;margin-bottom:30px;">Login</el-button>
      </router-link>
    </el-form>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'
import { validateCode, register } from '@/api/user'
import { Message } from 'element-ui'
import { setAvatar, setToken, setUserId } from '@/utils/auth'

export default {
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Please enter the correct email'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('The password can not be less than 8 digits'))
      } else {
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('The password can not be less than 8 digits'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('The two passwords are different'))
      } else {
        callback()
      }
    }
    const captcha = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('Please enter a 6-bit captcha'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        email: '',
        password: '',
        rePassword: '',
        captcha: ''
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        rePassword: [{ request: true, trigger: 'blur', validator: validatePassword2 }],
        captcha: [{ request: true, trigger: 'blur', validator: captcha }]
      },
      loading: false,
      codeLoading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    sendCaptcha() {
      if (!validEmail(this.registerForm.email)) {
        Message.error('邮箱输入错误！')
        return
      }
      this.codeLoading = true
      const formData = new FormData()
      formData.append('to', this.registerForm.email)
      validateCode(formData).then(res => {
        Message.success(res.message)
        this.codeLoading = false
      }).catch(() => {
        this.codeLoading = false
      })
    },
    handleRegister() {
      const formData = new FormData()
      formData.append('email', this.registerForm.email)
      formData.append('password', this.registerForm.password)
      formData.append('rePassword', this.registerForm.rePassword)
      formData.append('captcha', this.registerForm.captcha)
      register(formData).then(res => {
        setToken(res.data.token, res.data.expiresIn)
        setUserId(res.data.userId, res.data.expiresIn)
        setAvatar(res.data.headPortrait, res.data.expiresIn)
        Message.success(res.message)
        setTimeout(() => {
          this.$router.go(0)
          this.$router.push('/')
        }, 2000)
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.captcha-btn{
  height: 52px;
  background: transparent;
  border-radius: 4px;
  border: 0;
  position: relative;
  right: -43px;
  top: -1px;
}
.captcha-btn:hover{
  color: #0acf97;
}

$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.register-container {
  min-height: 700px;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  border-radius: 10px;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 120px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

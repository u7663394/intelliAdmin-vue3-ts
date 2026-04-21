<script setup lang="ts">
import { loginAPI } from '@/apis/user'
import { useUserStore } from '@/stores/user'
import { setLocalToken } from '@/utils/auth'
import { ElMessage, type FormInstance } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 表单数据 + 校验规则
 */
const formData = ref({
  username: 'demo',
  password: 'Hmzs%001',
  remember: true,
})

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

/**
 * 登录逻辑
 *   1. 校验表单
 *   2. 调用登录接口
 *   3. 成功后保存 token
 *   4. 跳转到首页
 */
const form = ref<FormInstance>()
const userStore = useUserStore()
const router = useRouter()
const onLogin = async () => {
  // 1. 校验表单
  await form.value!.validate()
  // 2. 调用登录接口
  const res = await loginAPI({
    username: formData.value.username,
    password: formData.value.password,
  })
  ElMessage.success('登录成功')
  // 3. 成功后保存 token
  userStore.setToken(res.data.token)
  // 4. 跳转到首页
  router.push('/')
}
</script>

<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <el-form ref="form" :model="formData" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="formData.password" type="password" />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="formData.remember">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="onLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login_body {
  display: flex;
}

.bg {
  width: 60vw;
  height: 100vh;
  background: url('@/assets/login-bg.svg') no-repeat;
  background-position: right top;
  background-size: cover;
}

.box {
  margin: 200px 10% 0;
  flex: 1;

  .title {
    padding-bottom: 76px;
    font-size: 26px;
    font-weight: 500;
    color: #1e2023;
  }

  ::v-deep() {
    .ant-form-item {
      display: flex;
      margin-bottom: 62px;
      flex-direction: column;
    }

    .ant-form-item-label label {
      font-size: 16px;
      color: #8b929d;
    }

    .ant-input,
    .ant-input-password {
      border-radius: 8px;
    }
  }
}

.login_btn {
  width: 100%;
}
</style>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">Vue3权限系统登录</h2>
      <el-form :model="loginForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="loginForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user"></el-option>
            <el-option label="管理员" value="admin"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { usePermissionStore } from '@/stores/permission'

const router = useRouter()
const route = useRoute()
const permissionStore = usePermissionStore()

// 登录表单
const loginForm = ref({
  username: '',
  password: '',
  role: 'user'
})

// 模拟权限配置
const permissionConfig = {
  user: [
    'page.home',
    'page.tools',
    'page.user',
    'btn.add',
    'btn.view',
    'btn.edit'
  ],
  admin: [
    'page.home',
    'page.admin',
    'page.system',
    'page.system.menu',
    'page.system.role',
    'page.system.user',
    'page.system.log',
    'page.system.config',
    'page.system.dict',
    'page.tools',
    'page.dashboard',
    'page.user',
    'btn.add',
    'btn.edit',
    'btn.delete',
    'btn.view',
    'btn.sync',
    'btn.permission',
    'btn.reset',
    'btn.export',
    'btn.import',
    'btn.backup',
    'btn.restore',
    'btn.clean',
    'btn.batchDelete',
    'btn.resetPwd'
  ]
}

// 登录处理
const handleLogin = () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  // 模拟登录验证
  if (loginForm.value.username && loginForm.value.password) {
    // 设置权限
    permissionStore.setPermissions(
      permissionConfig[loginForm.value.role as keyof typeof permissionConfig],
      loginForm.value.role
    )

    ElMessage.success('登录成功')

    // 跳转到之前的页面或首页
    const redirect = route.query.redirect as string || '/home'
    router.push(redirect)
  } else {
    ElMessage.error('用户名或密码错误')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #1989fa;
}

.login-btn {
  width: 100%;
}
</style>

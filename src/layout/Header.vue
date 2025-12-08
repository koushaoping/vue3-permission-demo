<template>
  <div class="header">
    <!-- 左侧折叠按钮 -->
    <div class="header-left">
      <el-button type="text" icon="Menu" @click="toggleCollapse" />
    </div>

    <!-- 右侧用户信息 -->
    <div class="header-right">
      <el-dropdown>
        <div class="user-info">
          <el-avatar :src="userInfo.avatar" icon="User" />
          <span class="username">{{ userInfo.username }}</span>
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="UserFilled">个人中心</el-dropdown-item>
            <el-dropdown-item icon="Setting">账号设置</el-dropdown-item>
            <el-dropdown-item icon="SwitchButton" @click="handleLogout">切换账号</el-dropdown-item>
            <el-dropdown-item divided icon="Logout" @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'
import { UserInfo } from '@/types'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const permissionStore = usePermissionStore()
const collapse = ref(false)

// 模拟用户信息
const userInfo = ref<UserInfo>({
  id: 1,
  username: permissionStore.userRole === 'admin' ? '管理员' : '普通用户',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
})

// 切换侧边栏折叠
const toggleCollapse = () => {
  collapse.value = !collapse.value
}

// 退出登录
const handleLogout = () => {
  permissionStore.clearPermissions()
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 10px;
}
</style>

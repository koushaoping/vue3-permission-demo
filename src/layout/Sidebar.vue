<template>
  <div class="sidebar">
    <!-- 侧边栏logo -->
    <div class="sidebar-logo">
      <h2>权限管理系统</h2>
    </div>

    <!-- 菜单列表 -->
    <el-menu default-active="1" class="sidebar-menu" background-color="#2e3b4e" text-color="#fff"
      active-text-color="#ffd04b" router>
      <template v-for="menu in menuList" :key="menu.path">
        <!-- 有子菜单 -->
        <el-sub-menu v-if="menu.children && menu.children.length" :index="menu.path">
          <template #title>
            <el-icon>
              <component :is="menu.icon" />
            </el-icon>
            <span>{{ menu.title }}</span>
          </template>

          <el-menu-item v-for="child in menu.children" :key="child.path" :index="child.path"
            v-permission="child.permission">
            {{ child.title }}
          </el-menu-item>
        </el-sub-menu>

        <!-- 无子菜单 -->
        <el-menu-item v-else :index="menu.path" v-permission="menu.permission">
          <el-icon>
            <component :is="menu.icon" />
          </el-icon>
          <template #title>{{ menu.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MenuItem } from '@/types'
import { usePermissionStore } from '@/stores/permission'


const defaultMenu: MenuItem[] = [
  {
    path: '/home',
    name: 'home',
    title: '首页',
    icon: 'Home',
    permission: ['page.home']
  },
  {
    path: '/admin',
    name: 'admin',
    title: '管理员管理',
    icon: 'User',
    permission: ['page.admin']
  },
  {
    path: '/system',
    name: 'system',
    title: '系统设置',
    icon: 'Setting',
    permission: ['page.system'],
    children: [
      {
        path: '/system/menu',
        name: 'menu',
        title: '菜单管理',
        permission: ['page.system.menu']
      },
      {
        path: '/system/role',
        name: 'role',
        title: '角色管理',
        permission: ['page.system.role']
      },
      {
        path: '/system/user',
        name: 'user',
        title: '用户管理',
        permission: ['page.system.user']
      },
      {
        path: '/system/log',
        name: 'log',
        title: '日志管理',
        permission: ['page.system.log']
      },
      {
        path: '/system/config',
        name: 'config',
        title: '参数配置',
        permission: ['page.system.config']
      },
      {
        path: '/system/dict',
        name: 'dict',
        title: '字典管理',
        permission: ['page.system.dict']
      }
    ]
  },
  {
    path: '/tools',
    name: 'tools',
    title: '工具管理',
    icon: 'Tools',
    permission: ['page.tools']
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    title: '数据看板',
    icon: 'DataBoard',
    permission: ['page.dashboard']
  }
]

const permissionStore = usePermissionStore()
const menuList = computed(() => permissionStore.userMenus.length ? permissionStore.userMenus : defaultMenu)
</script>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #404956;
}

.sidebar-logo h2 {
  font-size: 16px;
  font-weight: 600;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
}
</style>

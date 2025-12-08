<template>
  <div class="system-page">
    <el-page-header content="菜单管理"></el-page-header>

    <el-card>
      <div class="card-actions">
        <el-button type="primary" icon="Plus" v-permission="'btn.add'">新增菜单</el-button>
        <el-button type="success" icon="Edit" v-permission="'btn.edit'">批量编辑</el-button>
        <el-button type="danger" icon="Delete" v-permission="'btn.delete'">批量删除</el-button>
      </div>

      <el-table :data="menuData" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="菜单名称"></el-table-column>
        <el-table-column prop="path" label="路由路径"></el-table-column>
        <el-table-column prop="permission" label="权限标识"></el-table-column>
        <el-table-column prop="sort" label="排序" width="80"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" v-permission="'btn.edit'">编辑</el-button>
            <el-button type="danger" size="small" v-permission="'btn.delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 模拟菜单数据
const menuData = ref([
  { id: 1, title: '首页', path: '/home', permission: 'page.home', sort: 1 },
  { id: 2, title: '管理员管理', path: '/admin', permission: 'page.admin', sort: 2 },
  { id: 3, title: '菜单管理', path: '/system/menu', permission: 'page.system.menu', sort: 3 },
  { id: 4, title: '角色管理', path: '/system/role', permission: 'page.system.role', sort: 4 },
  { id: 5, title: '用户管理', path: '/system/user', permission: 'page.system.user', sort: 5 }
])
</script>

<style scoped>
.system-page {
  height: 100%;
}

.card-actions {
  display: flex;
  gap: 10px;
}
</style>

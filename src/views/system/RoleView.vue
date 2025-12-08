<template>
  <div class="system-page">
    <el-page-header content="角色管理"></el-page-header>

    <el-card>
      <div class="card-actions">
        <el-button type="primary" icon="Plus" v-permission="'btn.add'">新增角色</el-button>
        <el-button type="warning" icon="Refresh" v-permission="'btn.sync'">同步权限</el-button>
      </div>

      <el-table :data="roleData" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="code" label="角色标识"></el-table-column>
        <el-table-column prop="description" label="角色描述"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-button type="primary" size="small" v-permission="'btn.edit'">编辑</el-button>
            <el-button type="info" size="small" v-permission="'btn.permission'">权限配置</el-button>
            <el-button type="danger" size="small" v-permission="'btn.delete'" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

// 模拟角色数据
const roleData = ref([
  { id: 1, name: '超级管理员', code: 'admin', description: '系统最高权限角色', status: true },
  { id: 2, name: '普通用户', code: 'user', description: '普通操作权限', status: true },
  { id: 3, name: '访客', code: 'guest', description: '只读权限', status: false }
])

// 删除角色
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '此操作将永久删除该角色, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    roleData.value = roleData.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功!')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}
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

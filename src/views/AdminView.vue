<template>
  <div class="admin-container">
    <el-page-header content="管理员页面（需管理员权限）"></el-page-header>

    <el-divider content-position="left">管理员操作区</el-divider>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" v-permission="'btn.edit'" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" v-permission="'btn.delete'" @click="handleDelete(scope.row)"
            style="margin-left: 10px">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-divider content-position="left">批量操作</el-divider>

    <el-button type="primary" v-permission="['btn.add', 'btn.edit']">
      批量添加/编辑
    </el-button>

    <el-button type="danger" v-permission="'btn.delete'" style="margin-left: 10px">
      批量删除
    </el-button>

    <el-button type="default" @click="$router.push('/home')" style="margin-left: 10px">
      返回首页
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 模拟表格数据
const tableData = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' }
])

// 编辑操作
const handleEdit = (row: any) => {
  ElMessage.info(`编辑用户：${row.name}`)
}

// 删除操作
const handleDelete = (row: any) => {
  ElMessage.warning(`删除用户：${row.name}`)
}
</script>

<style scoped>
.admin-container {
  padding: 20px;
}

.el-divider {
  margin: 20px 0;
}
</style>

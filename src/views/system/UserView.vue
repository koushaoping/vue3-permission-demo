<template>
  <div class="system-page">
    <el-page-header content="用户管理"></el-page-header>

    <el-card>
      <div class="card-actions">
        <el-button type="primary" icon="Plus" v-permission="'btn.add'">新增用户</el-button>
        <el-button type="info" icon="Download" v-permission="'btn.export'">导出数据</el-button>
        <el-button type="warning" icon="Upload" v-permission="'btn.import'">导入数据</el-button>
      </div>

      <el-table :data="userData" border style="width: 100%; margin-top: 20px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" v-permission="'btn.edit'">编辑</el-button>
            <el-button type="success" size="small" v-permission="'btn.reset'">重置密码</el-button>
            <el-button type="danger" size="small" v-permission="'btn.delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total" style="margin-top: 20px; text-align: right">
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 模拟用户数据
const userData = ref([
  {
    id: 1,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: 'admin',
    email: 'admin@example.com',
    role: '超级管理员',
    createTime: '2024-01-01'
  },
  {
    id: 2,
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9ddd4.png',
    username: 'user1',
    email: 'user1@example.com',
    role: '普通用户',
    createTime: '2024-02-01'
  },
  {
    id: 3,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: 'user2',
    email: 'user2@example.com',
    role: '普通用户',
    createTime: '2024-03-01'
  }
])

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)

const handleSizeChange = (val: number) => {
  pageSize.value = val
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
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

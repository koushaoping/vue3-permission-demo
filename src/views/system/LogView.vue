<template>
  <div class="system-page">
    <el-page-header content="日志管理"></el-page-header>

    <el-card>
      <div class="card-actions" style="margin-bottom: 15px">
        <el-select v-model="logType" placeholder="日志类型" style="width: 150px">
          <el-option label="全部" value=""></el-option>
          <el-option label="登录日志" value="login"></el-option>
          <el-option label="操作日志" value="operation"></el-option>
          <el-option label="错误日志" value="error"></el-option>
        </el-select>
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" style="width: 300px; margin-left: 10px" />
        <el-button type="primary" icon="Search" style="margin-left: 10px">搜索</el-button>
        <el-button type="success" icon="Download" v-permission="'btn.export'" style="margin-left: 10px">导出</el-button>
        <el-button type="danger" icon="Delete" v-permission="'btn.clean'" style="margin-left: 10px">清空日志</el-button>
      </div>

      <el-table :data="logData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'error' ? 'danger' : scope.row.type === 'login' ? 'primary' : 'info'">
              {{ scope.row.type === 'login' ? '登录' : scope.row.type === 'operation' ? '操作' : '错误' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="操作用户" width="120" />
        <el-table-column prop="content" label="操作内容" min-width="300" />
        <el-table-column prop="ip" label="IP地址" width="150" />
        <el-table-column prop="location" label="操作地点" width="180" />
        <el-table-column prop="createTime" label="操作时间" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="text" v-permission="'btn.view'" @click="handleDetail(scope.row)">详情</el-button>
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
import { ElMessage } from 'element-plus'

const logType = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

const logData = ref([
  {
    id: 1,
    type: 'login',
    username: 'admin',
    content: '用户登录系统',
    ip: '127.0.0.1',
    location: '本地',
    createTime: '2024-05-20 09:30:00'
  },
  {
    id: 2,
    type: 'operation',
    username: 'admin',
    content: '新增菜单：日志管理',
    ip: '127.0.0.1',
    location: '本地',
    createTime: '2024-05-20 10:15:00'
  },
  {
    id: 3,
    type: 'error',
    username: 'user1',
    content: '访问/admin页面权限不足',
    ip: '127.0.0.1',
    location: '本地',
    createTime: '2024-05-20 11:20:00'
  },
  {
    id: 4,
    type: 'operation',
    username: 'admin',
    content: '编辑用户：user2状态改为禁用',
    ip: '127.0.0.1',
    location: '本地',
    createTime: '2024-05-20 14:30:00'
  },
  {
    id: 5,
    type: 'login',
    username: 'user1',
    content: '用户登录系统',
    ip: '127.0.0.1',
    location: '本地',
    createTime: '2024-05-20 15:45:00'
  }
])

const handleDetail = (row: any) => {
  ElMessage.info(`查看日志详情：ID=${row.id}`)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}
</script>

<style scoped>
.system-page {
  padding: 20px;
}

.card-actions {
  display: flex;
  align-items: center;
}
</style>

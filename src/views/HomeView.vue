<template>
  <div class="home-container">
    <el-page-header content="首页权限演示"></el-page-header>

    <el-divider content-position="left">按钮权限演示</el-divider>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-button type="primary" v-permission="'btn.add'">添加按钮</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="success" v-permission="'btn.edit'">编辑按钮</el-button>
      </el-col>
      <el-col :span="6" v-permission="'btn.delete'">
        <el-button type="danger" v-permission="'btn.delete'">删除按钮</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="info" v-permission="'btn.view'">查看按钮</el-button>
      </el-col>
    </el-row>

    <el-divider content-position="left">系统数据列表</el-divider>

    <!-- Element表格 -->
    <el-card>
      <div class="table-actions" style="margin-bottom: 10px">
        <el-input v-model="searchText" placeholder="请输入搜索内容" style="width: 300px" />
        <el-button type="primary" icon="Search" style="margin-left: 10px">搜索</el-button>
        <el-button type="success" icon="Refresh" style="margin-left: 10px">刷新</el-button>
        <el-button type="primary" icon="Plus" v-permission="'btn.add'" style="margin-left: auto">新增数据</el-button>
      </div>

      <el-table :data="tableData" border stripe style="width: 100%" :loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="category" label="分类">
          <template #default="scope">
            <el-tag :type="scope.row.category === '系统' ? 'primary' : 'success'">
              {{ scope.row.category }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-switch v-model="scope.row.status" @change="handleStatusChange(scope.row)"
              :disabled="!permissionStore.hasPermission('btn.edit')" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" v-permission="'btn.view'" @click="handleView(scope.row)">
              查看
            </el-button>
            <el-button type="success" size="small" v-permission="'btn.edit'" @click="handleEdit(scope.row)"
              style="margin-left: 5px">
              编辑
            </el-button>
            <el-button type="danger" size="small" v-permission="'btn.delete'" @click="handleDelete(scope.row)"
              style="margin-left: 5px">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total" style="margin-top: 20px; text-align: right">
      </el-pagination>
    </el-card>

    <el-divider content-position="left">角色信息</el-divider>

    <el-card>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="当前角色">
          {{ permissionStore.userRole === 'admin' ? '管理员' : '普通用户' }}
        </el-descriptions-item>
        <el-descriptions-item label="拥有权限码">
          {{ permissionStore.userPermissions.join(', ') }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-divider content-position="left">页面跳转</el-divider>

    <el-button type="warning" @click="$router.push('/admin')" v-permission="'page.admin'">
      前往管理员页面
    </el-button>

    <el-button type="default" @click="handleLogout" style="margin-left: 10px">
      退出登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePermissionStore } from '@/stores/permission'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const permissionStore = usePermissionStore()
const router = useRouter()

// 表格数据
const loading = ref(false)
const searchText = ref('')
const tableData = ref([
  { id: 1, name: '首页管理', category: '系统', status: true, createTime: '2024-01-01 10:00:00' },
  { id: 2, name: '用户管理', category: '系统', status: true, createTime: '2024-01-02 14:30:00' },
  { id: 3, name: '角色管理', category: '系统', status: true, createTime: '2024-01-03 09:15:00' },
  { id: 4, name: '菜单管理', category: '系统', status: true, createTime: '2024-01-04 16:45:00' },
  { id: 5, name: '数据看板', category: '业务', status: false, createTime: '2024-01-05 11:20:00' },
  { id: 6, name: '工具管理', category: '业务', status: true, createTime: '2024-01-06 15:10:00' },
  { id: 7, name: '日志管理', category: '系统', status: true, createTime: '2024-01-07 08:30:00' },
  { id: 8, name: '权限管理', category: '系统', status: true, createTime: '2024-01-08 13:50:00' },
  { id: 9, name: '数据备份', category: '业务', status: false, createTime: '2024-01-09 10:25:00' },
  { id: 10, name: '系统设置', category: '系统', status: true, createTime: '2024-01-10 14:40:00' }
])

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(10)
const selectedRows = ref<any[]>([])

// 模拟加载数据
onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 800)
})

// 表格事件处理
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val
}

const handleStatusChange = (row: any) => {
  ElMessage.info(`状态已切换为：${row.status ? '启用' : '禁用'}`)
}

const handleView = (row: any) => {
  ElMessage.info(`查看数据：${row.name}`)
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑数据：${row.name}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '此操作将永久删除该数据, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.id !== row.id)
    total.value = tableData.value.length
    ElMessage.success('删除成功!')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 分页事件
const handleSizeChange = (val: number) => {
  pageSize.value = val
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 退出登录
const handleLogout = () => {
  permissionStore.clearPermissions()
  ElMessage.info('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.el-divider {
  margin: 20px 0;
}

.table-actions {
  display: flex;
  align-items: center;
}
</style>

<template>
  <div class="user-manage-page">
    <el-page-header content="用户中心管理"></el-page-header>

    <el-card>
      <div class="card-actions" style="margin-bottom: 15px">
        <el-input v-model="searchForm.keyword" placeholder="用户名/手机号/邮箱" style="width: 300px" />
        <el-select v-model="searchForm.status" placeholder="用户状态" style="width: 150px; margin-left: 10px">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
        <el-select v-model="searchForm.role" placeholder="用户角色" style="width: 150px; margin-left: 10px">
          <el-option label="全部" value=""></el-option>
          <el-option label="管理员" value="admin"></el-option>
          <el-option label="普通用户" value="user"></el-option>
          <el-option label="游客" value="guest"></el-option>
        </el-select>
        <el-button type="primary" icon="Search" style="margin-left: 10px" @click="handleSearch">
          搜索
        </el-button>
        <el-button icon="Refresh" style="margin-left: 10px" @click="handleReset">
          重置
        </el-button>

        <div style="margin-left: auto">
          <el-button type="primary" icon="Plus" v-permission="'btn.add'" @click="handleAdd">
            新增用户
          </el-button>
          <el-button type="warning" icon="Download" v-permission="'btn.export'" style="margin-left: 10px">
            导出数据
          </el-button>
          <el-button type="danger" icon="Delete" v-permission="'btn.batchDelete'" style="margin-left: 10px"
            @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
      </div>

      <el-table :data="userList" border stripe style="width: 100%" :loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="userId" label="用户ID" width="100" sortable />
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="roleName" label="角色" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : scope.row.role === 'user' ? 'primary' : 'info'">
              {{ scope.row.roleName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.status" @change="handleStatusChange(scope.row)"
              disabled="!permissionStore.hasPermission('btn.edit')" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" sortable />
        <el-table-column prop="lastLoginTime" label="最后登录" width="180" />
        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-button type="primary" size="small" v-permission="'btn.view'" @click="handleView(scope.row)">
              详情
            </el-button>
            <el-button type="success" size="small" v-permission="'btn.edit'" @click="handleEdit(scope.row)"
              style="margin-left: 5px">
              编辑
            </el-button>
            <el-button type="warning" size="small" v-permission="'btn.resetPwd'" @click="handleResetPwd(scope.row)"
              style="margin-left: 5px">
              重置密码
            </el-button>
            <el-button type="danger" size="small" v-permission="'btn.delete'" @click="handleDelete(scope.row)"
              style="margin-left: 5px">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pagination.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
        style="margin-top: 20px; text-align: right">
      </el-pagination>
    </el-card>

    <!-- 用户编辑弹窗 -->
    <el-dialog v-model="dialogVisible" title="用户编辑" width="600px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" disabled />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="普通用户" value="user"></el-option>
            <el-option label="游客" value="guest"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { usePermissionStore } from '@/stores/permission'
import { ElMessage, ElMessageBox } from 'element-plus'

const permissionStore = usePermissionStore()

// 加载状态
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
  role: ''
})

// 分页数据
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 20
})

// 表格数据
const userList = ref([
  {
    userId: 1,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: 'admin',
    nickname: '超级管理员',
    phone: '13800138000',
    email: 'admin@example.com',
    role: 'admin',
    roleName: '管理员',
    status: true,
    createTime: '2024-01-01 10:00:00',
    lastLoginTime: '2024-05-20 09:30:00'
  },
  {
    userId: 2,
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9ddd4.png',
    username: 'user1',
    nickname: '张三',
    phone: '13800138001',
    email: 'user1@example.com',
    role: 'user',
    roleName: '普通用户',
    status: true,
    createTime: '2024-01-02 14:30:00',
    lastLoginTime: '2024-05-19 16:45:00'
  },
  {
    userId: 3,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: 'user2',
    nickname: '李四',
    phone: '13800138002',
    email: 'user2@example.com',
    role: 'user',
    roleName: '普通用户',
    status: false,
    createTime: '2024-01-03 09:15:00',
    lastLoginTime: '2024-05-18 11:20:00'
  },
  {
    userId: 4,
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9ddd4.png',
    username: 'guest1',
    nickname: '游客1',
    phone: '13800138003',
    email: 'guest1@example.com',
    role: 'guest',
    roleName: '游客',
    status: true,
    createTime: '2024-01-04 16:45:00',
    lastLoginTime: '2024-05-17 15:10:00'
  },
  {
    userId: 5,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: 'user3',
    nickname: '王五',
    phone: '13800138004',
    email: 'user3@example.com',
    role: 'user',
    roleName: '普通用户',
    status: true,
    createTime: '2024-01-05 11:20:00',
    lastLoginTime: '2024-05-16 08:30:00'
  }
])

// 选中数据
const selectedRows = ref([])

// 弹窗数据
const dialogVisible = ref(false)
const formData = reactive({
  userId: '',
  username: '',
  nickname: '',
  phone: '',
  email: '',
  role: '',
  status: true
})

// 初始化加载数据
onMounted(() => {
  loadData()
})

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 800)
}

// 表格事件处理
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val
}

const handleStatusChange = (row: any) => {
  ElMessage.info(`用户${row.username}状态已切换为：${row.status ? '启用' : '禁用'}`)
}

const handleView = (row: any) => {
  ElMessage.info(`查看用户：${row.nickname}`)
}

const handleEdit = (row: any) => {
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleAdd = () => {
  // 重置表单
  Object.assign(formData, {
    userId: '',
    username: '',
    nickname: '',
    phone: '',
    email: '',
    role: 'user',
    status: true
  })
  dialogVisible.value = true
}

const handleSave = () => {
  dialogVisible.value = false
  ElMessage.success('保存成功')
}

const handleResetPwd = (row: any) => {
  ElMessageBox.confirm(
    '确定要重置该用户密码吗？重置后密码为123456',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('密码重置成功')
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '此操作将永久删除该用户, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    userList.value = userList.value.filter(item => item.userId !== row.userId)
    pagination.total = userList.value.length
    ElMessage.success('删除成功!')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的用户')
    return
  }

  ElMessageBox.confirm(
    `确定要删除选中的${selectedRows.value.length}个用户吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const ids = selectedRows.value.map(item => item.userId)
    userList.value = userList.value.filter(item => !ids.includes(item.userId))
    pagination.total = userList.value.length
    selectedRows.value = []
    ElMessage.success('批量删除成功!')
  })
}

// 搜索重置
const handleSearch = () => {
  pagination.pageNum = 1
  loadData()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.role = ''
  pagination.pageNum = 1
  loadData()
}

// 分页事件
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pagination.pageNum = val
  loadData()
}
</script>

<style scoped>
.user-manage-page {
  padding: 20px;
}

.card-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
</style>

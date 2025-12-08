<template>
  <div class="tools-page">
    <el-page-header content="工具管理"></el-page-header>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="tool-card" shadow="hover">
          <div class="tool-icon">
            <el-icon size="48">
              <Tools />
            </el-icon>
          </div>
          <div class="tool-info">
            <h3>数据备份</h3>
            <p>定期备份系统重要数据，确保数据安全</p>
          </div>
          <div class="tool-action">
            <el-button type="primary" v-permission="'btn.backup'">立即备份</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="tool-card" shadow="hover">
          <div class="tool-icon">
            <el-icon size="48">
              <RefreshLeft />
            </el-icon>
          </div>
          <div class="tool-info">
            <h3>数据恢复</h3>
            <p>从备份文件恢复数据，支持版本选择</p>
          </div>
          <div class="tool-action">
            <el-button type="warning" v-permission="'btn.restore'">恢复数据</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="tool-card" shadow="hover">
          <div class="tool-icon">
            <el-icon size="48">
              <Delete />
            </el-icon>
          </div>
          <div class="tool-info">
            <h3>清理缓存</h3>
            <p>清理系统缓存文件，释放服务器空间</p>
          </div>
          <div class="tool-action">
            <el-button type="danger" v-permission="'btn.clean'">清理</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <h3>系统日志</h3>
      <el-table :data="logData" border style="width: 100%; margin-top: 10px">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'error' ? 'danger' : 'info'">
              {{ scope.row.type === 'error' ? '错误' : '操作' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tools, RefreshLeft, Delete } from '@element-plus/icons-vue'

// 模拟日志数据
const logData = ref([
  { id: 1, type: 'operation', content: '用户admin登录系统', time: '2024-05-20 10:30:00' },
  { id: 2, type: 'operation', content: '用户admin新增菜单', time: '2024-05-20 11:20:00' },
  { id: 3, type: 'error', content: '用户user1尝试访问管理员页面被拒绝', time: '2024-05-20 14:15:00' }
])
</script>

<style scoped>
.tools-page {
  height: 100%;
}

.tool-card {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tool-icon {
  text-align: center;
  color: #409eff;
}

.tool-info {
  text-align: center;
}

.tool-info h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.tool-action {
  text-align: center;
}
</style>

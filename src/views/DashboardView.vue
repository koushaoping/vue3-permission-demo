<template>
  <div class="dashboard-page">
    <el-page-header content="数据看板"></el-page-header>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-icon user-icon">
            <el-icon size="32">
              <User />
            </el-icon>
          </div>
          <div class="stat-info">
            <p>用户总数</p>
            <h2>128</h2>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-icon role-icon">
            <el-icon size="32">
              <UserFilled />
            </el-icon>
          </div>
          <div class="stat-info">
            <p>角色总数</p>
            <h2>8</h2>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-icon menu-icon">
            <el-icon size="32">
              <Menu />
            </el-icon>
          </div>
          <div class="stat-info">
            <p>菜单总数</p>
            <h2>42</h2>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-icon online-icon">
            <el-icon size="32">
              <Monitor />
            </el-icon>
          </div>
          <div class="stat-info">
            <p>在线用户</p>
            <h2>16</h2>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户访问统计</span>
              <el-select v-model="dateRange" size="small" style="width: 120px">
                <el-option label="今日" value="today"></el-option>
                <el-option label="本周" value="week"></el-option>
                <el-option label="本月" value="month"></el-option>
              </el-select>
            </div>
          </template>
          <!-- 模拟图表区域 -->
          <div class="chart-placeholder">
            <p>图表展示区域（可集成ECharts）</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <span>最近操作</span>
          </template>
          <el-timeline>
            <el-timeline-item v-for="(item, index) in operationLogs" :key="index" :timestamp="item.time">
              {{ item.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, UserFilled, Menu, Monitor } from '@element-plus/icons-vue'

const dateRange = ref('week')

// 模拟操作日志
const operationLogs = ref([
  { content: 'admin创建了新角色：运营管理员', time: '10:30' },
  { content: 'user1修改了个人资料', time: '09:15' },
  { content: 'admin删除了过期用户账号', time: '昨天' },
  { content: '系统自动备份完成', time: '2024-05-19' }
])
</script>

<style scoped>
.dashboard-page {
  height: 100%;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-icon {
  padding: 15px;
  border-radius: 50%;
  margin-right: 15px;
}

.user-icon {
  background-color: #e8f4fc;
  color: #409eff;
}

.role-icon {
  background-color: #f0f9eb;
  color: #67c23a;
}

.menu-icon {
  background-color: #fef7e5;
  color: #e6a23c;
}

.online-icon {
  background-color: #fef0f0;
  color: #f56c6c;
}

.stat-info h2 {
  margin: 0;
  font-size: 24px;
}

.stat-info p {
  color: #999;
  margin: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  color: #999;
}
</style>

<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <sidebar class="sidebar-container" />

    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 头部 -->
      <header-nav class="header-container" />

      <!-- 内容区域 -->
      <div class="content-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import HeaderNav from './Header.vue'
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
}

.sidebar-container {
  width: 220px;
  background-color: #2e3b4e;
  color: #fff;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header-container {
  height: 60px;
  border-bottom: 1px solid #e6e6e6;
}

.content-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}
</style>

<template>
  <div class="not-found-container">
    <el-empty description="页面不存在">
      <el-button type="primary" @click="$router.push('/home')">返回首页</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
// 404页面逻辑
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
</style>

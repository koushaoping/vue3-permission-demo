<template>
  <div class="forbidden-container">
    <el-empty description="您没有权限访问该页面">
      <el-button type="primary" @click="$router.push('/home')">返回首页</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
// 403页面逻辑
</script>

<style scoped>
.forbidden-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
</style>

import Mugu from '../views/mugu.vue' // 引入您建立的組件

const routes = [
  // ... 其他路由
  {
    path: '/mugu', // 這是您在網址列要輸入的路徑
    name: 'Mugu',
    component: Mugu // 這是您剛剛創建的組件
  }
]
<template>
  <div class="mugu-page">
    <h1>MUGU</h1>
    <!-- 之後這裡會放你的表情變化 UI -->
  </div>
</template>

<script setup>
    // 未來在這裡放程式邏輯
</script>

<style scoped>
    .mugu-page {
    padding: 20px;
    }
</style>

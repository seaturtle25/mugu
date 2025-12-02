<template>
  <div class="diary">
    <textarea v-model="text" placeholder="寫下今天的心情..."></textarea>
    <div class="controls">
      <button @click="save">儲存</button>
      <button @click="clear">清除</button>
      <button @click="$emit('close')">關閉</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const KEY = 'mugu-diary' // 可以改成帶日期的 key 或把多篇存在一個陣列
const text = ref('')

onMounted(() => {
  try {
    // 預設使用單篇文字，如果未來要多筆可存 JSON
    text.value = localStorage.getItem(KEY) || ''
  } catch (e) {
    console.warn('讀取 localStorage 失敗', e)
    text.value = ''
  }
})

function save() {
  try {
    localStorage.setItem(KEY, text.value)
    alert('日記已儲存！')
  } catch (e) {
    console.error('儲存失敗', e)
    alert('儲存失敗（可能為隱私/無痕模式）')
  }
}

function clear() {
  if (confirm('確定要清除嗎？')) {
    text.value = ''
    try { localStorage.removeItem(KEY) } catch {}
  }
}
</script>

<style scoped>
.diary textarea {
  width: 320px;
  height: 200px;
  padding:8px;
  border-radius:6px;
  border:1px solid #ccc;
}
.controls { margin-top:8px; display:flex; gap:8px; }
</style>

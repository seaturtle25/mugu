<template>
  <div class="diary-mask" @click.self="$emit('close')">
    <div class="diary-box">
      <h3>☁️ 我的心情留言板</h3>
      <textarea v-model="text" placeholder="寫下今天的心情..."></textarea>
      <div class="controls">
        <button class="btn btn-save" @click="save">儲存</button>
        <button class="btn btn-clear" @click="clear">清除</button>
        <button class="btn btn-close" @click="$emit('close')">關閉</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = `${process.env.VUE_APP_API_URL}/api/mugu/diary`
const text = ref('')

defineEmits(['close'])

onMounted(async () => {
  try {
    const res = await axios.get(API_URL)
    if (res.data && res.data.content) {
      text.value = res.data.content
    }
  } catch (e) {
    console.error('讀取失敗:', e)
    alert('連線失敗！')
  }
})

async function save() {
  try {
    await axios.post(API_URL, { content: text.value })
    alert('成功儲存!')
  } catch (e) {
    console.error('儲存失敗:', e)
    alert('儲存失敗！')
  }
}

async function clear() {
  if (confirm('確定清除嗎？無法復原喔！')) {
    try {
      text.value = ''
      await axios.post(API_URL, { content: '' })
    } catch (e) {
      alert('清除失敗')
    }
  }
}
</script>

<style scoped>
.diary-mask {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(4px);
}

.diary-box {
  background: #fff;
  width: 400px;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: popIn 0.3s ease-out;
}

h3 { margin: 0; color: #555; text-align: center; }

textarea {
  width: 100%;
  height: 200px;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #eee;
  resize: none;
  font-size: 16px;
  font-family: inherit;
  box-sizing: border-box; 
  outline: none;
  transition: border 0.2s;
}


textarea:focus { border-color: #f3d7c7; }

.controls {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn { 
  padding: 8px 16px; 
  border: none; 
  border-radius: 8px; 
  cursor: pointer; 
  color: white; 
  font-weight: bold; 
  transition: opacity 0.2s;
}
.btn:hover { opacity: 0.9; }

.btn-save { background: #4caf50; }
.btn-clear { background: #ff9800; }
.btn-close { background: #9e9e9e; }

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
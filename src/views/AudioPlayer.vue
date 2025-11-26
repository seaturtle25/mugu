<template>
  <div class="audio-player">
    <button @click="toggleMusic" :disabled="loading" :aria-pressed="playing">
      {{ playing ? '暫停音樂' : (loading ? '載入中...' : '播放音樂') }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const playing = ref(false)
const loading = ref(false)
let audio = null
const SRC = '/music/bgm.mp3'

onMounted(() => {
  // 建立 audio 物件在元件 mount 時
  audio = new Audio(SRC)
  audio.loop = true

  // 當使用者手動在瀏覽器 UI 暫停/播放時，讓 state 同步
  audio.onplay = () => { playing.value = true }
  audio.onpause = () => { playing.value = false }
})

onUnmounted(() => {
  if (audio) {
    audio.pause()
    audio.src = ''
    audio = null
  }
})

async function toggleMusic() {
  if (!audio) return
  if (playing.value) {
    audio.pause()
    // onpause 事件會更新 playing
    return
  }

  // 播放（部分瀏覽器可能會拒絕自動播放）
  loading.value = true
  try {
    await audio.play()
    playing.value = true
  } catch (e) {
    console.warn('播放失敗', e)
    alert('瀏覽器阻擋自動播放，請點擊頁面允許播放或按鈕播放')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.audio-player button { padding:8px 12px; border-radius:6px; }
</style>

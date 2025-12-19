<template>
  <div class="audio-player">
    <button
      class="music-btn" 
      :class="{ playing: isPlaying }"
      @click="toggleMusic"
    >
    {{ isPlaying ? '🎵 音樂播放中' : '🔇 播放輕音樂' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isPlaying = ref(false)
let audio = null
const SRC = '/music/bgm.mp3'

onMounted(() => {
  audio = new Audio(SRC)
  audio.loop = true
  audio.volume = 0.5
})

onUnmounted(() => {
  if (audio) {
    audio.pause()
    audio = null
  }
})

function toggleMusic() {
  if (!audio) return
  if (isPlaying.value) {
    audio.pause()
    isPlaying.value = false
  }
  else {
    audio.play()
      .then(() => {
        isPlaying.value = true
      })
      .catch((error) => {
        console.error("播放失敗:", error)
        alert("無法播放音樂，請檢查檔案是否存在 (public/music/bgm.mp3)")
      })
  }
}
</script>

<style scoped>
.audio-player {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
}

.music-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #ddd;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: bold;
  color: #555;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  outline: none;
}

.music-btn:hover {
  background: #fff;
  transform: translateY(-2px);
}

.music-btn.playing {
  background: #fff9c4;
  border-color: #fbc02d;
  color: #f57f17;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(251, 192, 45, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(251, 192, 45, 0); }
  100% { box-shadow: 0 0 0 0 rgba(251, 192, 45, 0); }
}
</style>

<template>
  <div class="audio-player">
    <transition name="fade">
      <div v-show="isPlayerVisible" class="player-content">
        <iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1589968831&color=%23f3d7c7&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>
        <div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;">
          <a href="https://soundcloud.com/relaxcafemusic" title="Relax Cafe Music BGM" target="_blank" style="color: #cccccc; text-decoration: none;">Relax Cafe Music BGM</a>
          <a href="https://soundcloud.com/relaxcafemusic/sets/coffee-jazz" title="Coffee Jazz" target="_blank" style="color: #cccccc; text-decoration: none;">Coffee Jazz</a>
        </div>
      </div>
    </transition>
    <button
      class="music-btn" 
      :class="{ active: isPlayerVisible }"
      @click="togglePlayer"
    >
    {{ isPlayerVisible ? '🔽 收起播放器' : '🎵 打開音樂播放器' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isPlayerVisible = ref(false)

function togglePlayer() {
  isPlayerVisible.value = !isPlayerVisible.value
}
</script>

<style scoped>
.audio-player {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.player-content {
  width: 300px;
  background: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
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
  min-width: 130px;
}

.music-btn:hover {
  background: #fff;
  transform: translateY(-2px);
}

.music-btn.active {
  background: #f3d7c7;
  border-color:#e9b99e;
  color: #eba37a;
  animation: pulse 2s infinite;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(251, 192, 45, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(251, 192, 45, 0); }
  100% { box-shadow: 0 0 0 0 rgba(251, 192, 45, 0); }
}
</style>

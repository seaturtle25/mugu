<template>
  <div class="mugu-container">
    <MuguAvatar 
      :type="avatarType"
      @poke="handlePoke"
    />

    <ControlPanel
      :currentType="avatarType"
      @changeType="handleChangeType"
      @openDiary="showDiary = true"
    />

    <AudioPlayer ref="audioPlayer" />

    <Diary 
      v-if="showDiary"
      @close="showDiary = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import MuguAvatar from '../components/MuguAvatar.vue'
import ControlPanel from '../components/ControlPanel.vue'
import Diary from '../components/Diary.vue'
import AudioPlayer from '../components/AudioPlayer.vue'

const API_STATE_URL = 'http://localhost:3000/api/mugu/state'

const avatarType = ref('default')
const showDiary = ref(false)

onMounted(async () => {
  try {
    const res = await axios.get(API_STATE_URL)
    if (res.data && res.data.currentType) {
      avatarType.value = res.data.currentType
      console.log('已從資料庫讀取 Mugu 狀態:', avatarType.value)
    }
  } catch (e) {
    console.warn('無法連上後端，將使用預設表情', e)
  }
})

function handlePoke() {
  console.log("主程式收到:Mugu 被戳了一下！")
}

async function handleChangeType(newType) {
  avatarType.value = newType
  try {
    await axios.post(API_STATE_URL, { currentType: newType })
    console.log('狀態已同步到資料庫:', newType)
  } catch (e) {
    console.error('狀態同步失敗:', e)
  }
}
</script>

<style>
.mugu-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #fef8ff;
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: center;
}
</style>

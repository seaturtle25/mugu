<template>
  <div class="mugu-container">
    <MuguAvatar :type="avatarType" @poke="onPoke" />

    <ControlPanel
      :avatarType="avatarType"
      @changeType="handleChangeType"
      @openDiary="showDiary = true"
    />

    <AudioPlayer ref="audioPlayer" />

    <Diary v-if="showDiary" @close="showDiary = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MuguAvatar from './MuguAvatar.vue'
import ControlPanel from './ControlPanel.vue'
import Diary from './Diary.vue'
import AudioPlayer from './AudioPlayer.vue'

const avatarType = ref('default')
const showDiary = ref(false)

function onPoke() {
  console.log("你戳了Mugu一下！")
  // 這裡可以擴充：切換表情、播放音效、增加互動計數等
}

function handleChangeType(newType) {
  avatarType.value = newType
  console.log('切換為', newType)
}
</script>

<style>
.mugu-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #fef8ff;
  display: flex;
  gap: 24px;
  padding: 24px;
  align-items: flex-start;
}
</style>

<template>
  <div class="mugu-wrapper">
    <!-- 這裡用 img 演示；若你要用純 CSS 小人，把 <img> 換成 <div> 並改樣式 -->
    <img
      ref="avatar"
      class="avatar"
      :src="src"
      alt="Mugu avatar"
      @click="onClick"
      draggable="false"
    />
    <!-- 測試按鈕（開發時可留） -->
    <div class="controls">
      <button @click="dodge">躲一下</button>
      <button @click="shakeHead">頭搖兩次</button>
      <button @click="jelly">水袋抖動</button>
      <button @click="fall">撲倒</button>
      <button @click="roll">滾動</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import anime from 'animejs/lib/anime.es.js' // anime.js

// 歷史：若父元件想傳 type 改圖，可改為 defineProps
const src = '/avatars/mugu.png' // <- 把你的圖片放在 public/avatars/mugu.png

const avatar = ref(null)
let currentAnim = null // 用於儲存當前 anime 物件，方便 stop()

// 公共：點擊 avatar 的預設動作（戳她），這裡做 dodge + emit poke
function onClick() {
  // 可以先做一個躲避（或你想要的 default）
  dodge()
  // emit 事件給父元件（如果需要）
  // defineEmits(['poke']) 並呼叫 emit('poke') 若使用
}

// helper：安全停止正在進行的動畫（避免衝突）
function stopCurrent() {
  if (currentAnim) {
    try { currentAnim.pause() } catch {}
    currentAnim = null
  }
}

/* ---------- 動作實作（使用 anime.timeline / anime） ---------- */

/* 1) dodge — 躲一下（往旁邊跳與輕微旋轉），快速自然 */
function dodge() {
  stopCurrent()
  // timeline 方便把平移與 scale / rotate 做在一起
  currentAnim = anime.timeline({
    duration: 260,
    easing: 'easeOutQuad',
  })

  // 先往右快速位移且稍微壓縮（像被戳）
  currentAnim
    .add({
      targets: avatar.value,
      translateX: [0, 40],
      translateY: [0, 6],
      scale: [1, 0.95],
      duration: 140,
      easing: 'easeOutQuad'
    })
    // 回到左側超出一點（反彈）
    .add({
      targets: avatar.value,
      translateX: [-10],
      translateY: [0],
      scale: [0.95, 1.05],
      duration: 100,
      easing: 'easeOutQuad'
    })
    // 還原
    .add({
      targets: avatar.value,
      translateX: 0,
      translateY: 0,
      scale: 1,
      duration: 120,
      easing: 'spring(1, 80, 10, 0)'
    })

  return currentAnim
}

/* 2) shakeHead — 頭搖兩次（對於單張圖會是整體搖；如要頭單獨搖請見下方說明） */
async function shakeHead() {
  stopCurrent()
  // 我們把兩次搖頭拆成 timeline 裡的兩段小幅角度改變
  currentAnim = anime.timeline({
    easing: 'easeInOutSine',
    duration: 70
  })

  // 搖頭 1（左  -15 -> 右 15）
  currentAnim
    .add({
      targets: avatar.value,
      rotate: [-8, 18],
      duration: 120,
      easing: 'easeInOutSine'
    })
    // 搖頭 2
    .add({
      targets: avatar.value,
      rotate: [-12, 12],
      duration: 120,
      easing: 'easeInOutSine'
    })
    // 回正
    .add({
      targets: avatar.value,
      rotate: 0,
      duration: 140,
      easing: 'spring(1, 80, 10, 0)'
    })

  return currentAnim.finished
}

/* 3) jelly — 水袋抖動（Q彈） */
async function jelly() {
  stopCurrent()
  // 用一段彈性的 scale timeline，讓 X/Y 不對稱達成果凍感
  currentAnim = anime.timeline({
    easing: 'easeOutElastic(1, .6)',
    duration: 600
  })

  currentAnim
    .add({
      targets: avatar.value,
      scaleX: [1, 1.15],
      scaleY: [1, 0.85],
      duration: 160,
      easing: 'easeOutQuad'
    })
    .add({
      targets: avatar.value,
      scaleX: 0.9,
      scaleY: 1.12,
      duration: 160,
      easing: 'easeOutQuad'
    })
    .add({
      targets: avatar.value,
      scaleX: 1.06,
      scaleY: 0.95,
      duration: 160,
      easing: 'easeOutQuad'
    })
    .add({
      targets: avatar.value,
      scaleX: 1,
      scaleY: 1,
      duration: 160,
      easing: 'spring(1, 80, 10, 0)'
    })

  return currentAnim.finished
}

/* 4) fall — 撲倒（向前翻倒），最後停在倒地狀態 */
async function fall() {
  stopCurrent()
  // 使用 translateY 與 rotate，並設定 fill mode（anime.js 會保持最後狀態）
  currentAnim = anime({
    targets: avatar.value,
    rotate: 90, // 右側倒下，要倒左改成 -90
    translateY: 30,
    duration: 700,
    easing: 'easeInOutCubic',
    // 完成後不還原（看需求）
  })
  return currentAnim.finished
}

/* 5) roll — 滾動（滾動並位移） */
async function roll() {
  stopCurrent()
  // 旋轉與位移同時發生，做成 timeline 可以控制 ease
  currentAnim = anime({
    targets: avatar.value,
    rotate: 720,
    translateX: 200,
    duration: 1000,
    easing: 'easeOutQuart'
  })
  return currentAnim.finished
}

/* 可在組件卸載時停止動畫並清理 */
onUnmounted(() => {
  stopCurrent()
})
</script>

<style scoped>
.mugu-wrapper {
  padding: 24px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.avatar {
  width: 160px;
  height: 160px;
  user-select: none;
  cursor: pointer;
  display: block;
  object-fit: contain;
  transform-origin: 50% 50%;
  /* 設定 backface-visibility 有助於避免旋轉時的鋸齒 */
  backface-visibility: hidden;
}

/* 控制區（開發用） */
.controls {
  display:flex;
  flex-direction: column;
  gap: 8px;
}
.controls button { padding:6px 10px; border-radius:6px; border:1px solid #ddd; background:#fff; cursor:pointer; }
</style>

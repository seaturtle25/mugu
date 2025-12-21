<template>
  <div class="mugu-wrapper">
    <div class="avatar-container">
      <img
        ref="avatarRef"
        class="avatar"
        :src="imageSrc"
        alt="Mugu avatar"
        @click="onClick"
        draggable="false"
      />
    </div>
    <!--測試按鈕-->
    <div class="controls">
      <div class="btn-group">
        <button @click="triggerAnim('dodge')">躲一下</button>
        <button @click="triggerAnim('shake')">搖頭</button>
        <button @click="triggerAnim('jelly')">抖動</button>
        <button @click="triggerAnim('fall')">撲倒</button>
        <button @click="triggerAnim('roll')">滾動</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch} from 'vue'
import anime from 'animejs'

//預設表情
const props = defineProps({
  type: {
    type: String,
    default: 'default'
  }
})

//傳給父組件:現在訊號
const emit = defineEmits(['poke'])
const avatarRef = ref(null)
let currentAnim = null

const imageSrc = computed(() => {
  if (props.type === 'default') return '../avatars/default.png'
  return `../avatars/${props.type}.png`
})
watch(() => props.type, () => {
  triggerAnim('jelly')
})

function onClick() {
  emit('poke')
  triggerAnim('dodge')
}

function triggerAnim(name) {
  stopCurrent()
  if (name === 'dodge') dodge()
  else if (name === 'shake') shakeHead()
  else if (name === 'jelly') jelly()
  else if (name === 'fall') fall()
  else if (name === 'roll') roll()
}

function stopCurrent() {
  if (currentAnim) {
    try { currentAnim.pause() } catch(e) {/* ignore */}
    currentAnim = null
  }
}

function dodge() {
  stopCurrent()
  currentAnim = anime.timeline({
    duration: 260,
    easing: 'easeOutQuad',
  })
  currentAnim
    .add({
      targets: avatarRef.value,
      translateX: [0, 40],
      translateY: [0, 6],
      scale: [1, 0.95],
      duration: 140,
      easing: 'easeOutQuad'
    })
    .add({
      targets: avatarRef.value,
      translateX: [-10],
      translateY: [0],
      scale: [0.95, 1.05],
      duration: 100,
      easing: 'easeOutQuad'
    })
    .add({
      targets: avatarRef.value,
      translateX: 0,
      translateY: 0,
      scale: 1,
      duration: 120,
      easing: 'spring(1, 80, 10, 0)'
    })

  return currentAnim
}

async function shakeHead() {
  stopCurrent()
  currentAnim = anime.timeline({
    easing: 'easeInOutSine',
    duration: 70
  })
  currentAnim
    .add({
      targets: avatarRef.value,
      rotate: [-8, 18],
      duration: 120,
      easing: 'easeInOutSine'
    })
    .add({
      targets: avatarRef.value,
      rotate: [-12, 12],
      duration: 120,
      easing: 'easeInOutSine'
    })
    .add({
      targets: avatarRef.value,
      rotate: 0,
      duration: 140,
      easing: 'spring(1, 80, 10, 0)'
    })

  return currentAnim.finished
}


async function jelly() {
  stopCurrent()
  currentAnim = anime.timeline({
    easing: 'easeOutElastic(1, .6)',
    duration: 600
  })

  currentAnim
    .add({
      targets: avatarRef.value,
      scaleX: [1, 1.15],
      scaleY: [1, 0.85],
      duration: 160,
      easing: 'easeOutQuad'
    })
    .add({
      targets: avatarRef.value,
      scaleX: 0.9,
      scaleY: 1.12,
      duration: 160,
      easing: 'easeOutQuad'
    })
    .add({
      targets: avatarRef.value,
      scaleX: 1.06,
      scaleY: 0.95,
      duration: 160,
      easing: 'easeOutQuad'
    })
    .add({
      targets: avatarRef.value,
      scaleX: 1,
      scaleY: 1,
      duration: 160,
      easing: 'spring(1, 80, 10, 0)'
    })

  return currentAnim.finished
}

async function fall() {
  stopCurrent()
  currentAnim = anime({
    targets: avatarRef.value,
    rotate: 90,
    translateY: 30,
    duration: 700,
    easing: 'easeInOutCubic',
  })
  return currentAnim.finished
}

async function roll() {
  stopCurrent()
  currentAnim = anime({
    targets: avatarRef.value,
    rotate: 720,
    translateX: 200,
    duration: 1000,
    easing: 'easeOutQuart'
  })
  return currentAnim.finished
}

onUnmounted(() => {
  stopCurrent()
})
</script>

<style scoped>
.mugu-wrapper {
  padding: 24px;
  display: flex;
  gap: 35px;
  align-items: center;
  flex-direction: column;
  width: fit-content;
}

.avatar {
  width: 250px;
  height: 250px;
  user-select: none;
  cursor: pointer;
  display: block;
  object-fit: contain;
  transform-origin: 50% 50%;
  backface-visibility: hidden;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  opacity: 0.6; /* 讓測試按鈕半透明 */
  transition: opacity 0.2s;
}
.controls:hover { opacity: 1; }

.btn-group {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
}

button {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
}
button:hover { background: #f0f0f0; }
</style>

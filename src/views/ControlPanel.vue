<template>
  <div class="panel">
    <h3>控制面板</h3>

    <!-- 簡單 select (推薦) -->
    <label>角色型態：</label>
    <select v-model="localType" @change="updateType">
      <option value="default">原始</option>
      <option value="shy">害羞</option>
      <option value="happy">開心</option>
      <option value="awkward">尷尬</option>
      <option value="angry">生氣</option>
      <option value="sad">傷心</option>
      <option value="feel_down">低落</option>
      <option value="angry_sad">既生氣又難過</option>
    </select>

    <button @click="$emit('openDiary')">打開日記</button>

    <!-- 如果你真的想用圖片做選擇（顯示縮圖），下面是替代 UI 範例（註解: 取消註解並使用它）
    <div class="thumbnail-list">
      <div 
        v-for="opt in options" 
        :key="opt.value" 
        :class="['thumb', {active: localType === opt.value}]"
        @click="selectOpt(opt.value)"
      >
        <img :src="opt.thumb" :alt="opt.label" />
        <div class="label">{{ opt.label }}</div>
      </div>
    </div>
    -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ avatarType: String })
const emit = defineEmits(['changeType', 'openDiary'])

const localType = ref(props.avatarType)

// 當父端 avatarType 改變時，自動同步本地值
watch(() => props.avatarType, (v) => {
  localType.value = v
})

// 如果使用縮圖選單，可用這個 options 陣列
const options = [
  { value: 'default', label: '原始', thumb: '/avatars/default_thumb.png' },
  { value: 'shy', label: '害羞', thumb: '/avatars/shy_thumb.png' },
  { value: 'happy', label: '開心', thumb: '/avatars/happy_thumb.png' },
  { value: 'angry', label: '生氣', thumb: '/avatars/angry_thumb.png' }
]

function updateType() {
  emit('changeType', localType.value)
}

function selectOpt(v) {
  localType.value = v
  emit('changeType', v)
}
</script>

<style scoped>
.panel { padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 240px; }
.thumbnail-list { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
.thumb { cursor:pointer; text-align:center; width:70px; border:1px solid transparent; padding:6px; border-radius:6px; }
.thumb.active { border-color:#5b9cff; background:#f0f7ff; }
.thumb img { width:48px; height:48px; object-fit:cover; display:block; margin:0 auto 4px; border-radius:4px; }
.label { font-size:12px; }
</style>

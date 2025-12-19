<template>
  <div class="panel">
    <h3>Mugu 狀態</h3>
    
    <div class="grid-selector">
      <div 
        v-for="opt in options" 
        :key="opt.value" 
        class="grid-item"
        :class="{ active: currentType === opt.value }"
        @click="$emit('changeType', opt.value)"
      >
        <span class="emoji">{{ opt.emoji }}</span>
        <span class="label">{{ opt.label }}</span>
      </div>
    </div>

    <div class="divider"></div>

    <button class="diary-btn" @click="$emit('openDiary')">
      📖 寫日記
    </button>
  </div>
</template>

<script setup>
defineProps({ currentType: String })
defineEmits(['changeType', 'openDiary'])

const options = [
  { value: 'default',   label: '原始', emoji: '😐' },
  { value: 'shy',       label: '害羞', emoji: '😳' },
  { value: 'happy',     label: '開心', emoji: '😄' },
  { value: 'awkward',   label: '尷尬', emoji: '😅' },
  { value: 'angry',     label: '生氣', emoji: '😡' },
  { value: 'sad',       label: '傷心', emoji: '😢' },
  { value: 'feel_down', label: '低落', emoji: '😞' },
  { value: 'angry_sad', label: '氣哭', emoji: '😭' },
]
</script>

<style scoped>
.panel {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  user-select: none;
}

h3 { margin: 0; color: #444; font-size: 1.1rem; text-align: center; }

.grid-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 4px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.grid-item:hover { 
  background: #eef6ff; 
  transform: translateY(-2px);
}

.grid-item.active {
  border-color: #5b9cff;
  background: #eef6ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(91, 156, 255, 0.3);
}

.emoji { font-size: 24px; margin-bottom: 4px; }
.label { font-size: 12px; color: #666; }

.divider { height: 1px; background: #eee; margin: 4px 0; }

.diary-btn {
  width: 100%;
  padding: 12px;
  background: #7c4dff;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.diary-btn:hover { background: #651fff; }
.diary-btn:active { transform: scale(0.98); }
</style>

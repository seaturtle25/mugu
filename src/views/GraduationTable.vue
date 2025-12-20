<template>
  <div class="contain">
    <div class="contain-in">
      <div class="page-container">
          <div id="graduation-table">
              <h3 class="title">🎓 畢業門檻進度</h3>
              <div class="add-block">
                <div class="progress-list">
                    <div v-for="item in progressData" :key="item.name" class="progress-item">
                        <div class="info-header">
                            <span class="category-name">{{ item.name }}</span>
                            <span class="credits-detail">
                                {{ item.current }} / {{ item.total }} 學分
                            </span>
                        </div>
                        <div class ="chart-group">
                          <div class="bar-container">
                            <div class="progress-track-segmented">
                              <div 
                                  class="progress-fill" 
                                  :class="getParams(item).colorClass"
                                  :style="{ width: item.percentage + '%' }"
                              ></div>
                              <div 
                                class="mushroom-marker"
                                :style="{ left: item.percentage + '%' }"
                              >
                                <img src="@/assets/Mugu_happy.png" class="mushroom-emoji">
                              </div>
                            </div>
                          </div>

                          <div class="circle-container">
                              <div class="simple-donut" :style="getDonutStyle(item)"></div>
                              <span class="percentage-text-circle">{{ item.percentage }}%</span>
                          </div>
                        </div>
                        
                    </div>
                </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref, computed }  from 'vue';

    const rawData = ref([
        { name: '校必修', current: 0, total: 20 },
        { name: '系必修', current: 15, total: 40 },
        { name: '選修', current: 9, total: 30 },
        { name: '通識', current: 10, total: 20 },
        { name: '體育', current: 7, total: 8 },
        { name: '英文/多益', current: 6, total: 6 }
    ]);

    const progressData = computed(() => {
        return rawData.value.map(item => {
            let percent = Math.floor((item.current / item.total) * 100)
            if (percent > 100) percent = 100
            return { ...item, percentage: percent }
        })
    });

    function getParams(item) {
      if (item.percentage >= 100) return { colorClass: 'bg-completed' }
      if (item.percentage < 50) return { colorClass: 'bg-danger' }
      return { colorClass: 'bg-normal' }
    }
    function getDonutStyle(item) {
        let color = '#5dade2';
        if (item.percentage >= 100) color = '#58d68d';
        else if (item.percentage < 50) color = '#ec7063';
        return {
            background: `conic-gradient(${color} 0% ${item.percentage}%, #f3e5d8 ${item.percentage}% 100%)`
        }
    }
</script>

<style scoped>
.contain {
  @apply relative bg-[url(@/assets/Background.png)] min-h-screen bg-cover bg-center bg-no-repeat;
}

.contain-in {
  @apply relative z-10 flex flex-col items-center justify-center min-h-screen pt-10;
}

.page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

#graduation-table {
  @apply relative z-10 flex flex-col items-center w-5/6 px-8 pb-4 bg-custom-skin rounded-lg shadow-2xl font-contentFont;
}

.add-block {
  @apply justify-between w-full mb-3 bg-white bg-opacity-70 rounded-lg px-4 py-4;
}

.title {
  margin: 20px 0;
  color: #5a3825;
  font-size: 1.5rem;
  text-align: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.progress-item {
  margin-bottom: 15px;
}

.progress-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
  min-width: 140px;
}

.category-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}
.credits-detail {
  font-size: 0.8rem;
  color: #888;
}

.chart-group {
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: flex-end;
    gap: 15px;
}

.bar-container {
  position: relative;
  width: 100%;
  height: 16px;
  margin-bottom: 10px;
}

.progress-track-segmented {
  width: 100%;
  height: 16px;
  background-color: #f3e5d8;
  border-radius: 10px;
  overflow: visible;
  position: relative;
  display: flex;
  align-items: center;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 1s ease-in-out;
}

.mushroom-marker {
  position: absolute;
  top: 75%;
  transform: translate(-50%, -75%);
  z-index: 10;
  transition: left 1s ease-in-out;
  pointer-events: none;
}

.mushroom-emoji {
  width: 30px;
  filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.2));
  display: block;
}

/* 圓餅圖 */
.circle-container {
  width: 55px;
  height: 55px;
  position: relative;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.simple-donut {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  /* 挖洞：利用mask把中間變透明 */
  -webkit-mask: radial-gradient(transparent 58%, black 60%);
          mask: radial-gradient(transparent 58%, black 60%);
}

.percentage-text-circle {
  position: absolute;
  font-size: 0.8rem;
  font-weight: bold;
  color: #5a3825;
}

.bg-normal { background-color: 	#D94600; opacity: 0.8; }
.bg-completed { background-color: #BB3D00; opacity: 0.8;}
.bg-danger { background-color: #A23400; opacity: 0.8; }
</style>
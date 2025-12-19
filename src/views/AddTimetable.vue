<template>
  <div class="contain">
    <div class="contain-in">
      <div id="add-timetable">
        <div class="row">
          <h2>新增課表</h2>
          <button @click="updateProfile" class="save-btn">儲存</button>
        </div>
        <div class="add-block">
          <div class="block-row">
            <span>課表名稱</span>
            <input type="text"/>
          </div>
          <table class="show-add">
            <thead>
              <tr>
                <td class="small">編號</td>
                <td class="big">課名</td>
                <td class="big">簡稱</td>
                <td class="big">節次</td>
                <td class="big">地點</td>
                <td class="small">學分</td>
                <td class="big">類別</td>
              </tr>
            </thead>
          </table>
          <button @click="showForm" class="add-btn">+</button>
          <div v-if="isClicked">
            <div class="block-row">
              <span>課名</span>
              <input type="text" class="big" v-model="newCourse.name"/>
            </div>
            <div class="block-row">
              <span>簡稱</span>
              <input type="text" class="small" v-model="newCourse.shortName"/>
            </div>
            <div class="block-row">
              <span>節次</span>
              <div @click="isPeriodsOpen = !isPeriodsOpen" class="select-header big">
                {{ newCourse.time.length > 0 ? `已選 ${newCourse.time.length} 個時段` : '點擊選擇時段' }}
                <span :class="{'rotate-up': isPeriodsOpen}">▼</span>
              </div>

              <div v-if="isPeriodsOpen" class="checkbox-group big">
                <span v-for="period in times" :key="period" class="checkbox-item">
                  <input type="checkbox" :id="`time-${period}`" :value="period" v-model="newCourse.time">
                  <label :for="`time-${period}`">{{ period }}</label> 
                </span>
              </div>
            </div>
            <div class="block-row">
              <span>地點</span>
              <input type="text" class="big" v-model="newCourse.location"/>
            </div>
            <div class="block-row">
              <span>學分</span>
              <input type="number" min="0" class="small" v-model.number="newCourse.credits"/>
            </div>
            <div class="block-row">
              <span>類別</span>
              <select class="big" v-model="newCourse.category">
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <button @click="addNewCourse" class="add-btn">新增</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddTimetable", 
  data(){
    return{
      isClicked: false,
      isPeriodsOpen: false,
      newCourse: {
        name: '',
        shortName: '',
        time: [],
        location: '',
        credits: 0,
        category: '',
      },
      times: [
        '101', '102', '103', '104',
        '201', '202', '203', '204',
      ],
      categories: [
        '校必修', '系必修', '選修', '通識', '體育',
      ]
    }
  },
  methods: {
    showForm(){
      this.isClicked = !this.isClicked
    }
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

#add-timetable{
  @apply relative z-10 flex flex-col items-center w-5/6 px-8 pb-4 bg-custom-skin rounded-lg shadow-2xl font-contentFont;
}

h2 {
  @apply text-2xl mb-4 font-titleFont border-2 border-white text-left;
}

.row {
  @apply flex justify-between w-full mb-3;
}

.add-block {
  @apply justify-between w-full mb-3 bg-white bg-opacity-70 rounded-lg px-4 py-4;
}

.block-row {
  @apply flex w-full my-3 relative;
}

.block-row span {
  @apply w-1/12 text-left;
}

.block-row input {
  @apply border-b border-t-0 border-r-0 border-l-0 px-2 py-1 bg-white bg-opacity-0 border-black mr-10;
}

.block-row select {
  @apply border-b border-t-0 border-r-0 border-l-0 px-2 py-1 bg-white bg-opacity-0 border-black mr-10;
}

.block-row tr {
  @apply border-2;
}

.show-add {
  @apply table-fixed w-full border-separate border border-solid border-custom-brown mt-5 mb-10 rounded-md;
}

.show-add td {
  @apply border border-solid border-custom-brown p-1 text-center rounded-md;
}

.small {
  @apply w-1/12;
}

.big {
  @apply w-2/12;
}

.select-header {
  @apply flex justify-between items-center cursor-pointer 
         border-solid border-b border-t-0 border-r-0 border-l-0 border-black 
         px-2 py-1 mr-10 bg-white bg-opacity-0;
}

.select-header span {
  @apply transition-transform duration-300;
}

.select-header .rotate-up {
  @apply transform -rotate-180;
}

/* Checkbox 群組樣式：變成一個可捲動的選單盒子 */
.checkbox-group {
  /* 讓 Checkbox 群組定位在 Select Header 下方 */
  @apply absolute z-20 bg-white shadow-lg border border-gray-300 rounded mt-1 p-2 max-h-40 overflow-y-auto;
  /* 繼承 block-row 的寬度控制 */
  /* big 是 w-2/12，這裡可能需要根據實際佈局調整絕對寬度 */
  width: calc(25% - 40px); /* 假設 block-row span 佔 1/12，input/select 佔 2/12，且有 mr-10 (40px) */
}

.checkbox-item {
  @apply flex items-center w-full; /* 讓每個選項佔滿寬度 */
}

.checkbox-item input[type="checkbox"] {
  @apply w-auto border-none mr-1; 
}


.save-btn {
  @apply bg-custom-brown bg-opacity-100 text-white px-4 py-0 rounded my-4 hover:bg-opacity-80 transition font-contentFont;
}

.add-btn {
  @apply bg-custom-brown bg-opacity-100 text-white rounded hover:bg-opacity-80 transition font-contentFont;
}
</style>
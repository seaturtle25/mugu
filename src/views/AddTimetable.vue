<template>
  <div class="contain">
    <div class="contain-in">
      <div id="add-timetable">
        <div class="row">
          <h2>新增課表</h2>
          <button @click="saveTimetable" class="save-btn">儲存</button>
        </div>
        <div class="add-block">
          <div class="block-row">
            <span>課表名稱</span>
            <input type="text" v-model="timetableName"/>
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
                <td class="small">操作</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(course, index) in courseList" :key="index">
                <td class="small">{{ index + 1 }}</td>
                <td class="big">{{ course.name }}</td>
                <td class="big">{{ course.shortName }}</td>
                <td class="big">{{ course.time.join(', ') }}</td>
                <td class="big">{{ course.location }}</td>
                <td class="small">{{ course.credits }}</td>
                <td class="big">{{ course.category }}</td>
                <td class="small">
                  <button @click="removeCourse(index)" class="text-red-500 hover:text-red-700">X</button>
                </td>
              </tr>
            </tbody>
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

              <div v-if="isPeriodsOpen" class="time-dropdown">
                <table class="time">
                  <thead>
                    <tr>
                      <th class="empty-box"></th>
                      <th v-for="day in weekDays" :key="day" class="weekday-th">{{ day }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(period, pIndex) in periods" :key="pIndex">
                      <td class="period-td">{{ period }}</td>
                      
                      <td 
                        v-for="(day, dIndex) in weekDays" 
                        :key="`${dIndex}-${pIndex}`"
                        class="time-cell"
                        :class="{ 'selected': isSelected(dIndex, pIndex) }"
                        @click="toggleTime(dIndex, pIndex)"
                      >
                        <span v-if="isSelected(dIndex, pIndex)">✓</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
import axios from 'axios';
export default {
  name: "AddTimetable", 
  data(){
    return{
      isClicked: false,
      isPeriodsOpen: false,
      timetableName: '',
      courseList: [],
      newCourse: {
        name: '',
        shortName: '',
        time: [],
        location: '',
        credits: 0,
        category: '',
      },
      weekDays: ['一', '二', '三', '四', '五', '六', '日'],
      periods: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      categories: [
        '校必修', '系必修', '選修', '通識', '體育', '英文畢業門檻',
      ]
    }
  },
  methods: {
    showForm(){
      this.isClicked = !this.isClicked
    },
    getTimeValue(day, period) {
      return `${day+1}0${period+1}`;
    },
    isSelected(day, period) {
      const val = this.getTimeValue(day, period);
      return this.newCourse.time.includes(val);
    },
    toggleTime(day, period) {
      const val = this.getTimeValue(day, period);
      const index = this.newCourse.time.indexOf(val);
      
      if (index === -1) {
        this.newCourse.time.push(val);
      } else {
        this.newCourse.time.splice(index, 1);
      }
    },
    addNewCourse() {
      if(!this.newCourse.name) return alert("請輸入課名");
      //加進list
      this.courseList.push(JSON.parse(JSON.stringify(this.newCourse)));
      this.newCourse = {
        name: '',
        shortName: '',
        time: [],
        location: '',
        credits: 0,
        category: '',
      };
    },
    removeCourse(index) {
      this.courseList.splice(index, 1);
    },
    async saveTimetable() {
      const token = localStorage.getItem('token');
      if(!token) {
        alert("請先登入!");
        this.$router.push('/login');
        return;
      }
      if(!this.timetableName) return alert("請輸入課表名稱");
      if(this.courseList.length === 0) return alert("請新增至少一門課程");
      try {
        const res = await axios.post(`${import.meta.env.VUE_APP_API_URL}/api/timetable/addTimetable`,{
            timetable_name: this.timetableName,
            courses: this.courseList
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = res.data;

        alert('課表新增成功！');
        //跳轉到課表顯示頁面
        console.log(data);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data) {
          // 後端回傳的具體錯誤
          alert('新增失敗: ' + (err.response.data.message || '未知錯誤'));
        } else {
          // 網路連不上或其他程式錯誤
          alert('系統發生錯誤，請稍後再試');
        }
      }
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
  @apply justify-between w-full mb-3 bg-custom-lightSkin rounded-lg px-4 py-4;
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

.time-dropdown {
  @apply absolute top-full left-[8.33%] z-50 mt-1 bg-white shadow-2xl border border-solid border-gray-300 rounded-lg w-auto overflow-hidden;
}

.time {
  @apply w-full border-collapse bg-white text-[10px];
}

.empty-box {
  @apply p-1 bg-gray-100 border border-gray-300;
}

.weekday-th {
  @apply p-1 w-5 bg-gray-100 border border-gray-300 text-gray-600 font-bold;
}

.period-td {
  @apply p-1 w-3 bg-gray-50 border border-gray-300 text-gray-500 font-bold text-center;
}

.time-cell {
  @apply border border-gray-300 text-center align-middle h-3 w-5 cursor-pointer transition-colors duration-200;
  @apply hover:bg-custom-skin;
}

.time-cell.selected {
  @apply bg-custom-brown text-white;
  @apply hover:bg-opacity-90;
}

.save-btn {
  @apply bg-custom-brown bg-opacity-100 text-white px-4 py-0 rounded my-4 hover:bg-opacity-80 transition font-contentFont;
}

.add-btn {
  @apply bg-custom-brown bg-opacity-100 text-white rounded hover:bg-opacity-80 transition font-contentFont;
}
</style>
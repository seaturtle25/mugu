<template>
  <div class="contain">
    <div class="contain-in">
      <div class="timetable">
        <div class="row">
          <div>
            <span>請選擇課表</span>
            <select v-model="current_timetable">
              <option v-for="item in timetableList" :key="item._id" :value="item._id">
                {{ item.timetableName }}
              </option>
            </select>
          </div>
          <router-link to="/addTimetable">新增課表</router-link>
        </div>
        <div class="show-block">
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
                >
                  <div>{{ getCourseName(dIndex+1, pIndex+1) }}</div>
                  <div class="location">{{ getCourseLoca(dIndex+1, pIndex+1) }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "ShowTimetable", 
  data(){
    return{
      current_timetable: null,
      timetableList: [],
      currentCourses: [],
      weekDays: ['一', '二', '三', '四', '五', '六', '日'],
      periods: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    }
  },
  watch: {
    current_timetable(newId){
      if(newId){
        this.loadTimetable(newId);
      }
    }
  }, 
  created() {
    this.loadTimetableList();
  },
  methods: {
    async loadTimetableList(){
      const token = localStorage.getItem('token');
      if(!token){
        alert("請先登入!");
        this.$router.push('/login');
        return;
      }
      
      try {
        const res = await axios.get(`${import.meta.env.VUE_APP_API_URL}/api/timetable/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.timetableList = res.data;
        
        if(this.timetableList.length > 0){
          this.current_timetable = this.timetableList[0]._id;
        }
      }catch (err) {
        this.handleError(err);
      }
    },
    async loadTimetable(timetableId){
      const token = localStorage.getItem('token');
      if(!token){
        alert("請先登入!");
        this.$router.push('/login');
        return;
      }
      
      try {
        const res = await axios.get(`${import.meta.env.VUE_APP_API_URL}/api/timetable/timetable/${timetableId}`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("Current Courses Loaded: ", res.data);
        this.currentCourses = res.data ?.courses || [];
      }catch (err) {
        this.handleError(err);
      }
    },
    getCourseName(dIndex, pIndex){
      if(!this.currentCourses || this.currentCourses.length === 0) return '';
      const key = `${dIndex}0${pIndex}`;
      const course = this.currentCourses.find(c=>c.time.includes(key));
      return course ? course.shortName: '';
    },
    getCourseLoca(dIndex, pIndex){
      if(!this.currentCourses || this.currentCourses.length === 0) return '';
      const key = `${dIndex}0${pIndex}`;
      const course = this.currentCourses.find(c=>c.time.includes(key));
      return course ? course.location: '';
    },
    handleError(err){
      console.error("載入失敗", err);
        
      if (err.response && err.response.status === 401) {
        alert('登入時效已過，請重新登入');
        localStorage.removeItem('token'); // 清除無效 Token
        this.$router.push('/login');
      } else {
        alert('讀取資料失敗');
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

.timetable {
  @apply relative z-10 flex flex-col items-center w-3/5 px-8 py-4 mt-10 bg-custom-skin rounded-lg shadow-2xl font-contentFont;
}

.row {
  @apply flex justify-between w-full mb-3;
}

.row span {
  @apply w-24 text-left;
}

.row select {
  @apply border-b border-t-0 border-r-0 border-l-0 rounded-sm px-2 py-1 bg-white bg-opacity-0 border-black mr-10;
}

.row a {
  @apply bg-custom-brown bg-opacity-100 text-white rounded hover:bg-opacity-80 transition font-contentFont text-xs no-underline py-1 px-2;
}

.show-block {
  @apply justify-between w-full bg-custom-lightSkin rounded-lg px-4 py-4;
}

.time {
  @apply w-full border-separate border-spacing-1.5 bg-custom-lightSkin bg-opacity-0 text-base;
}

.empty-box {
  @apply p-2 bg-gray-100 bg-opacity-0;
}

.weekday-th {
  @apply p-2 w-5 bg-custom-skin bg-opacity-50 rounded-md text-custom-brown font-bold;
}

.period-td {
  @apply p-2 w-3 bg-custom-skin bg-opacity-50 rounded-md text-custom-brown font-bold text-center;
}

.time-cell {
  @apply border border-custom-lightBrown border-solid rounded-md text-center align-middle h-3 w-5 transition-colors duration-200;
}

.location {
  @apply text-xs pt-0.5;
}
</style>
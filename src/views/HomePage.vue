<template>
  <div class="contain">
    <div class="before" v-if="!isLoggedIn">
      <h1>MUGU - 你的學分精算師</h1>
      <img :src="require('@/assets/Mugu_happy.png')" alt="Mugu" id="mugu-img">
      <div>
          <router-link to="/register">
            <button class="sign-log-btn">註冊</button>
          </router-link>
          <router-link to="/login">
            <button class="sign-log-btn">登入</button>
          </router-link>
      </div>
    </div>

    <div class="contain-in" v-else>
      <div class="after"> 

        <div class="timetable-section">
          <div class="section-header">
            <span>今日課表</span>
            <select v-model="current_timetable">
              <option v-for="item in timetableList" :key="item._id" :value="item._id">
                {{ item.timetableName }}
              </option>
            </select>
          </div>
          <table class="time-table">
            <tbody>
              <tr v-for="(item, index) in todaysCourses" :key="index">
                <td class="period-td">{{ item.period }}</td>       
                <td class="time-cell">
                  <div class="course-name">{{ item.name }}</div>
                  <div class="location">{{ item.location }}</div>
                </td>
              </tr>
              <tr v-if="todaysCourses.length === 0">
                <td colspan="2" class="no-class">今天沒課 !!</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="todo-section">
          <div class="section-header">
            <span>備忘錄</span>
          </div>
          <div class="todo-input">
            <input
              v-model="newTodo.content"
              type="text"
              placeholder="新增待辦事項..."
              class="input-text">
            <input
              v-model="newTodo.deadline"
              type="datetime-local"
              class="input-date">
            <button @click="addTodo" class="add-btn">+</button>
          </div>
          <ul class="todo-list">
            <li v-for="todo in todos" :key="todo._id" class="todo-cards">
              <div class="todo-content">
                <div class="content-main">
                  <span>{{ todo.content }}</span>
                  <button @click="removeTodo(todo._id)" class="delete-btn">×</button>
                </div>
                <div class="todo-date">{{ formatTime(todo.deadline) }}</div>
              </div>
            </li>
          </ul>
          <div v-if="todos.length === 0" class="empty-todo">沒有要做的事喔 !!</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "HomePage", 
  data(){
    return{
      timetableList: [],
      current_timetable: null,
      currentCourses: [],
      isLoggedIn: localStorage.getItem("token") !== null,
      todos: [],
      newTodo: {
        content: '',
        deadline: ''
      }
    }
  },
  computed: {
    todaysCourses() {
      if(!this.currentCourses.length) return [];
      const todayIndex = new Date().getDay() === 0 ? 7 : new Date().getDay();
      const todayPrefix = todayIndex.toString();

      let list = [];

      this.currentCourses.forEach(course => {
        course.time.forEach(t => {
          if(t.startsWith(todayPrefix)) {
            const periodStr = t.slice(1);
            const periodNum = parseInt(periodStr);
            list.push({
              period: periodNum,
              name: course.shortName || course.name,
              location: course.location || ""
            });
          }
        });
      });

      console.log(list);
      return list.sort((a, b) => a.period - b.period);
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
    if (this.isLoggedIn) {
      this.loadTimetableList();
      this.getTodos();
    }
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
        const res = await axios.get(`${process.env.VUE_APP_API_URL}/api/timetable/user`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.timetableList = res.data;
        
        if(this.timetableList.length > 0){
          this.current_timetable = this.timetableList[this.timetableList.length-1]._id;
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
        const res = await axios.get(`${process.env.VUE_APP_API_URL}/api/timetable/timetable/${timetableId}`,{
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
    handleError(err){
      console.error("載入失敗", err);
        
      if (err.response && err.response.status === 401) {
        alert('登入時效已過，請重新登入');
        localStorage.removeItem('token'); // 清除無效 Token
        this.$router.push('/login');
      } else {
        alert('讀取資料失敗');
      }
    },
    async getTodos() {
      const token = localStorage.getItem('token');
      if(!token){
        alert("請先登入!");
        this.$router.push('/login');
        return;
      }
      try {
        const res = await axios.get(`${process.env.VUE_APP_API_URL}/api/todo`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        this.todos = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    async addTodo() {
      if (!this.newTodo.content.trim()) return;
      const token = localStorage.getItem('token');

      let isoDeadline = '';
      if (this.newTodo.deadline) {
        const deadlineDate = new Date(this.newTodo.deadline);
        isoDeadline = deadlineDate.toISOString();
      }

      try {
        const res = await axios.post(`${process.env.VUE_APP_API_URL}/api/todo`, 
          { content: this.newTodo.content,  
            deadline: isoDeadline },
          { headers: { 'Authorization': `Bearer ${token}` }}
        );
        
        //直接塞進陣列
        this.todos.unshift(res.data); 
        this.newTodo.content = '';
        this.newTodo.deadline = '';
      } catch (err) {
        alert("新增失敗");
      }
    },
    async removeTodo(todoId) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`${process.env.VUE_APP_API_URL}/api/todo/${todoId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        //過濾掉刪掉的
        this.todos = this.todos.filter(t => t._id !== todoId);
      } catch (err) {
        alert("刪除失敗");
      }
    },
    formatTime(dateString) {
        if(!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('zh-TW', { 
            month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
    }
  }
}
</script>

<style scoped>
.contain {
  @apply flex-1 bg-[url(@/assets/Background.png)] min-h-screen bg-cover bg-center bg-no-repeat bg-fixed;
}

.contain-in {
  @apply relative z-10 flex flex-col items-center justify-center min-h-screen w-full;
}

.before {
  @apply flex flex-col items-center mx-auto pt-32 px-4 text-center;
}

.after {
  /* lg: 大螢幕 */
  @apply relative z-10 flex flex-col w-11/12 px-2 py-4 mt-10 font-contentFont mx-auto gap-8
         lg:flex-row lg:w-4/5 lg:px-8 lg:gap-0 xl:w-3/5;
}

h1 {
  @apply text-custom-brown font-titleFont text-2xl md:text-4xl mb-4;
}

#mugu-img {
  @apply w-40 md:w-60;
}

.sign-log-btn {
  @apply bg-custom-brown bg-opacity-100 text-white px-4 py-2 rounded mx-2 hover:bg-opacity-80 transition font-contentFont text-sm md:text-base;
}

.timetable-section {
  @apply w-full lg:w-[35%] flex flex-col;
}

.section-header {
  @apply flex justify-between items-center mb-4 border-b pb-2;
}

.section-header span {
  @apply text-base font-bold text-custom-brown m-0;
}

.section-header select {
  @apply border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 bg-white max-w-[150px];
}

.time-table {
  @apply w-full border-separate border-spacing-2;
}

.period-td {
  @apply w-10 h-10 bg-custom-skin bg-opacity-50 rounded-md text-custom-brown text-center text-base shrink-0;
}

.time-cell {
  @apply flex flex-row justify-between border border-dashed border-custom-lightBrown rounded-md p-3 transition-colors duration-200 bg-custom-lightSkin hover:bg-orange-100;
}

.course-name {
  @apply font-bold text-custom-brown text-base;
}

.location {
  @apply text-sm text-custom-lightBrown mt-1;
}

.no-class {
  @apply text-center text-gray-400 py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300;
}

.todo-section {
  @apply flex flex-col p-5 min-h-[400px] bg-custom-skin bg-opacity-50 rounded-lg w-11/12
         lg:ml-10 lg:mt-0 lg:flex-1;
}

.todo-input {
  @apply flex flex-col gap-2 mb-6 bg-custom-lightSkin p-4 rounded-lg sm:flex-row;
}

.input-text {
  @apply w-full border border-gray-300 rounded py-2 focus:outline-none focus:border-custom-brown;
}

.input-date {
  @apply w-full border border-gray-300 rounded py-1 text-sm text-gray-600 sm:w-auto sm:flex-1;
}

.add-btn {
  @apply bg-custom-brown text-white w-full rounded flex items-center justify-center text-xl hover:opacity-90 py-2 sm:w-12 sm:py-0;
}

.todo-list {
  @apply grid grid-cols-1 gap-3 auto-rows-min mx-1 sm:grid-cols-2 xl:grid-cols-3;
}

.todo-cards {
  @apply flex flex-col bg-white/60 rounded-md p-2 shadow-sm transition hover:shadow-md sm:bg-transparent sm:shadow-none sm:p-0;
}

.todo-content {
  @apply flex flex-col h-full w-full;
}

.content-main {
  @apply flex items-start justify-between w-full;
}

.content-main span {
  @apply break-all pr-2; 
}

.todo-date {
  @apply text-xs text-custom-brown mt-2 font-bold flex items-center sm:mt-0 sm:mb-1;
}

.delete-btn {
  @apply bg-white text-custom-brown w-5 h-5 rounded flex items-center justify-center text-xs ml-auto border-solid border border-custom-brown hover:opacity-90 shrink-0 sm:w-3 sm:h-3 sm:ml-4 sm:m-1.5 sm:p-1.5;
}

.empty-todo {
  @apply text-center text-gray-400 mt-10;
}
</style>
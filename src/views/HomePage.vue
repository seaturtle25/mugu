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
                  <!--
                  <input
                    type="checkbox"
                    v-model="todo.isDone"
                    @change="toggleTodo(todo)"
                    class="todo-checkbox">-->
                  
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

      try {
        const res = await axios.post(`${process.env.VUE_APP_API_URL}/api/todo`, 
          { content: this.newTodo.content,  
            deadline: this.newTodo.deadline },
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
    },/*
    async toggleTodo(todo) {
      const token = localStorage.getItem('token');
      try {
        await axios.put(`${process.env.VUE_APP_API_URL}/api/todo/${todo._id}`, {}, {
           headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        todo.isDone = !todo.isDone; //失敗的話勾回去
        alert("更新失敗");
      }
    },*/
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
  @apply flex-1 bg-[url(@/assets/Background.png)] min-h-screen bg-cover bg-center bg-no-repeat;
}

.contain-in {
  @apply relative z-10 flex flex-col items-center justify-center min-h-screen;
}

.before{
  @apply flex flex-col items-center mx-auto pt-32;
}

.after{
 @apply relative z-10 flex flex-row items-center w-3/5 px-8 py-4 mt-10 font-contentFont;
}

h1 {
  @apply text-custom-brown font-titleFont;
}

#mugu-img{
  @apply w-60;
}

.sign-log-btn {
  @apply bg-custom-brown bg-opacity-100 text-white px-4 py-2 rounded mx-2 hover:bg-opacity-80 transition font-contentFont;
}


.timetable-section {
  @apply w-[35%] flex flex-col; 
}

.section-header {
  @apply flex justify-between items-center mb-4 border-b pb-2;
}

.section-header span {
  @apply text-base font-bold text-custom-brown m-0;
}

.section-header select {
  @apply border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 bg-white;
}

.time-table {
  @apply w-full border-separate border-spacing-2;
}

.period-td {
  @apply w-10 h-10 bg-custom-skin bg-opacity-50 rounded-md text-custom-brown text-center text-base;
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


/*備忘錄區塊*/
.todo-section {
  @apply flex flex-col ml-16 p-5 min-h-[400px] bg-custom-skin bg-opacity-50 rounded-lg;
}

.todo-input {
  @apply flex flex-row gap-2 mb-6 bg-custom-lightSkin p-4 rounded-lg;
}

.input-text {
  @apply w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-custom-brown;
}

.input-date {
  @apply flex-1 border border-gray-300 rounded px-3 py-1 text-sm text-gray-600;
}

.add-btn {
  @apply bg-custom-brown text-white w-12 rounded flex items-center justify-center text-xl hover:opacity-90;
}


.todo-list {
  @apply grid grid-cols-3 gap-2 auto-rows-min mx-1; 
}

.todo-cards {
  @apply list-disc flex items-center;
}

.todo-content {
  @apply flex flex-col h-full;
}

.content-main {
  @apply flex items-start;
}

/*
.todo-checkbox {
  @apply mt-1 mr-2 cursor-pointer;
}
*/
.todo-date {
  @apply text-xs text-custom-brown mb-1 font-bold flex items-center;
}

.delete-btn {
  @apply bg-white text-custom-brown w-3 h-3 rounded flex items-center justify-center text-xs ml-4 m-1.5 p-1.5 text-center border-solid border border-custom-brown hover:opacity-90;
}

.empty-todo {
  @apply text-center text-gray-400 mt-10;
}
</style>
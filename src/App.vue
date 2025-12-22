<template>
  <div :key="isLoggedIn">
    <nav>
      <div v-if="!isLoggedIn">
        <router-link to="/">MUGU-你的學分精算師</router-link>
        <a href="https://www.canva.com/design/DAG8IOnQ9FQ/_U6MD8Ri9RBvTQFxG3bo9Q/edit?utm_content=DAG8IOnQ9FQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton" class="link" target="_blank">簡報連結</a>
      </div>
      <div v-else>
        <router-link to="/">MUGU-你的學分精算師</router-link>
        <div>
          <a href="https://www.canva.com/design/DAG8IOnQ9FQ/_U6MD8Ri9RBvTQFxG3bo9Q/edit?utm_content=DAG8IOnQ9FQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton" target="_blank">簡報連結</a>
          <router-link to="/mugu">MUGU</router-link>
          <router-link to="/GraduationTable">畢業進度</router-link>
          <router-link to="/Timetable">課表</router-link>
          <router-link to="/control">控制頁面</router-link>
          <button id="logout-btn" @click="logout">登出</button>
        </div>
      </div>
    </nav>
    <div class="pt-16">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: "App", 
  data(){
    return{
      isLoggedIn: false, 
    }
  },
  watch: {
    $route() {
      this.checkLoginStatus();
    }
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = localStorage.getItem("token") !== null;
    },
    logout() {
      localStorage.removeItem("token");
      this.isLoggedIn = false;
      this.$router.push("/"); 
    }
  }
}
</script>

<style>
nav {
  @apply fixed top-0 left-0 w-full p-4 z-20 bg-white/80 backdrop-blur-md font-contentFont;
}

nav div {
  @apply flex justify-between;
}

nav a {
  @apply text-custom-brown no-underline my-0 py-1.5 px-1.5;
}

#logout-btn {
  @apply bg-white text-custom-brown px-3 py-1.5 rounded mx-12 my-0 transition font-contentFont text-sm;
}

.link {
  @apply text-custom-brown no-underline mr-10 py-1.5;
}
</style>

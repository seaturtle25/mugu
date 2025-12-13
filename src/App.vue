<template>
  <div :key="isLoggedIn">
    <nav>
      <div v-if="!isLoggedIn">
        <router-link to="/">MUGU-你的學分精算師</router-link>
      </div>
      <div v-else>
        <router-link to="/">MUGU-你的學分精算師</router-link>
        <div>
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
      isLoggedIn: localStorage.getItem("token") !== null,
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token")
      this.isLoggedIn = false
      this.$router.push("/")
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
  @apply text-custom-brown no-underline my-0 py-1.5;
}

#logout-btn {
  @apply bg-white text-custom-brown px-3 py-1.5 rounded mx-12 my-0 transition font-contentFont text-sm;
}
</style>

<template>
  <div class="contain">
    <div class="head">
      <h1>MUGU - 你的學分精算師</h1>
      <img :src="require('@/assets/Mugu_happy.png')" alt="Mugu" id="mugu-img">
      <div>
          <router-link to="/register">
            <button>註冊</button>
          </router-link>
          <router-link to="/login">
            <button>登入</button>
          </router-link>
      </div>
    </div>
  </div>
  
</template>

<script>
export default {
  name: "HomePage"
}
</script>

<style scoped>
.contain {
  @apply flex-1 bg-[url(@/assets/Background.png)] min-h-screen bg-cover bg-center bg-no-repeat;
}

.head{
  @apply flex flex-col items-center mx-auto pt-32;
}

h1 {
  @apply text-custom-brown font-titleFont;
}

#mugu-img{
  @apply w-60;
}

button {
  @apply bg-custom-brown bg-opacity-100 text-white px-4 py-2 rounded mx-2 hover:bg-opacity-80 transition font-contentFont;
}
</style>
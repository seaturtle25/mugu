<template>
  <div id="head">
    <h1>MUGU - 你的學分精算師</h1>
    <img :src="require('@/assets/Mugu_happy.png')" alt="Mugu" id="mugu-img">
    <div>
        <button @click="">註冊</button>
        <button @click="">登入</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage"
}
</script>

<style scoped>
#head{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
h1 {
  color: #310d00;
}
#mugu-img{
    width: 30%;
    height: auto;
}
</style>
<template>
  <div class="contain">
    <div class="contain-in">
      <div id="head">
        <h2>登入</h2>
        <div class="form-row">
          <span>帳號</span>
          <input type="text" v-model="formData.username" />
        </div>
        <div class="form-row">
          <span>密碼</span>
          <input type="password" v-model="formData.password" />
        </div>
        <button @click="submit" class="submit-btn">送出</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "LoginPage",
  data() {
    return {
      formData: {
        username: '', 
        password: ''
      },
    };
  },
  methods: {
    async submit() {
      console.log(this.formData);
      try {
        const res = await axios.post(`${process.env.VUE_APP_API_URL}/api/auth/login`,{
          username: this.formData.username,
          password: this.formData.password
        });
        
        const data = res.data;

        alert('登入成功!');
        console.log('JWT token:', data.token);
        console.log('Username:', data.username);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        this.$root.isLoggedIn = true;
        this.$router.push('/');
      } catch(err) {
        console.error(err);
        if (err.response && err.response.data) {
          // 後端回傳的具體錯誤
          alert('登入失敗: ' + (err.response.data.message || '未知錯誤'));
        } else {
          // 網路連不上或其他程式錯誤
          alert('系統發生錯誤，請稍後再試');
        }
      }
    }
  },
};
</script>

<style scoped>
.contain {
  @apply flex-1 bg-[url(@/assets/Background.png)] min-h-screen bg-cover bg-center bg-no-repeat;
}

.contain-in {
  @apply relative z-10 flex flex-col items-center justify-center min-h-screen;
}

#head{
  @apply flex flex-col items-center w-80 px-8 pb-4 bg-custom-skin rounded-lg shadow-2xl font-contentFont;
}

h2 {
  @apply text-2xl mb-4 font-titleFont border-2 border-white;
}

.form-row {
  @apply flex justify-between w-full mb-3;
}

.form-row span {
  @apply w-24 text-left;
}

.form-row input {
  @apply border-0 rounded-lg px-2 py-1 flex-1;
}

.submit-btn {
  @apply bg-custom-brown bg-opacity-100 text-white px-4 py-2 rounded mt-4 hover:bg-opacity-80 transition font-contentFont;
}
</style>
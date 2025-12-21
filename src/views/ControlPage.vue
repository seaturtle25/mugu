<template>
  <div class="contain">
    <div class="contain-in">
      <div id="user-profile">
        <h2>修改個人資料</h2>
        <div class="form-row">
          <span>暱稱</span>
          <input type="text" v-model="formData.name"/>
        </div>
        <div class="form-row">
          <span>變更電子郵件</span>
          <input type="email" v-model="formData.email"/>
        </div>
        <div class="form-row">
          <span>舊密碼</span>
          <input type="password" v-model="formData.oriPasswd"/>
        </div>
        <div class="form-row">
          <span>新密碼</span>
          <input type="password" v-model="formData.newPasswd"/>
        </div>
        <div class="form-row">
          <span>新密碼確認</span>
          <input type="password" v-model="formData.checkPasswd"/>
        </div>
        <button @click="updateProfile" class="submit-btn">送出</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "ControlPage",
  data() {
    return{
      formData: {
        name: '',
        email: '',
        oriPasswd: '',
        newPasswd: '',
        checkPasswd: ''
      }
    }
  },
  created() {
    this.loadUserProfile();
  },
  methods: {
    async loadUserProfile(){
      const token = localStorage.getItem('token');
      if(!token){
        alert("請先登入!");
        this.$router.push('/login');
        return;
      }
      
      try {
        const res = await axios.get(`${import.meta.env.VUE_APP_API_URL}/api/auth/profile`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("User Profile Loaded:", res.data);
        const userData = res.data;
        this.formData.name = userData.name;
        this.formData.email = userData.email;
      }catch (err) {
        console.error("載入失敗", err);
        
        if (err.response && err.response.status === 401) {
          alert('登入時效已過，請重新登入');
          localStorage.removeItem('token'); // 清除無效 Token
          this.$router.push('/login');
        } else {
          alert('無法讀取使用者資料');
        }
      }
    },
    async updateProfile(){
      const token = localStorage.getItem('token');
      if(!token){
        alert("請先登入!");
        this.$router.push('/login');
        return;
      }
      
      const updateData = {}
      if(this.formData.name) updateData.name = this.formData.name;
      if(this.formData.email) updateData.email = this.formData.email;
      if(this.formData.newPasswd){
        if(this.formData.newPasswd !== this.formData.checkPasswd) {
          alert('新密碼輸入不一致!');
          return;
        }
        updateData.oriPasswd = this.formData.oriPasswd;
        updateData.newPasswd = this.formData.newPasswd;
      }

      try {
        const res = await axios.put(`${import.meta.env.VUE_APP_API_URL}/api/auth/profile`,
          updateData,
          {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = res.data;

        console.log('Profile update response:', data);
        alert('更新成功!');
        this.$router.push('/');
      } catch(err) {
        console.error(err);
        if (err.response) {
          
          const status = err.response.status;
          const msg = err.response.data.message || '更新失敗';

          if (status === 401) {
            alert('登入逾時，請重新登入');
            this.$router.push('/login');
          } else if (status === 400) {
            alert('權限不足或是舊密碼錯誤'); 
          } else {
            alert(`錯誤: ${msg}`); 
          }
        } else if (err.request) {
          alert('伺服器無回應，請檢查網路連線');
        } else {
          alert('發生未知錯誤');
        }
      }
    }
  }
};
</script>

<style scoped>
.contain {
  @apply relative bg-[url(@/assets/Background.png)] min-h-screen bg-cover bg-center bg-no-repeat;
}

.contain-in {
  @apply relative z-10 flex flex-col items-center justify-center min-h-screen;
}

#user-profile{
  @apply relative z-10 flex flex-col items-center w-80 px-8 pb-4 bg-custom-skin rounded-lg shadow-2xl font-contentFont;
}

h2 {
  @apply text-2xl mb-4 font-titleFont border-2 border-white;
}

.form-row {
  @apply flex justify-between w-full mb-3;
}

.form-row span {
  @apply w-28 text-left;
}

.form-row input {
  @apply border-0 rounded-lg px-2 py-1 flex-1;
}

.submit-btn {
  @apply bg-custom-brown bg-opacity-100 text-white px-4 py-2 rounded mt-4 hover:bg-opacity-80 transition font-contentFont;
}
</style>
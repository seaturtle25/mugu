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
  create() {
    this.loadUserProfile();
  },
  methods: {
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
        const res = await fetch('http://localhost:3000/api/auth/profile',{
          method: 'PUT',  //更新資料
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData),
        });
        
        

        if(res.ok){
          const data = await res.json();
          console.log('Profile update response:', data);
          alert('更新成功!');
          this.$router.push('/');
        }else{
          const text = await res.text();
          console.error('後端回應狀態碼:', res.status);
          console.error('後端回應原始內容', text);
          try {
            const data = JSON.parse(text);
            alert('更新失敗: ' + data.message);
          } catch {
            alert('更新失敗: 後端返回了非預期的 HTML 錯誤頁面，請檢查路由配置。');
          }
          
        } 
      } catch(err) {
        console.error(err);
        alert('更新發生錯誤');
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
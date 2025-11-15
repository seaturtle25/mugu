<template>
  <div id="head">
    <h2>註冊</h2>
    <div class="form-row">
      <span>姓名</span>
      <input type="text" v-model="formData.name" />
    </div>
    <div class="form-row">
      <span>電子郵件</span>
      <input type="email" v-model="formData.email" />
    </div>
    <div class="form-row">
      <span>帳號</span>
      <input type="text" v-model="formData.username" />
    </div>
    <div class="form-row">
      <span>密碼</span>
      <input type="password" v-model="formData.passwd" />
    </div>
    <div class="form-row">
      <span>密碼確認</span>
      <input type="password" v-model="formData.passwdCheck" />
    </div>
    <button @click="submit" class="submit-btn">送出</button>
  </div>
</template>

<script>
export default {
  name: "RegisterPage",
  data() {
    return {
      formData: {
        name: '', 
        email: '',
        username: '', 
        passwd: '', 
        passwdCheck: '',
      },
    };
  },
  methods: {
    submit() {
      console.log(this.formData);
    },
  },
};
</script>

<style scoped>
#head{
  @apply flex flex-col items-center w-80 px-12 py-2 mx-auto bg-custom-skin rounded-lg shadow-2xl;
}

h2 {
  @apply text-2xl mb-4;
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
  @apply bg-custom-brown bg-opacity-100 text-white px-4 py-2 rounded mt-4 hover:bg-opacity-80 transition;
}
</style>
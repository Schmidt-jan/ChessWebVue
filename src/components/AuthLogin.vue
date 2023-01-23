<template>
  <div class="row d-flex justify-content-center marginC">
    <div class="col-md-8 mt-5">
      <form @submit.prevent="onSub">
        <div class="form-group mb-3">
          <label><strong>Log in to play the game!</strong></label>
        </div>

        <div class="form-group mb-3">
          <label><strong>Email</strong></label>
          <input type="email" class="form-control form-control-lg" v-model="user.email"/>
        </div>

        <div class="form-group mb-3">
          <label><strong>Password</strong></label>
          <input type="password" class="form-control form-control-lg" v-model="user.password"/>
        </div>

        <div class="d-grid">
          <input type="submit" class="btn btn-primary btn-lg btn-block" value="Login"/>
        </div>
<div >
        <button class="btn btn-light marginC div_align" v-on:click="pressed">
          No Account?
        </button>
</div>

      </form>
    </div>
  </div>
</template>
<style>
html body {
  background: #4d59a4;
}
.div_align{
  horizontal-align: center;
}

.d-grid {
  margin-top: 30px !important;
}

.marginC{
  margin-top: 3rem !important;
}
b, strong {
  font-weight: bolder;
  color: white;
}

.form-control-lg {
  background: #3c478b !important;
  border-color: #5c68b500 !important;
  color: white !important;
}

.btn-primary {
  --bs-btn-color: #fff !important;
  --bs-btn-bg: #5c68b5 !important;
  --bs-btn-border-color: #0d6efd00 !important;
  --bs-btn-hover-color: #fff !important;
  --bs-btn-hover-bg: #6874bf !important;
  --bs-btn-hover-border-color: #0a58ca00 !important;
  --bs-btn-focus-shadow-rgb: 49,132,253 !important;
  --bs-btn-active-color: #fff !important;
  --bs-btn-active-bg: #5c68b5 !important;
  --bs-btn-active-border-color: #5c68b500 !important;
  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125) !important;
  --bs-btn-disabled-color: #fff !important;
  --bs-btn-disabled-bg: #0d6efd !important;
  --bs-btn-disabled-border-color: #0d6efd !important;
}
</style>
<script lang="ts">

import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {POSITION, TYPE, useToast} from "vue-toastification";
import {defineComponent} from "vue";
import {ToastOptions} from "vue-toastification/dist/types/types";

const toastOptions: ToastOptions & { type?: TYPE.ERROR | undefined; } = {
  type: TYPE.ERROR,
  position: POSITION.TOP_CENTER,
  timeout: 2000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  icon: true,
  rtl: false
}

export default defineComponent({
  data() {
    return {
      user: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    pressed(){
      this.$router.push('/register')
    },

    async onSub() {
      const toast = useToast();
      try {
        await signInWithEmailAndPassword(getAuth(), this.user.email, this.user.password)
        this.$router.push('/')
      } catch (error: any) {
        toast.error(error.message, toastOptions);
      }
    }
  }
});
</script>
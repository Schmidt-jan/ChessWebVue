<template>
  <div class="row d-flex justify-content-center marginC">
    <div class="col-md-8 mt-5">
      <form @submit.prevent="onSubmit">
        <div class="form-group mb-3">
          <label><strong>Name</strong></label>
          <input type="text" class="form-control form-control-lg" v-model="user.name"/>
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
          <input type="submit" class="btn btn-primary btn-lg btn-block" value="Register User"/>
        </div>
      </form>
    </div>
  </div>
</template>
<style>
html body {
  background: #4d59a4;
}

.d-grid {
  margin-top: 30px !important;
}

.marginC {
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
  --bs-btn-focus-shadow-rgb: 49, 132, 253 !important;
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
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
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
        name: '',
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async onSubmit() {
      try {
        await createUserWithEmailAndPassword(getAuth(), this.user.email, this.user.password);
        this.$router.push('/')
      } catch (error: any) {
        useToast().error(error.message, toastOptions);
      }
    }
  }
});
</script>
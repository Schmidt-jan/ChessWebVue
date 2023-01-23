<template>
  <nav class="navbar navbar-expand-lg bg-light fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">WebChess</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/">Play</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Chess
            </a>
            <ul class="dropdown-menu">
              <router-link class="dropdown-item" to="/history">History</router-link>
              <router-link class="dropdown-item" to="/rules">Rules</router-link>
            </ul>
          </li>
          <button v-on:click="pressed" class="btn btn-light btn_c" type="button" >
            {{ buttonText }}
          </button>
          <div class="nav-link">
            {{ account }}
          </div>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import {defineComponent} from "vue";
import {getAuth} from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";


export default defineComponent({
  name: "NavBar",
  data() {
    return {
      account: '',
      buttonText: ''
    }
  },
  methods:{
    onStart(){
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.account = user.email;
          this.buttonText ='Log out';
        } else {
          this.account = '';
          this.buttonText ='Sign in';
        }
      });
    },
    pressed(){
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          auth.signOut().then(function() {
            // Sign-out successful.
            this.$router.push('/login')
          }, function(error) {
            // An error happened.
          });
        } else {
          this.$router.push('/login')
        }
      });
    }
  },
  beforeMount(){
    this.onStart()
  },
});



</script>

<style scoped>

.btn_c{
  border-radius: 10px;
  background: #737ec5;
  color: white;
}

.bg-light {
  --bs-bg-opacity: 1;
  /* background-color: rgba(var(--bs-light-rgb),var(--bs-bg-opacity))!important; */
  background: #5c68b5 !important;
}

.navbar-brand, .navbar-nav, .nav-link.active, .navbar-nav, .show, .nav-link {
  color: white !important;
  --bs-nav-link-color: white !important;
}

/*
.navbar {
  opacity: 1;
  animation-delay: 0s;
  animation-duration: 1s;
  animation-name: fadeout;
  animation-fill-mode: forwards;
}


.navbar:hover {
  animation-name: fadein;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

@keyframes fadein {
  from { opacity: 0}
  to   { opacity: 1}
}

@keyframes fadeout {
  from { opacity: 1}
  to   {
    opacity: 0;
  }
}
 */
</style>
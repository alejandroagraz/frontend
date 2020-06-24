<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link to="/home" id="logo" class="menu active" v-if="location == 'login'">
        <img src="../../assets/images/logo2.png" class="app-logo" alt="Logotipo" />
        <span id="brand">
          <strong>Payment</strong>Gateway
        </span>
      </router-link>
      <div id="logo" class="menu active" v-else>
        <img src="../../assets/images/logo2.png" class="app-logo" alt="Logotipo" />
        <span id="brand">
          <strong>Payment</strong>Gateway
        </span>
      </div>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="nav">
          <li class="nav-item" v-if="location == 'payment'">
            <div class="d-none d-sm-none d-md-block" @click="logout">
              <span class="fas fa-sign-out-alt" style="font-size:48px;"></span>
            </div>
            <div class="d-block d-sm-block d-md-none"  @click="login">
              <span class="fas fa-sign-out-alt" style="font-size:18px;">
                Sign out
              </span>
            </div>            
          </li>
          <li class="nav-item" v-if="location == 'home'">
            <div class="d-none d-sm-none d-md-block"  @click="login">
              <span class="fas fa-sign-in-alt" style="font-size:48px;"></span>
            </div>
            <div class="d-block d-sm-block d-md-none"  @click="login">
              <span class="fas fa-sign-in-alt" style="font-size:18px;">
                Sign in
              </span>
            </div> 
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
<script>
import swal from "sweetalert";

export default {
  name: "HeaderComponent",
  props: ['location'],
  methods: {
    login() {
      this.$router.push('/login');
    },
    logout() {
      this.$store.dispatch("logout").then(res => {
        if(res.data.status == 'success') {
          this.$router.push('/home');
          swal(
            'Log out...',
            "Thanks for your time come back soon...",
            "success"
          );
        } else {
          swal(
            'Oops...',
            "An unexpected error has occurred...",
            "error"
          );
        }
      });
    }
  }
};
</script>
<style>
</style>

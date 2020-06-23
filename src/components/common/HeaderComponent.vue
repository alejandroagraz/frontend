<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link to="/home" id="logo" class="menu active">
        <img src="../../assets/images/logo2.png" class="app-logo" alt="Logotipo" />
        <span id="brand">
          <strong>Payment</strong>Gateway
        </span>
      </router-link>
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
          <li class="nav-item">
            <router-link to="/home" class="nav-link">HOME</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/payment" class="nav-link">PAYMENT</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
<script>
export default {
  name: "HeaderComponent",
  data() {
    return {};
  }
};
</script>
<style>
</style>

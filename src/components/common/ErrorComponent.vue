<template>
  <div id="notfound">
    <div class="notfound">
      <div class="notfound-404">
        <h1>Oops!</h1>
        <h2>404 - The Page can't be found</h2>
      </div>
      <router-link to="/home" class="nav-link">Go TO Homepage</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "ErrorComponent"
};
</script>

<style>
@import "../../assets/css/error.css";
</style>

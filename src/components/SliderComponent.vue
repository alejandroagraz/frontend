<template>
  <div id="carouselExampleCaptions" class="carousel slide" data-ride="carousel">
    <div class="clearfix"></div>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img class="slider-img" src="../assets/images/register-customer.jpg" v-if="actionBtnRegister"/>
        <img class="slider-img" src="../assets/images/oder-payment.jpg" v-if="actionPayment"/>
        <div class="carousel-caption d-md-block">
          <h3>{{title}}</h3>
          <button @click="redirectPayment()" class="btn btn-secondary" v-if="actionBtnRegister">{{nameBtn}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SliderComponent",
  props: ['title', 'nameBtn', 'actionPayment', 'actionBtnRegister'],
  methods: {
    redirectPayment(){
      if(localStorage.getItem('token')) {
        this.$router.push("/payment");
      } else {
        this.$router.push("/login");
      }
    }
  }
};
</script>   
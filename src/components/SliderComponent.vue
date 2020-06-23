<template>
  <div id="carouselExampleCaptions" class="carousel slide" data-ride="carousel">
    <div class="clearfix"></div>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img class="slider-img" src="../assets/images/oder-payment.jpg" v-if="actionBtnRegister"/>
        <img class="slider-img" src="../assets/images/register-customer.jpg" v-else-if="actionBtnPayment"/>
        <div class="carousel-caption d-md-block">
          <h5>{{title}}</h5>
          <button @click="redirectPayment()" class="btn btn-secondary" v-if="actionBtnRegister">{{nameBtn}}</button>
          <button @click="redirectHome()" class="btn btn-secondary" v-else-if="actionBtnPayment">{{nameBtn}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SliderComponent",
  props: ['title', 'nameBtn', 'actionBtnPayment', 'actionBtnRegister'],
  methods: {
    redirectPayment(){
      this.$router.push("/payment");
    },
    redirectHome(){
      this.$router.push("/home");
    }
  }
};
</script>   
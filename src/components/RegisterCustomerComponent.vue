<template>
  <div>
    <Header location="home" />
    <Slider
      title="Up to 10x faster. You can generate payments,
             consult, recharge your wallet and everything in a few minutes"
      nameBtn="PAYMENT ORDER"
      actionBtnRegister="true"
    />

    <div class="center-register">
      <section class="content">
        <h1 class="subheader text-center">REGISTER CUSTOMER</h1>

        <form class="mid-form" @submit.prevent="registerCustomer">
          <div v-if="(alert_danger)" class="alert alert-danger" role="alert">{{message}}</div>

          <div class="form-row">

            <div class="form-group col-md-6">
              <input
                type="text"
                v-model="register.email"
                class="form-control"
                placeholder="Insert email"
              />
              <div
                class="error"
                v-if="summitted && !$v.register.email.required"
              >This field is required</div>
              <div
                class="error"
                v-else-if="summitted && !$v.register.email.email"
              >The email must be in a valid format</div>
            </div>
            
            <div class="form-group col-md-6">
              <input
                type="text"
                v-model="register.dni"
                class="form-control"
                placeholder="Insert DNI"
              />
              <div
                class="error"
                v-if="summitted && !$v.register.dni.required"
              >This field is required</div>
              <div
                class="error"
                v-else-if="(summitted && !$v.register.dni.numeric) || (summitted && !$v.register.dni.minLength)"
              >DNI must be numeric min 5</div>
              <div
                class="error"
                v-else-if="summitted && !$v.register.dni.maxLength"
              >DNI must be numeric max 15</div>
            </div>

            <div class="form-group col-md-6">
              <input
                type="password"
                v-model="register.password"
                class="form-control"
                placeholder="Insert password"
              />
              <div
                class="error"
                v-if="summitted && !$v.register.password.required"
              >Password is required</div>
              <div
                class="error"
                v-else-if="summitted && !$v.register.password.minLength"
              >Password must be at least 6 characters</div>
              <div
                class="error"
                v-else-if="summitted && !$v.register.password.maxLength"
              >DNI must be numeric max 15</div>
              
            </div>

            <div class="form-group col-md-6">
              <input
                type="password"
                v-model="register.confirmPassword"
                class="form-control"
                placeholder="Confirm password"
              />
              <div
                class="error"
                v-if="summitted && !$v.register.confirmPassword.required"
              >Confirm Password is required</div>
              <div
                class="error"
                v-else-if="summitted && !$v.register.confirmPassword.sameAsPassword"
              >Passwords must match</div>
          
            </div>

            <div class="form-group col-md-6">
              <input
                type="text"
                v-model="register.name"
                class="form-control"
                placeholder="Insert A Name"
              />
              <div
                class="error"
                v-if="summitted && !$v.register.name.required"
              >This field is required</div>
              <div
                class="error"
                v-else-if="(summitted && !$v.register.name.alpha) || (summitted && !$v.register.name.minLength)"
              >Name must contain only letters 3 min</div>
            </div>
            <div class="form-group col-md-6">
              <input
                type="text"
                v-model="register.last_name"
                class="form-control"
                placeholder="Insert A Last Name"
              />
              <div
                class="error"
                v-if="summitted && !$v.register.last_name.required"
              >This field is required</div>
              <div
                class="error"
                v-else-if="(summitted && !$v.register.last_name.alpha) || (summitted && !$v.register.last_name.minLength)"
              >Last name must contain only letters 3 min</div>
            </div>
            <div class="form-group col-md-12">
              <input
                type="text"
                v-model="register.phone"
                class="form-control"
                placeholder="Insert Number Phone"
              />
              <div
                class="error"
                v-if="summitted && !$v.register.phone.required"
              >This field is required</div>
              <div
                class="error"
                v-else-if="(summitted && !$v.register.phone.phone) || !$v.register.phone.maxLength"
              >Example format +57 (123) 456-7890</div>
            </div>
            
          </div>

          <div class="clearfix"></div>
          <template>
            <button type="submit" class="col-sm btn btn-success">Register</button>
          </template>
        </form>
      </section>

      <div class="clearfix"></div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Slider from "./SliderComponent";
import Header from "./common/HeaderComponent";
import Footer from "./common/FooterComponent";
import Register from "../models/Register";
import axios from "axios";
import progressbar from '../main';
import Global from "../Global";
import swal from "sweetalert";
import {
  required,
  numeric,
  minLength,
  maxLength,
  email,
  helpers,
  sameAs
} from "vuelidate/lib/validators";

const alpha = helpers.regex("alpha", /^[A-Za-z _]*[A-Za-z][A-Za-z _]*$/);
const phone = helpers.regex("phone", /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/);
export default {
  name: "RegisterCustomerComponent",
  components: {
    Slider,
    Header,
    Footer
  },
  validations: {
    register: {
      email: {
        required,
        email
      },
      dni: {
        required,
        numeric,
        minLength: minLength(5),
        maxLength: maxLength(15)
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(15)
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs('password')
      },
      name: {
        required,
        alpha,
        minLength: minLength(3)
      },
      last_name: {
        required,
        alpha,
        minLength: minLength(3)
      },
      phone: {
        required,
        phone,
        maxLength: maxLength(18)
      },
    }
  },
  data() {
    return {
      alert_danger: false,
      summitted: false,
      message: String,
      register: new Register("", "", "", "", "","","")
    };
  },
  methods: {
    registerCustomer() {
      this.summitted = true;
      this.$v.register.$touch();
      if (this.$v.register.$invalid) {
        return false;
      } else {
        progressbar.$Progress.start();
        axios.post(Global.url + "register-customer", this.register)
        .then(res => {
          progressbar.$Progress.finish();
          if (res.data.status == "success") {
            swal(
              res.data.message,
              "Thank you for completing your registration...",
              "success"
            );
            this.register= new Register();
            this.summitted = false;
          } else if (res.data.status == "err") {
            this.message = res.data.message;
            this.alert_danger = true;
            setTimeout(() => {
              this.alert_danger = false;
            }, 10000);
            this.register= new Register();
            this.summitted = false;
          }
        })
        .catch(err => {
          progressbar.$Progress.fail(); 
          this.message =
            "Sorry An unexpected Error Ocurred Try Again";
          this.alert_danger = true;
          setTimeout(() => {
            this.alert_danger = false;
          }, 10000);
          this.register= new Register();
          this.summitted = false;
        });
      }
    }
  }
};

</script>

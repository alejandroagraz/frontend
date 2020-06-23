<template>
  <div>
    <Header />
    <Slider
      title="You Can Make Immediate Payments With Just One Click..."
      nameBtn="PAYMENT ORDER"
      actionBtnRegister="true"
    />

    <div class="center">
      <section id="content">
        <h1 class="subheader text-center">REGISTER CUSTOMER</h1>

        <form class="mid-form" @submit.prevent="registerCustomer">
          <div v-if="(alert_danger)" class="alert alert-danger" role="alert">{{message}}</div>

          <div class="form-row">
            <div class="form-group col-md-12">
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
            <div class="form-group col-md-6">
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
                v-else-if="(summitted && !$v.register.phone.numeric) || (summitted && !$v.register.phone.minLength)"
              >Phone must be numeric min 7</div>
              <div
                class="error"
                v-else-if="summitted && !$v.register.phone.maxLength"
              >Phone must be numeric max 15</div>
            </div>
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
          </div>

          <div class="clearfix"></div>
          <template>
            <button type="submit" class="col-sm btn btn-success">Register</button>
          </template>
        </form>
      </section>

      <aside id="sidebar">
        <RechargeWallet />
        <CheckBalance />
      </aside>

      <div class="clearfix"></div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Slider from "./SliderComponent";
import RechargeWallet from "./RechargeWalletComponent";
import CheckBalance from "./CheckBalanceComponent";
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
  helpers
} from "vuelidate/lib/validators";

const alpha = helpers.regex("alpha", /^[A-Za-z _]*[A-Za-z][A-Za-z _]*$/);
const phone = helpers.regex("phone", /^\+{1}[0-9]{9,15}$/);
export default {
  name: "RegisterCustomerComponent",
  components: {
    Slider,
    RechargeWallet,
    CheckBalance,
    Header,
    Footer
  },
  validations: {
    register: {
      dni: {
        required,
        numeric,
        minLength: minLength(5),
        maxLength: maxLength(15)
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
        numeric,
        minLength: minLength(7),
        maxLength: maxLength(15)
      },
      email: {
        required,
        email
      }
    }
  },
  data() {
    return {
      alert_danger: false,
      summitted: false,
      message: String,
      register: new Register("", "", "", "", "")
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

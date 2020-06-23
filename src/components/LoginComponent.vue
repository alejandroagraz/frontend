<template>

  <div>
    <Header location="login" />

    <div class="center-login">
      <section>
        <h1 class="subheader text-center">LOGIN</h1>

        <form class="mid-form login" @submit.prevent="loginCustomer">
          <div v-if="(alert_danger)" class="alert alert-danger" role="alert">{{message}}</div>

          <div class="form-row">

            <div class="form-group col-md-6">
              <input
                type="text"
                v-model="login.email"
                class="form-control"
                placeholder="Email address"
              />
              <div
                class="error"
                v-if="summitted && !$v.login.email.required"
              >This field is required</div>
              <div
                class="error"
                v-else-if="summitted && !$v.login.email.email"
              >The email must be in a valid format</div>
            </div>
            
            <div class="form-group col-md-6">
              <input
                type="password"
                v-model="login.password"
                class="form-control"
                placeholder="Insert password"
              />
              <div
                class="error"
                v-if="summitted && !$v.login.password.required"
              >This field is required</div>
              <div
                class="error"
                v-else-if="(summitted && !$v.login.password.minLength)"
              >Password min 6</div>
              <div
                class="error"
                v-else-if="summitted && !$v.login.password.maxLength"
              >Password max 15</div>
            </div>
            
          </div>

          <div class="clearfix"></div>
          <template>
            <button type="submit" class="col-sm btn btn-success">Submit</button>
          </template>
        </form>
      </section>

      <div class="clearfix"></div>
    </div>
    <Footer footer-login="true"/>
  </div>
</template>

<script>
import Header from "./common/HeaderComponent";
import Footer from "./common/FooterComponent";
import Login from "../models/Login";
import axios from "axios";
import progressbar from "../main";
import Global from "../Global";
import swal from "sweetalert";
import {
  required,
  minLength,
  maxLength,
  email
  
} from "vuelidate/lib/validators";

export default {
  name: "LoginComponent",
  components: {
    Header,
    Footer
  },
  validations: {
    login: {
      email: {
        required,
        email
        
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(15)
      },
    }
  },
  data() {
    return {
      alert_danger: false,
      summitted: false,
      message: String,
      login: new Login("","")
    };
  },
  methods: {
    loginCustomer() {
      this.summitted = true;
      this.$v.login.$touch();
      if (this.$v.login.$invalid) {
        return false;
      } else {
        progressbar.$Progress.start();
        this.$store
        .dispatch("login", this.login)
          .then(res => {
            progressbar.$Progress.finish();
            if (res.data.status == "success") {
              this.$router.push('/payment');
              swal(
                res.data.message,
                "Thanks for logging in....",
                "success"
              );
              this.login = new Login();
              this.summitted = false;
            } else if (res.data.status == "err") {
              this.message = res.data.message;
              this.alert_danger = true;
              setTimeout(() => {
                this.alert_danger = false;
              }, 10000);
              this.login = new Login();
              this.summitted = false;
            }
          })
          .catch(err => {
            progressbar.$Progress.fail();
            this.message = "Sorry An unexpected Error Ocurred Try Again";
            this.alert_danger = true;
            setTimeout(() => {
              this.alert_danger = false;
            }, 10000);
            this.login = new Login();
            this.summitted = false;
          });
      }
    }
  }
};
</script>

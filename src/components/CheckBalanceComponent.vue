<template>
  <div id="check" class="sidebar-item">
    <h3>Check Balance</h3>
    <p>Check Your Wallet Balance In An Instant</p>
    <div v-if="(alert_warning)" class="alert alert-warning" role="alert">{{message}}</div>
    <div v-if="(alert_danger)" class="alert alert-danger" role="alert">{{message}}</div>
    <form @submit.prevent="checkBalance">
      <div class="form-row">
        <div class="form-group col-md-5">
          <input type="text" v-model="check.dni" class="form-control" placeholder="DNI" />
          <div class="error" v-if="summitted && !$v.check.dni.required">This field is required</div>
          <div
            class="error"
            v-else-if="(summitted && !$v.check.dni.numeric) || (summitted && !$v.check.dni.minLength)"
          >DNI must be numeric min 5</div>
          <div
            class="error"
            v-else-if="summitted && !$v.check.dni.maxLength"
          >DNI must be numeric max 15</div>
        </div>

        <div class="form-group col-md-7">
          <input type="text" v-model="check.phone" class="form-control" placeholder="Phone" />
          <div class="error" v-if="summitted && !$v.check.phone.required">This field is required</div>
          <div
            class="error"
            v-else-if="(summitted && !$v.check.phone.phone) || !$v.check.phone.maxLength"
          >Example format +57 (123) 456-7890</div>
        </div>
      </div>

      <button type="submit" class="col-sm btn btn-success">Check Balance</button>
    </form>
  </div>
</template>

<script>
import Check from "../models/Check";
import axios from "axios";
import progressbar from '../main';
import Global from "../Global";
import swal from "sweetalert";
import {
  required,
  numeric,
  minLength,
  maxLength,
  helpers
} from "vuelidate/lib/validators";
const phone = helpers.regex("phone", /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/);

export default {
  name: "CheckBalanceComponent",
  validations: {
    check: {
      dni: {
        required,
        numeric,
        minLength: minLength(5),
        maxLength: maxLength(15)
      },
      phone: {
        required,
        phone,
        maxLength: maxLength(18)
      }
    }
  },
  data() {
    return {
      alert_success: null,
      alert_warning: null,
      alert_danger: null,
      summitted: false,
      message: String,
      balance: String,
      check: new Check("", "")
    };
  },
  methods: {
    checkBalance() {
      this.summitted = true;
      this.$v.check.$touch();
      if (this.$v.check.$invalid) {
        return false;
      } else {
        this.alert_danger = false;
        this.alert_warning = false;
        progressbar.$Progress.start();
        this.$store
        .dispatch("checkBalance",this.check.dni+'/'+this.check.phone)
        .then(res => {
          progressbar.$Progress.finish();
          if (res.data.status == "success") {
            this.message = "Available Balance: " + res.data.balance;
            this.alert_warning = true;
            setTimeout(() => {
              this.alert_warning = false;
            }, 30000);
            this.check = new Check();
            this.summitted = false;
          } else {
            this.message = res.data.message;
            this.alert_danger = true;
            setTimeout(() => {
              this.alert_danger = false;
            }, 10000);
            this.check = new Check();
            this.summitted = false;
          }
        })
        .catch(err => {
          console.log(err)
          progressbar.$Progress.fail(); 
          this.message =
            "Sorry An unexpected Error Ocurred Try Again";
          this.alert_danger = true;
          setTimeout(() => {
            this.alert_danger = false;
          }, 10000);
          this.check = new Check();
          this.summitted = false;
        });
      }
    }
  }
};
</script>

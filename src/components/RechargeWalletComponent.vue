<template>
  <div id="nav-blog" class="sidebar-item">
    <h3>Recharge Wallet</h3>

    <button
      type="button"
      class="col-sm btn btn-success"
      data-toggle="modal"
      data-target=".bd-example-modal-sm"
    >Recharge</button>

    <div
      class="modal fade bd-example-modal-sm"
      data-backdrop="static"
      tabindex="-1"
      role="dialog"
      aria-labelledby="mySmallModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">Recharge Wallet</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="(alert_danger)" class="alert alert-danger" role="alert">{{message}}</div>
            <form @submit.prevent="rechargeWallet">
              <div class="form-group">
                <input
                  type="text"
                  v-model="recharge.dni"
                  class="form-control"
                  placeholder="Insert DNI"
                />
                <div
                  class="error"
                  v-if="summitted && !$v.recharge.dni.required"
                >This field is required</div>
                <div
                  class="error"
                  v-else-if="(summitted && !$v.recharge.dni.numeric) || (summitted && !$v.recharge.dni.minLength)"
                >DNI must be numeric min 5</div>
                <div
                  class="error"
                  v-else-if="summitted && !$v.recharge.dni.maxLength"
                >DNI must be numeric max 15</div>
              </div>
              <div class="form-group">
                <input
                  type="text"
                  v-model="recharge.phone"
                  class="form-control"
                  placeholder="Insert Number Phone"
                />
                <div
                  class="error"
                  v-if="summitted && !$v.recharge.phone.required"
                >This field is required</div>
                <div
                  class="error"
                  v-else-if="(summitted && !$v.recharge.phone.phone) || !$v.recharge.phone.maxLength"
                >Example phone format +57 (123) 456-7890</div>
              </div>
              <div class="form-group">
                <input
                  type="text"
                  v-model="recharge.balance"
                  class="form-control"
                  placeholder="Amount To Recharge Wallet"
                />
                <div
                  class="error"
                  v-if="(summitted && !$v.recharge.balance.required) || (summitted && !$v.recharge.balance.numeric)"
                >Amount to recharge This field is required and must be numeric</div>
              </div>
              <div class="modal-footer">
                <button type="button" class="d-none" data-dismiss="modal" ref="removeModal">Close</button>
                <button type="submit" class="col-sm btn btn-success">Save Recharge</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Recharge from "../models/Recharge";
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
  name: "RechargeWalletComponent",
  validations: {
    recharge: {
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
      },
      balance: {
        required,
        numeric
      }
    }
  },
  data() {
    return {
      alert_danger: false,
      summitted: false,
      message: String,
      recharge: new Recharge("", "", "")
    };
  },
  methods: {
    rechargeWallet() {
      this.summitted = true;
      this.$v.recharge.$touch();
      if (this.$v.recharge.$invalid) {
        return false;
      } else {
        progressbar.$Progress.start();
        this.alert_danger = false;
        this.$store
        .dispatch("rechargeWallet",this.recharge)
        .then(res => {
          progressbar.$Progress.finish();
          if (res.data.status == "success") {
            this.$refs.removeModal.click();
            this.recharge = new Recharge();
            this.summitted = false;
            swal(
              res.data.message,
              "Thank you for completing the recharge of the wallet...",
              "success"
            );
          } else if (res.data.status == "err" && res.data.message == "Your session has expired") {
            this.$store.dispatch("logout");
            this.$router.push('/home');
            swal(
              'Oops...',
              res.data.message + '...',
              "error"
            );
          } else {
            this.message = res.data.message;
            this.alert_danger = true;
            setTimeout(() => {
              this.alert_danger = false;
            }, 10000);
            this.recharge = new Recharge();
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
          this.recharge = new Recharge();
          this.summitted = false;
        });
      }
    }
  }
};
</script>

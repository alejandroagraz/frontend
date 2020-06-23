<template>
  <div>
    <Header location="payment"/>
    <Slider
      title="Our new website gives you easy access so you can make inquiries,
             payments and top-ups, all in less than a minute."
      actionPayment="true"
    />

   <div class="center">
      <section id="content">
        <h1 class="subheader text-center">MAKE PAYMENT</h1>

        <form class="mid-form" @submit.prevent="paymentCreate">
          <div v-if="(alert_danger_payment)" class="alert alert-danger" role="alert">{{message}}</div>

          <div class="form-group">
            <input type="text" v-model="payment.dni" class="form-control" placeholder="Insert DNI" />
            <div class="error" v-if="summitted && !$v.payment.dni.required">This field is required</div>
            <div
                class="error"
                v-else-if="(summitted && !$v.payment.dni.numeric) || (summitted && !$v.payment.dni.minLength)"
              >DNI must be numeric min 5</div>
              <div
                class="error"
                v-else-if="summitted && !$v.payment.dni.maxLength"
              >DNI must be numeric max 15</div>
          </div>

          <div class="form-group">
            <input
              type="text"
              v-model="payment.phone"
              class="form-control"
              placeholder="Insert Number Phone"
            />
            <div class="error" v-if="summitted && !$v.payment.phone.required">This field is required</div>
            <div
                class="error"
                v-else-if="(summitted && !$v.payment.phone.phone) || !$v.payment.phone.maxLength"
              >Example format +57 (123) 456-7890</div>
          </div>

          <div class="form-group">
            <input
              type="text"
              v-model="payment.amount_payable"
              class="form-control"
              placeholder="Amount Payable"
            />

            <div
              class="error"
              v-if="(summitted && !$v.payment.amount_payable.numeric) || (summitted && !$v.payment.amount_payable.required)"
            >Amount payable This field is required and must be numeric</div>
          </div>

          <button type="submit" class="col-sm btn btn-success">Payment</button>
        </form>

        <button
          class="d-none"
          data-toggle="modal"
          data-target="#exampleModal"
          data-whatever="@mdo"
          ref="activateModal"
        ></button>

        <div
          class="modal fade"
          data-backdrop="static"
          id="exampleModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Validate Token</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="confirmOrder">
                  <div v-if="(alert_success)" class="alert alert-success" role="alert">{{message}}</div>
                  <div v-if="(alert_danger_confirm)" class="alert alert-danger" role="alert">{{message}}</div>
                  <div class="form-group">
                    <input
                      type="text"
                      v-model="confirmPayment.token_email"
                      class="form-control"
                      placeholder="Insert Token"
                    />
                    <div class="error" v-if="summitted && !$v.confirmPayment.token_email.required">This field is required</div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="d-none"
                      data-dismiss="modal"
                      ref="removeModal"
                    >Close</button>
                    <button type="submit" class="col-sm btn btn-success">Validate Token</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
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
import Payment from "../models/Payment";
import ConfirmPayment from "../models/ConfirmPayment";
import axios from "axios";
import progressbar from '../main';
import Global from "../Global";
import swal from "sweetalert";
import { required, numeric, minLength, maxLength, helpers } from "vuelidate/lib/validators";

const phone = helpers.regex("phone", /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/);


export default {
  name: "PaymentComponent",
  components: {
    Slider,
    RechargeWallet,
    CheckBalance,
    Header,
    Footer
  },
  validations: {
    payment: {
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
      amount_payable: {
        required,
        numeric
      }
    },
    confirmPayment: {
      token_email: {
        required
      }
    }
  },
  data() {
    return {
      alert_success: false,
      alert_danger_payment: false,
      alert_danger_confirm: false,
      message: String,
      summitted: false,
      payment: new Payment("", "", ""),
      confirmPayment: new ConfirmPayment("", "", "", "")
    };
  },
  methods: {
    paymentCreate() {
      this.summitted = true;
      this.$v.payment.$touch();
      if (this.$v.payment.$invalid) {
        return false;
      } else {
        progressbar.$Progress.start();
        this.alert_danger_payment = false;
        this.$store
        .dispatch("payment",this.payment)
        .then(res => {
          progressbar.$Progress.finish();
          if (res.data.status == "success") {
            this.alert_success = true;
            this.confirmPayment.id = res.data.resp.id;
            this.confirmPayment.session_id = res.data.resp.session_id;
            this.confirmPayment.amount_payable = res.data.resp.amount_payable;
            this.message = res.data.message;
            setTimeout(() => {
              this.alert_success = false;
            }, 10000);
            this.$refs.activateModal.click();
            this.summitted = false;
          } else if (res.data.status == "err" && res.data.message == "Your session has expired") {
            this.$store.dispatch("logout");
            this.$router.push('/home');
            swal(
              'Oops...',
              res.data.message + '...',
              "error"
            );
          } else if (res.data.status == "err") {
            this.message = res.data.message;
            this.alert_danger_payment = true;
            setTimeout(() => {
              this.alert_danger_payment = false;
            }, 10000);
            this.payment = new Payment();
            this.summitted = false;
          }
        })
        .catch(err => {  
          progressbar.$Progress.fail();
          this.message =
            "Sorry An unexpected Error Cccurred Try Again";
          this.alert_danger = true;
          setTimeout(() => {
            this.alert_danger = false;
          }, 10000);
          this.payment = new Payment();
          this.summitted = false;
        }); 
      }
    },
    confirmOrder() {
      this.$v.confirmPayment.$touch();
      if (this.$v.confirmPayment.$invalid) {
        return false;
      } else {
        progressbar.$Progress.start();
        this.alert_danger = false;
        this.alert_danger_confirm = false;
        this.$store
        .dispatch("confirmPayment",this.confirmPayment)
        .then(res => {
          progressbar.$Progress.finish();
          if (res.data.status == "success") {
            this.$refs.removeModal.click();
            swal(
                res.data.message,
                "Thank you for completing your payment...",
                "success"
              );
            this.payment = new Payment();
            this.confirmPayment = new ConfirmPayment();
            this.summitted = false;
          } else if (res.data.status == "err" && res.data.message == "Your session has expired") {
            this.$store.dispatch("logout");
            this.$router.push('/home');
            swal(
              'Oops...',
              res.data.message + '...',
              "error"
            );
          } else if (res.data.status == "err") {
            this.message = res.data.message;
            this.alert_success = false;
            this.alert_danger_confirm = true;
            this.confirmPayment.token_email = "";
            setTimeout(() => {
              this.alert_danger_confirm = false;
            }, 10000);
            this.payment = new Payment();
            this.summitted = false;
          }
        })
        .catch(err => {
          progressbar.$Progress.fail(); 
          this.message =
            "Sorry An unexpected Error Ocurred Try Again";
          this.alert_danger_confirm = true;
          setTimeout(() => {
            this.alert_danger_confirm = false;
          }, 10000);
          this.payment = new Payment();
          this.confirmPayment = new ConfirmPayment();
          this.summitted = false;
          
        });
      }
    }
  }
};
</script>
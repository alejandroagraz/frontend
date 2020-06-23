import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Global from "../Global";
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null
  },
  getters: {
    loggedIn(state) {
      return state.token !== null
    }
  },
  mutations: {
    login(state, token) {
      state.token = token
    },
    logout(state) {
      state.token = null
    }
  },
  actions: {
    login(context, credentials) {
      return new Promise((resolve, reject) => {
        axios.post(Global.url + 'login',
          credentials
        )
        .then(response => {
          if(response.data.status == "success"){
            const token = response.data.token
            localStorage.setItem('token', token)
            context.commit('login', token)
            resolve(response)
          } else{
            resolve(response)
          }   
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    payment(context, credentials) {
      if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
          axios.post(Global.url + 'payment', credentials,
            {
              headers: { Authorization: "Bearer " + context.state.token }
            }
          )
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
        })
      }
    },
    confirmPayment(context, credentials) {
      if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
          axios.post(Global.url + 'confirm-payment', credentials,
            {
              headers: { Authorization: "Bearer " + context.state.token }
            }
          )
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
        })

      }
    },
    rechargeWallet(context, credentials) {
      if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
          axios.put(Global.url + 'recharge-wallet', credentials,
            {
              headers: { Authorization: "Bearer " + context.state.token }
            }
          )
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
        })

      }
    },
    checkBalance(context, credentials) {
      if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
          axios.get(Global.url + 'check-balance/'+credentials,
            {
              headers: { Authorization: "Bearer " + context.state.token }
            }
          )
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
        })
      }
    },
    logout(context) {
      if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
          axios.post(Global.url + 'logout', '', {
            headers: { Authorization: "Bearer " + context.state.token }
          })
          .then(response => {
            localStorage.removeItem('token')
            context.commit('logout')
            resolve(response)
          })
          .catch(error => {
            localStorage.removeItem('token')
            context.commit('logout')
            reject(error)
          })
        })
      }
    }
  }
})

export default store;
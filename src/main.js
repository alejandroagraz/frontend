import Vue from 'vue';
import router from './router';
import Vuelidate from 'vuelidate';
import VueProgressBar from 'vue-progressbar'
import App from './App.vue';
import store from './store';

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.loggedIn) {
      next({
        name: 'home',
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

const options = {
  color: '#007bff',
  failedColor: '#874b4b',
  thickness: '8px',
  transition: {
    speed: '1.5s',
    opacity: '0.6s',
    termination: 400
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(Vuelidate); 
Vue.use(VueProgressBar, options);

export default new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

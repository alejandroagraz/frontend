import Vue from 'vue';
import router from './router';
import Vuelidate from 'vuelidate';
import VueProgressBar from 'vue-progressbar'
import App from './App.vue';

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
  render: h => h(App),
}).$mount('#app')

import Vue from 'vue'
import Router from 'vue-router'
import RegisterCustomerComponent from '../components/RegisterCustomerComponent'
import PaymentComponent from '../components/PaymentComponent'
import ErrorComponent from '../components/common/ErrorComponent'
import LoginComponent from '../components/LoginComponent'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/', redirect: '/home',
      component: RegisterCustomerComponent,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent,
      meta: {
        progress: {
          func: [
            {call: 'color', modifier: 'temp', argument: '#054708'},
            {call: 'fail', modifier: 'temp', argument: '#874b4b'},
            {call: 'location', modifier: 'temp', argument: 'top'},
            {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
          ]
        }
      }
    },
    {
      path: '/payment',
      name: 'payment',
      component: PaymentComponent,
      meta: {
        requiresAuth: true,
        progress: {
          func: [
            {call: 'color', modifier: 'temp', argument: '#054708'},
            {call: 'fail', modifier: 'temp', argument: '#874b4b'},
            {call: 'location', modifier: 'temp', argument: 'top'},
            {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
          ]
        }
      }
    },
    {
      path: '/home',
      name: 'home',
      component: RegisterCustomerComponent,
      meta: {
        progress: {
          func: [
            {call: 'color', modifier: 'temp', argument: '#054708'},
            {call: 'fail', modifier: 'temp', argument: '#874b4b'},
            {call: 'location', modifier: 'temp', argument: 'top'},
            {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
          ]
        }
      }
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorComponent,
      meta: {
        progress: {
          func: [
            {call: 'color', modifier: 'temp', argument: '#054708'},
            {call: 'fail', modifier: 'temp', argument: '#874b4b'},
            {call: 'location', modifier: 'temp', argument: 'top'},
            {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
          ]
        }
      }
    },
    { 
        path: '*', 
        redirect: '/error', 
    },
  ]
})
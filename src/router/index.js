import Vue from 'vue'
import Router from 'vue-router'
import Restaurant from '@/components/Restaurant'
import ListRst from '@/components/ListRst'
import Order from '@/components/Order'
import RstOrder from '@/components/RstOrder'
import Foods from '@/components/Foods'
import Info from '@/components/Info'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/restaurant/:id',
    name: 'Restaurant',
    component: Restaurant
  }, {
    path: '/',
    name: 'ListRst',
    component: ListRst
  }, {
    path: '/order',
    name: 'Order',
    component: Order
  }, {
    path: '/rstOrder',
    name: 'rstOrder',
    component: RstOrder
  }, {
    path: '/foods',
    name: 'Foods',
    component: Foods
  }, {
    path: '/info',
    name: 'Info',
    component: Info
  }]
})

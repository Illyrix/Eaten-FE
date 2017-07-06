<template>
  <div class="content">
    <div class="header">未处理订单</div>
    <order-table :orders.sync="orderData.new" :type="0"></order-table>
    <div class="header">已接受订单</div>
    <order-table :orders.sync="orderData.accepted" :type="2"></order-table>
    <div class="header">已拒绝订单</div>
    <order-table :orders.sync="orderData.rejected" :type="3"></order-table>
    <div class="header">已取消订单</div>
    <order-table :orders.sync="orderData.canceled" :type="1"></order-table>
    <div class="header">未评价订单</div>
    <order-table :orders.sync="orderData.uncommented" :type="4"></order-table>
    <div class="header">已评价订单</div>
    <order-table :orders.sync="orderData.completed" :type="5"></order-table>
  </div>
</template>

<script>
import Auth from './Auth'
import OrderTable from './OrderTable'
const bus = Auth.bus
let orderData = {
  new: [],
  canceled: [],
  rejected: [],
  accepted: [],
  uncommented: [],
  completed: []
}

const getData = (that) => {
  that.$http.get('http://localhost/MeiBaiE/RestaurantApi/listOrders', {
    credentials: true
  }).then(res => {
    if (res.body.status !== undefined || res.body.status === false) {
      that.$message({
        message: '请求异常',
        type: 'error',
        duration: 1500
      })
      for (let i in orderData) {
        while (orderData[i].pop()) {}
      }
      return
    } else {
      for (let i in orderData) {
        while (orderData[i].pop()) {}
      }
      for (let i in res.body) {
        for (let k in res.body[i]) {
          orderData[i].push({
            orderId: parseInt(res.body[i][k].order_id),
            uName: res.body[i][k].u_name,
            telephone: res.body[i][k].telephone,
            address: res.body[i][k].address,
            time: res.body[i][k].time,
            totalPrice: res.body[i][k].total_price,
            postscript: res.body[i][k].postscript,
            comment: res.body[i][k].comment,
            dishes: res.body[i][k].dishes,
            status: parseInt(res.body[i][k].status)
          })
        }
      }
    }
  })
}

bus.$on('logout', () => {
  for (let i in orderData) {
    while (orderData[i].pop()) {}
  }
})

bus.$on('rstLogin', that => {
  getData(that)
})

bus.$on('rstOrderUpdate', (target, data) => {
  orderData[target].push(data[0])
})

export default {
  mounted () {
    const that = this
    // after a duration to set interval
    window.setTimeout(() => {
      window.setInterval(() => {
        that.$http.get('http://localhost/MeiBaiE/RestaurantApi/checkNewOrders', {
          credentials: true
        }).then(res => {
          if (res.body.status !== undefined && res.body.status === false) {
            return
          }
          if (res.body.length > 0) {
            that.$message({
              message: '有新的未处理订单',
              type: 'warning',
              duration: 10000,
              showClose: true
            })
            for (let i in res.body) {
              orderData.new.unshift({
                orderId: parseInt(res.body[i].order_id),
                uName: res.body[i].u_name,
                telephone: res.body[i].telephone,
                address: res.body[i].address,
                time: res.body[i].time,
                totalPrice: res.body[i].total_price,
                postscript: res.body[i].postscript,
                comment: res.body[i].comment,
                dishes: res.body[i].dishes,
                status: parseInt(res.body[i].status)
              })
            }
          }
        })
      }, 1000)
    }, 500)
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$store.state.isLogin === true && vm.$store.state.user.type === 1) {
        getData(vm)
      }
    })
  },
  name: 'rstOrder',
  components: { OrderTable },
  data () {
    return {
      orderData
    }
  }
}
</script>

<style scoped>
  .content{
    width: 980px;
    margin: auto;
    padding-top: 50px;
  }
  .header {
    text-align: center;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
    background: #FFF;
    border-top: solid 1px #DDD;
    border-left: solid 1px #DDD;
    border-right: solid 1px #DDD;
  }
</style>

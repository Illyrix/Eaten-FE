<template>
  <el-table :data.sync="orders" :type="type" stripe style="width: 100%">
    <el-table-column type="expand">
      <template scope="props">
        <el-form label-position="left" inline class="order-table-expand">
          <el-form-item label="用户电话">
            <span>{{ props.row.telephone }}</span>
          </el-form-item>
          <el-form-item label="地址">
            <span>{{ props.row.address }}</span>
          </el-form-item>
          <el-form-item label="备注">
            <span>{{ props.row.postscript }}</span>
          </el-form-item>
          <el-form-item label="评价" v-if="props.row.status == 5">
            <span>{{ props.row.comment }}</span>
          </el-form-item>
          <el-form-item label="状态">
            <span>{{ transform(props.row.status) }}</span>
          </el-form-item>
          <el-form-item label="操作" v-if="props.row.status in {0: null, 2:null}">
            <el-button type="warning" v-if="props.row.status == 0" size="mini" @click="rejectOrder(props.row.orderId)">拒绝订单</el-button>
            <el-button type="primary" v-if="props.row.status == 0" size="mini" @click="acceptOrder(props.row.orderId)">接受订单</el-button>
            <el-button type="primary" v-if="props.row.status == 2" size="mini" @click="completeOrder(props.row.orderId)">订单完成</el-button>
          </el-form-item>
          <el-form-item label="菜品">
            <p v-for="dish in props.row.dishes">{{ dish.name }}×{{ dish.amount }}</p>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column label="订单ID" prop="orderId"></el-table-column>
    <el-table-column label="用户姓名" prop="uName"></el-table-column>
    <el-table-column label="总价" prop="totalPrice"></el-table-column>
    <el-table-column label="下单时间" prop="time"></el-table-column>
  </el-table>
</template>

<script>
// reuse bus
import { bus } from './Auth'

export default {
  name: 'orderTable',
  props: [ 'orders', 'type' ],
  methods: {
    formatter: f => parseFloat(f).toFixed(2),
    transform: s => {
      switch (s) {
        case 0:
          return '商家待接单'
        case 1:
          return '订单已取消'
        case 2:
          return '商家已接单'
        case 3:
          return '商家拒绝订单'
        case 4:
          return '订单待评价'
        case 5:
          return '订单已完成'
      }
    },
    rejectOrder (id) {
      this.$http.post('http://localhost/MeiBaiE/RestaurantApi/rejectOrder', {
        id
      }, {
        emulateJSON: true,
        credentials: true
      }).then(res => {
        if (res.body.status !== true) {
          this.$message({
            message: '拒绝订单失败',
            type: 'error',
            duration: 1500
          })
        } else {
          this.$message({
            message: '拒绝订单成功',
            type: 'success',
            duration: 1500
          })
          for (let i in this.orders) {
            if (this.orders[i]['orderId'] === id) {
              this.orders[i]['status'] = 3
              let data = this.orders.splice(i, 1)
              bus.$emit('rstOrderUpdate', 'rejected', data)
              break
            }
          }
        }
      })
    },
    acceptOrder (id) {
      this.$http.post('http://localhost/MeiBaiE/RestaurantApi/acceptOrder', {
        id
      }, {
        emulateJSON: true,
        credentials: true
      }).then(res => {
        if (res.body.status !== true) {
          this.$message({
            message: '接受订单失败',
            type: 'error',
            duration: 1500
          })
        } else {
          this.$message({
            message: '接受订单成功',
            type: 'success',
            duration: 1500
          })
          for (let i in this.orders) {
            if (this.orders[i]['orderId'] === id) {
              this.orders[i]['status'] = 2
              let data = this.orders.splice(i, 1)
              bus.$emit('rstOrderUpdate', 'accepted', data)
              break
            }
          }
        }
      })
    },
    completeOrder (id) {
      this.$http.post('http://localhost/MeiBaiE/RestaurantApi/completeOrder', {
        id
      }, {
        emulateJSON: true,
        credentials: true
      }).then(res => {
        if (res.body.status !== true) {
          this.$message({
            message: '完成订单失败',
            type: 'error',
            duration: 1500
          })
        } else {
          this.$message({
            message: '完成订单成功',
            type: 'success',
            duration: 1500
          })
          for (let i in this.orders) {
            if (this.orders[i]['orderId'] === id) {
              this.orders[i]['status'] = 4
              let data = this.orders.splice(i, 1)
              bus.$emit('rstOrderUpdate', 'uncommented', data)
              break
            }
          }
        }
      })
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped>

  .order-table-expand {
    font-size: 0;
  }
  .order-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .order-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

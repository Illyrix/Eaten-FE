<template>
  <div class="content">
    <el-table :data="orderData" stripe style="width: 100%">
    <el-table-column type="expand">
      <template scope="props">
        <el-form label-position="left" inline class="order-table-expand">
          <el-form-item label="商家电话">
            <span>{{ props.row.rstTelephone }}</span>
          </el-form-item>
          <el-form-item label="地址">
            <span>{{ props.row.address }}</span>
          </el-form-item>
          <el-form-item label="收货电话">
            <span>{{ props.row.telephone }}</span>
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
          <el-form-item label="操作" v-if="props.row.status in {0: null, 4:null}">
            <el-button type="warning" v-if="props.row.status == 0" size="mini" @click="cancelOrder(props.row.id)">取消订单</el-button>
            <span v-if="props.row.status == 4">
              <el-input v-model="input" placeholder="评价本次订单" size="small" icon="edit" :on-icon-click="function(){submitComment(props.row.id)}"></el-input>
            </span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column label="订单ID" prop="id"></el-table-column>
    <el-table-column label="餐馆名称" prop="rstName"></el-table-column>
    <el-table-column label="总价" prop="price"></el-table-column>
    <el-table-column label="下单时间" prop="time"></el-table-column>
  </el-table>
  </div>
</template>

<script>
import Auth from './Auth'
const bus = Auth.bus
let orderData = []

const getData = (that) => {
  that.$http.get('http://localhost/MeiBaiE/UserApi/listOrders', {
    credentials: true
  }).then(res => {
    if (res.body.status !== undefined || res.body.status === false) {
      that.$message({
        message: '请求异常',
        type: 'error',
        duration: 1500
      })
      while (orderData.pop()) {}
      return
    } else {
      while (orderData.pop()) {}
      for (let k in res.body) {
        let i = res.body[k]
        orderData.push({
          id: parseInt(i.id),
          rstName: i.name,
          price: parseFloat(i.price),
          time: i.time,
          rstTelephone: parseInt(i.rst_tel),
          address: i.address,
          telephone: parseInt(i.telephone),
          postscript: i.postscript,
          comment: i.comment,
          status: parseInt(i.status)
        })
      }
    }
  })
}

bus.$on('logout', () => {
  while (orderData.pop()) {}
})

bus.$on('userLogin', that => {
  if (that.$store.state.isLogin === true && that.$store.state.user.type === 0) {
    getData(that)
  }
})

export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$store.state.isLogin === true && vm.$store.state.user.type === 0) {
        getData(vm)
      }
    })
  },
  name: 'order',
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
    submitComment: function (id) {
      this.$http.post('http://localhost/MeiBaiE/UserApi/commentOrder', {
        id,
        comment: this.input
      }, {
        emulateJSON: true,
        credentials: true
      }).then(res => {
        if (res.body.status !== true) {
          this.$message({
            message: '评论失败',
            duration: 1500,
            type: 'error'
          })
        } else {
          for (let i in this.orderData) {
            if (this.orderData[i]['id'] === id) {
              this.orderData[i].comment = this.input
              this.orderData[i].status = 5
            }
          }
          this.$message({
            message: '评论成功',
            duration: 1500,
            type: 'success'
          })
        }
      })
    },
    cancelOrder: function (id) {
      this.$http.post('http://localhost/MeiBaiE/UserApi/cancelOrder', {
        id
      }, {
        emulateJSON: true,
        credentials: true
      }).then(res => {
        if (res.body.status !== true) {
          this.$message({
            message: '取消失败',
            type: 'error',
            duration: 1500
          })
        } else {
          this.$message({
            message: '取消成功',
            type: 'success',
            duration: 1500
          })
          for (let i in orderData) {
            if (orderData[i]['id'] === id) {
              orderData[i]['status'] = 1
            }
          }
        }
      })
    }
  },
  data () {
    return {
      orderData,
      input: ''
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

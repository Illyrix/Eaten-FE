<template>
  <div class="cart">
    <div class="total">总计 <span>￥{{ formatter(total) }}</span></div>
    <div class="items">
      <div v-show="items.length == 0" class="no-items">购物车里什么都没有</div>
      <div class="item" v-for="(item, key) in items">
        <span class="item-name" >{{ item.name }}</span>
        <span class="item-amount">
          <a class="item-remove hover" @click="removeFood(item.id)"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>
          <span class="item-number">{{ item.amount }}</span>
          <a class="item-add hover" @click="addSameFood(item.id)"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>
          <span class="item-price">{{ formatter(item.price) }}</span>
        </span>
      </div>
    </div>
    <div class="cart-form">
      <el-form :model="form">
        <el-form-item label="取餐电话" :label-width="formLabelWidth">
          <el-input v-model="form.telephone" auto-complete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="送餐地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" auto-complete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="备注(选填)" :label-width="formLabelWidth">
          <el-input v-model="form.postscript" auto-complete="off" size="mini"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="operate">
      <span class="checkout hover" @click="checkout">去结算</span>
      <span class="clear hover" @click="clearCart">清空</span>
    </div>
  </div>
</template>

<style scoped>
.cart {
  width: 300px;
  position: fixed;
  bottom: 80px;
  right: 100px;
  background: #FFF;
  user-select: none;
}
.total {
  padding-left: 40px;
  padding-right: 40px;
  font-size: 16px;
  border-bottom: solid #EFEFEF 1px;
  text-align: center;
  line-height: 48px;
  height: 48px;
}
.no-items {
  margin-top: 20px;
  margin-bottom: 20px;
  line-height: 30px;
  height: 30px;
  text-align: center;
  font-size: 16px;
}
.total>span {
  color: #FC132b;
  font-size: 20px;
  padding-left: 10px;
}
.items {
  padding-left: 40px;
  padding-right: 40px;
  font-size: 14px;
}
.item {
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: #EFEFEF 1px solid;
}
.item-amount {
  float: right;
}
.item-number {
  margin-right: 10px;
}
.item-remove {
  color: #ff8100;
  margin-right: 10px;
}
.item-add {
  color: #ff8100;
  margin-right: 10px;
}

.cart-form {
  margin-right: 40px;
  margin-left: 40px;
}
.cart-form .el-form-item {
  margin-bottom: 5px!important;
  margin-top: 5px!important;
}

.operate{
  height: 40px;
  background: #777;
  width: 100%;
}
.operate>span {
  font-size: 16px;
  float: left;
  width: 50%;
  height: 100%;
  line-height: 40px;
  text-align: center;
  color: #FFF;
}

.checkout {
  background: #18ca4f;
}
.clear {
  background: #f13b65;
}
.hover {
  cursor: pointer;
}
</style>

<script>
import { bus } from './Auth'
let form = {
  formLabelWidth: '80px',
  form: {
    telephone: '',
    address: '',
    postscript: ''
  }
}
export default {
  name: 'cart',
  methods: {
    clearCart () {
      this.$store.commit('clearCart')
    },
    createOrder () {
      this.$store.commit('clearCart')
    },
    checkout () {
      if (this.$store.state.isLogin === false) {
        this.$message({
          message: '提交失败, 请先登录',
          duration: 1500,
          type: 'error',
          onClose () {
            bus.$emit('open', 0, 0)
          }
        })
        return
      }
      if (this.$store.state.cart.length === 0 || form.form.address.length === 0 || form.form.telephone.length === 0) {
        this.$message({
          message: '购物车或必填字段为空',
          duration: 1500,
          type: 'error'
        })
        return
      }
      const rstId = this.$store.state.rstId
      let dishes = {}
      this.$store.state.cart.forEach(i => {
        dishes[i.id] = i.amount
      })
      this.$http.post('http://localhost/MeiBaiE/UserApi/createOrder', {
        telephone: form.form.telephone,
        address: form.form.address,
        rst_id: rstId,
        postscript: form.form.postscript,
        dishes
      }, {
        emulateJSON: true,
        credentials: true
      }).then(res => {
        if (res.body.status === false) {
          this.$message({
            message: '生成订单出错',
            duration: 1500,
            type: 'error'
          })
          return
        } else {
          this.$message({
            message: '生成订单成功',
            duration: 1500,
            type: 'success'
          })
          this.$store.commit('clearCart')
          form.form.address = ''
          form.form.postscript = ''
          form.form.telephone = ''
        }
      })
    },
    removeFood (id) {
      this.$store.commit('removeCart', parseInt(id))
    },
    addSameFood (id) {
      this.$store.commit('addCart', {id: parseInt(id)})
    },
    formatter: f => parseFloat(f).toFixed(2)
  },
  computed: {
    total () {
      return this.$store.getters.totalPrice
    },
    items () {
      return this.$store.state.cart
    }
  },
  data () {
    return form
  }
}
</script>

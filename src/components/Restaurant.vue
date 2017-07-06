<template>
  <div class="content">
    <div class="rst-field">
        <img v-bind:src="rstImg" alt="" class="li-rst-img" ondragstart="return false;">
        <div>
            <div class="li-rst-name">{{ rstName }}</div>
            <div class="li-rst-phone"><i class="fa fa-phone" aria-hidden="true"></i>&nbsp;{{ rstPhone }}</div>
            <div class="li-rst-time"><i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp;营业时间
                <span class="li-rst-opentime">{{ convertTime(rstOpenTime) }}</span> -
                <span class="li-rst-closetime">{{ convertTime(rstCloseTime) }}</span>
            </div>
            <div class="li-rst-address"><i class="fa fa-map-marker" aria-hidden="true"></i> {{ rstAddress }}</div>
                </div>
            </div>
  <div class="rst-wrap"></div>
  <div class="food-field">
      <div class="no-foods" v-show="foods.length == 0">此餐厅暂无菜品上架</div>
      <div class="product food ct-product" v-for="food in foods">
          <img v-bind:src="food.img" alt="" ondragstart="return false;">
          <p class="food-name ct-product-title">{{ food.name }}</p>
          <p class="food-price"><del v-if="isDiscount(food.discount)">￥{{ formatter(food.originPrice) }}</del><span class="new-price ct-product-price">￥{{ formatter(getNewPrice(food.originPrice, food.discount)) }}</span></p>
          <p class="food-discount" v-if="isDiscount(food.discount)">{{ Math.floor(food.discount * 100) }}折</p>
          <p class="food-discount" v-if="!isDiscount(food.discount)">&nbsp;</p>
          <p class="ct-product-button add-cart"><i class="fa fa-cart-plus" aria-hidden="true" @click="addCart(food.id, getNewPrice(food.originPrice, food.discount), food.name)"></i></p>
      </div>
  </div>
  <cart></cart>
  </div>
</template>

<script>
import Cart from './Cart'
export default {
  components: { Cart },
  name: 'restaurant',
  methods: {
    convertTime: t => Math.floor(t / 60) + ':' + t % 60,
    isDiscount: d => Math.ceil(d * 100) !== 100,
    getNewPrice: (p, d) => parseFloat(p) * parseFloat(d),
    formatter: f => parseFloat(f).toFixed(2),
    addCart: function (id, price, name) {
      this.$store.commit('addCart', {id, price, name})
    }
  },
  data () {
    const id = parseInt(this.$route.params.id)

    let data = {
      rstImg: '',
      rstName: '',
      rstPhone: 0,
      rstOpenTime: 0,      // 12 * 60 + 30 ------>  12:30
      rstCloseTime: 0,
      rstAddress: '',
      foods: []
    }

    this.$store.commit('setRst', id)

    this.$http.post('http://localhost/MeiBaiE/UserApi/getRstInfo', {
      id
    }, {
      emulateJSON: true,
      credentials: true
    }).then(res => {
      data.rstImg = res.body.picture
      data.rstName = res.body.name
      data.rstPhone = res.body.telephone
      data.rstOpenTime = res.body.open_time
      data.rstCloseTime = res.body.close_time
      data.rstAddress = res.body.address
      this.$http.post('http://localhost/MeiBaiE/UserApi/listDishes', {
        rst_id: id
      }, {
        emulateJSON: true,
        credentials: true
      }).then(res => {
        while (data.foods.pop()) {}
        for (let i in res.body) {
          data.foods.push({
            id: parseInt(res.body[i].id),
            name: res.body[i].name,
            originPrice: parseFloat(res.body[i].price),
            discount: parseFloat(res.body[i].discount),
            img: res.body[i].picture
          })
        }
      })
    })
    return data
  }
}
</script>

<style scoped>
.content {
    width: 980px;
    margin: 20px auto;
    background: #FFF;
    padding: 32px 0;
}

.no-foods {
    text-align: center;
    font-size: 16px;
}

.product {
    width: 222px;
    display: inline-block;
    margin: 0 10px 0 10px;
}

.product img {
    width: 200px;
    height: 150px;
    display: block;
    margin: 32px auto 10px auto;
}

.product p {
    margin-left: 22px;
    margin-top: 14px;
}

.product:hover {
    background: #EFEFEF;
    cursor: pointer;
}

.rst-field {
    margin: 20px 0 40px 120px;
    /*float: left;*/
    height: 180px;
    width: 980px;
}

.rst-field>img {
    display: block;
    height: 156px;
    width: 230px;
    float: left;
}

.rst-field>div {
    display: block;
    float: left;
    clear: right;
    margin-left: 50px;
    margin-top: 20px;
    font-size: 16px;
    color: #333;
}

.rst-field>div>div {
    margin-top: 6px;
}

.li-rst-name {
    font-weight: bold;
    margin-bottom: 6px;
    font-size: 18px;
}

.li-rst-phone {
    margin-top: 8px;
    font-size: 14px;
}

.li-rst-address {
    font-size: 14px;
}

.li-rst-time {
    font-size: 14px;
}

.rst-wrap {
    background: #EFEFEF;
    height: 20px;
    width: 100%;
}

.food-field {
    background: #FFF;
    padding-top: 30px;
}

.food-price {
    color: #ff5a5a;
    font-size: 14px;
    font-weight: bold;
}

.add-cart {
    text-align: right;
    line-height: 24px;
    height: 24px;
    font-size: 24px;
    color: #fbcd44;
    margin-right: 10px;
    margin-bottom: 10px;
}
</style>


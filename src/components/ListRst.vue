<template>
  <div class="wrap">
    <div class="content">
        <div class="product" v-for="(product, key) in products">
          <router-link :to="'/restaurant/'+product.id">
            <img v-bind:src="product.picture" alt="" ondragstart="return false;">
            <p class="rst-name">{{ product.name }}</p>
            <p class="rst-address"><i class="fa fa-map-marker" aria-hidden="true"></i> {{ product.address }} </p>
          </router-link>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list-rst',
  data () {
    let products = []
    this.$http.get('http://localhost/MeiBaiE/UserApi/listRestaurants', {
      credentials: true
    }).then(res => {
      for (let i in res.body) {
        products.push(res.body[i])
      }
    })
    return {
      products
    }
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

.product {
    width: 222px;
    display: inline-block;
    margin: 0 10px 0 10px;
    padding-bottom: 20px;
}

.separate {
    display: block;
    width: 900px;
    height: 1px;
    background: #DDD;
    margin: 32px auto;
}

.product img {
    width: 200px;
    height: 150px;
    display: block;
    margin: 32px auto 10px auto;
}

.product p {
    margin-left: 20px;
}

.position {
  font-size: 8px;
  line-height: 8px; 
  margin-right: 8px;
}

.product:hover {
    background: #EFEFEF;
    cursor: pointer;
}

.rst-name {
    color: #313131;
    font-size: 16px;
}

.rst-address {
    font-size: 12px;
    color: #999;
}
</style>

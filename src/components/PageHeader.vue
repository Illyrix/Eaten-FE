<template>
  <div class="header">
    <navigator></navigator>
    <!-- normal user-->
        <div class="middle-nav" v-if="!loginType">
          <div class="middle-nav-wrap">
            <span class="logo"><img :src="logoSrc"></span>
            <span class="selection">
              <router-link to="/"><span class="home selection-a">首页</span></router-link>
              <router-link to="/order"><span class="order selection-a">我的订单</span></router-link>
              <span class="reg-rst selection-a" v-if="!$store.state.isLogin" @click="bus.$emit('open', 1, 1)">入驻加盟</span>
              <span class="search-box-wrap">
            <el-input 
              placeholder="搜索商家或菜品"
              icon="search"
              v-model="search" disabled
              :on-icon-click="()=>{}">
            </el-input>
              </span>
            </span>
        </div>
    </div>
    <!-- restaurant user -->
    <div class="middle-nav" v-if="loginType">
          <div class="middle-nav-wrap">
            <span class="logo">MeiBaiE</span>
            <span class="selection">
              <router-link to="/rstOrder"><span class="home selection-a">所有订单</span></router-link>
              <router-link to="/foods"><span class="order selection-a">菜品信息</span></router-link>
            </span>
        </div>
    </div>
    </div>
</template>

<script>
import Auth from './Auth'
import Navigator from './Navigator'
import logoSrc from '../assets/logo.png'
export default {
  name: 'page-header',
  components: { Navigator },
  computed: {
    loginType () {
      return this.$store.state.isLogin && this.$store.state.user.type
    }
  },
  data () {
    return {
      search: '',
      bus: Auth.bus,
      logoSrc
    }
  }
}
</script>

<style scoped>
.router-link-active {
    text-decoration: none!important;
    color: inherit!important;
}

.header {
    height: 112px;
    line-height: 112px;
    color: #999;
    margin: 0 auto;
    width: 100%;
}

.middle-nav {
    background: #FFF;
    color: #454545;
    font-size: 16px;
    height: 80px;
}

.middle-nav-wrap {
    width: 980px;
    height: 100%;
    margin: 0 auto;
}

.logo {
    margin-left: 8px;
    height: 80px;
    line-height: 80px;
    float: left;
}
.logo>img {
    width: 80px;
    height: 80px;
}

.selection {
    margin-right: 8px;
    float: right;
    width: 700px;
    height: 80px;
    line-height: 80px;
    height: 100%;
}

.selection .selection-a {
    margin-right: 80px;
}

.selection-a:hover {
    cursor: pointer;
    color: #777;
}

.search-box-wrap {
    display: inline-block;
    float: right;
    width: 260px;
    height: 80px;
    line-height: 100%;
    padding-top: 22px;
}
</style>


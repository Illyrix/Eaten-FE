<template>
  <div class="top-nav">
      <div class="top-nav-wrap">
        <span class="address" id="address" v-if="isLogin">{{ user.location }}</span>
        <span class="address" id="address" v-if="!isLogin">请登录</span>

        <span class="login-control" v-if="!isLogin">  
          <a class="hover register" id="register" @click="bus.$emit('open', 0, 1)">注册</a> |
          <a class="hover login" id="login" @click="bus.$emit('open', 0, 0)">登录</a>
        </span>
        <span class="login-control" v-if="isLogin">  
          <router-link to="/info" class="register" id="register">{{ user.name }}</router-link> |
          <a class="hover login" id="logout" @click="logout()">登出</a>
        </span>

      </div>
  <auth></auth>
  </div>
</template>

<script>
import Auth from './Auth'
export default {
  name: 'navigator',
  components: { Auth },
  methods: {
    logout () {
      let url = (this.$store.state.user.type) ? 'http://localhost/MeiBaiE/RestaurantApi/logout' : 'http://localhost/MeiBaiE/UserApi/logout'
      this.$http.post(url, {}, {
        credentials: true
      }).then(res => {
        this.$store.commit('logout')
        Auth.bus.$emit('logout', this)
      })
    }
  },
  data () {
    return {
      bus: Auth.bus
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    isLogin () {
      return this.$store.state.isLogin
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top-nav {
    height: 32px;
    line-height: 32px;
    color: #DDD;
    background: #333;
}

#register:hover {
  text-decoration: underline;
}

.top-nav a {
    color: #DDD;
}

.top-nav-wrap {
    width: 980px;
    height: 100%;
    margin: 0 auto;
}

.address {
    margin-left: 16px;
    float: left;
}

.login-control {
    margin-right: 16px;
    float: right;
}

.register {
    margin-right: 8px;
}

.login {
    margin-left: 8px;
}
</style>

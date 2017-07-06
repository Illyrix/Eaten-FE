<template>
  <div class="footer">
    <div class="footer-wrap">
      <a class="hover reg-rst-footer" @click="bus.$emit('open', 1, 1)">商家注册</a>
      <a class="hover login-rst" @click="bus.$emit('open', 1, 0)">商家登录</a>
      <a href="" class="hover login-admin" style="visibility:hidden">管理员登录</a>
      <span class="contact"><a href="mailto:contactus@eaten.com">联系我们</a></span>
    </div>
    </div>
</template>

<script>
import Auth from './Auth'
export default {
  name: 'page-footer',
  components: { Auth },
  data () {
    return {
      bus: Auth.bus
    }
  }
}
</script>

<style scoped>
.footer {
    background: #FFF;
    height: 80px;
    margin-top: 40px;
}

.footer-wrap {
    width: 980px;
    margin: auto;
}

.footer a {
    color: #777;
    text-decoration: none;
    font-size: 14px;
    display: inline-block;
    width: 242px;
    text-align: center;
    margin-top: 25px;
}

.footer a:hover {
    text-decoration: underline;
    color: #AAA;
}
</style>

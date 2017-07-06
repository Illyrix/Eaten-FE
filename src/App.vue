<template>
  <div id="app">
    <page-header></page-header>
    <router-view></router-view>
    <page-footer></page-footer>
  </div>
</template>

<script>
import pageHeader from './components/PageHeader'
import pageFooter from './components/PageFooter'

import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

Vue.use(Vuex)
Vue.use(VueResource)

export default {
  name: 'app',
  components: { pageHeader, pageFooter }
}
</script>

<style src="./assets/css/minireset.css" lang="css"></style>
<style src="./assets/css/font-awesome.min.css" lang="css"></style>

<style>
img {
  user-select: none;
}

body {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 12px;
    background: #EFEFEF;
}

.content {
  min-height: calc(100vh - 232px);
}

a {
  text-decoration: none;
  color: inherit;
}

a.hover {
    text-decoration: none;
}

a.hover:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>

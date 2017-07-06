<template>
  <el-dialog :title="type?'注册':'登录'" :visible.sync="dialogFormVisible">
    <el-form :model="form">

      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="form.name" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="form.pwd" type="password" auto-complete="off"></el-input>
      </el-form-item>

      <!-- user register -->
      <el-form-item label="性别" v-if="type && !target" :label-width="formLabelWidth">
        <el-radio class="radio" v-model="form.gender" label="m">男</el-radio>
        <el-radio class="radio" v-model="form.gender" label="f">女</el-radio>
      </el-form-item>

      <el-form-item label="手机号" v-if="type && !target" :label-width="formLabelWidth">
        <el-input  :maxlength="13" :minlength="13" v-model="form.telephone" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="联系电话" v-if="type && target" :label-width="formLabelWidth">
        <el-input  :maxlength="13" :minlength="13" v-model="form.telephone" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="email" v-if="type && !target" :label-width="formLabelWidth">
        <el-input  v-model="form.email" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="所在城市" v-if="type" :label-width="formLabelWidth">
        <el-input  v-model="form.location" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="具体位置" v-if="type" :label-width="formLabelWidth">
        <el-input  v-model="form.address" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="营业时间" v-if="type && target" :label-width="formLabelWidth">
      <el-time-picker is-range v-model="form.time" placeholder="选择时间范围"></el-time-picker>
      </el-form-item>


    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
let startTime = new Date()
let endTime = new Date()
let form = {
  dialogFormVisible: false,
  form: {
    name: '',
    pwd: '',
    gender: 'm',
    telephone: '',
    email: '',
    location: '',
    address: '',
    time: [startTime, endTime]
  },
  target: 0,
  type: 0,
  formLabelWidth: '120px'
}

import Vue from 'vue'

let bus = new Vue()

// target 0: user; 1: restaurant
// type 0: login; 1: register
bus.$on('open', (target = 0, type = 0) => {
  form.target = target
  form.type = type
  form.dialogFormVisible = true
})
export default {
  mounted () {
    Vue.http.get('http://localhost/MeiBaiE/UserApi/getLogged', {
      credentials: true
    }).then(res => {
      if (res.body.status) {
        this.$store.commit('login', {
          type: res.body.type,
          name: res.body.name,
          location: res.body.location
        })
        if (this.$store.state.user.type) {
          bus.$emit('rstLogin', this)
        } else {
          bus.$emit('userLogin', this)
        }
      }
    })
  },
  methods: {
    submit () {
      form.dialogFormVisible = false
      // send request to server
      // login user
      if (!form.target && !form.type) {
        this.$http.post('http://localhost/MeiBaiE/UserApi/login', {
          name: form.form.name,
          password: form.form.pwd
        }, {
          emulateJSON: true,
          credentials: true
        }).then(res => {
          if (!res.body.status) {
            this.$message({
              message: '用户名或密码错误或请先登出',
              type: 'error',
              duration: 1500,
              onClose: () => {
                window.setTimeout(() => {
                  form.dialogFormVisible = true
                }, 500)
              }
            })
          } else {
            this.$message({
              message: '登陆成功',
              type: 'success',
              duration: 1500
            })
            this.$store.commit('login', {
              type: 0,
              name: res.body.userdata.name,
              location: res.body.userdata.location
            })
            bus.$emit('userLogin', this)
          }
        })
      }

      // login rst
      if (form.target && !form.type) {
        this.$http.post('http://localhost/MeiBaiE/RestaurantApi/login', {
          name: form.form.name,
          password: form.form.pwd
        }, {
          emulateJSON: true,
          credentials: true
        }).then(res => {
          if (!res.body.status) {
            this.$message({
              message: '用户名或密码错误或请先登出',
              type: 'error',
              duration: 1500,
              onClose: () => {
                window.setTimeout(() => {
                  form.dialogFormVisible = true
                }, 500)
              }
            })
          } else {
            this.$message({
              message: '登陆成功',
              type: 'success',
              duration: 1500
            })
            this.$store.commit('login', {
              type: 1,
              name: res.body.rstdata.name,
              location: res.body.rstdata.location
            })
            bus.$emit('rstLogin', this)
            this.$router.push('/rstOrder')
          }
        })
      }

      // register user
      if (!form.target && form.type) {
        const data = {
          name: form.form.name,
          password: form.form.pwd,
          gender: form.form.gender,
          telephone: form.form.telephone,
          address: form.form.address,
          'e-mail': form.form.email,
          location: form.form.location
        }
        this.$http.post('http://localhost/MeiBaiE/UserApi/register', data, {
          emulateJSON: true,
          credentials: true
        }).then(res => {
          if (!res.body.status) {
            this.$message({
              message: '必填项未填或有非法值',
              type: 'error',
              duration: 1500,
              onClose: () => {
                window.setTimeout(() => {
                  form.dialogFormVisible = true
                }, 500)
              }
            })
          } else {
            this.$message({
              message: '注册成功',
              type: 'success',
              duration: 1500
            })
            this.$store.commit('login', {
              type: 0,
              name: data.name,
              location: data.location
            })
            bus.$emit('userLogin', this)
          }
        })
      }

      // restaurant register
      if (form.target && form.type) {
        const parseTime = date => {
          return date.getHours() * 60 + date.getMinutes()
        }
        const data = {
          name: form.form.name,
          password: form.form.pwd,
          telephone: form.form.telephone,
          address: form.form.address,
          location: form.form.location,
          open_time: parseTime(form.form.time[0]),
          close_time: parseTime(form.form.time[1])
        }
        this.$http.post('http://localhost/MeiBaiE/RestaurantApi/register', data, {
          emulateJSON: true,
          credentials: true
        }).then(res => {
          if (!res.body.status) {
            this.$message({
              message: '必填项未填或有非法值',
              type: 'error',
              duration: 1500,
              onClose: () => {
                window.setTimeout(() => {
                  form.dialogFormVisible = true
                }, 500)
              }
            })
          } else {
            this.$message({
              message: '注册成功',
              type: 'success',
              duration: 1500
            })
            this.$store.commit('login', {
              type: 0,
              name: data.name,
              location: data.location
            })
            bus.$emit('rstLogin', this)
            this.$router.push('/rstOrder')
          }
        })
      }
    }
  },
  data () {
    return form
  },
  bus
}
</script>

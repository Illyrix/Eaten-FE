<template>
  <div class="content">
    <div class="content-wrap">
      <el-form :inline="true" label-width="80px" class="info-form" v-if="type != -1">
          <el-form-item label="用户名">
            <el-input v-model="name"></el-input>
          </el-form-item>

          <el-form-item label="密码">
            <el-input v-model="pwd" type="password" auto-complete="off"></el-input>
          </el-form-item>

          <!-- user -->
          <el-form-item label="性别" v-if="type == 0">
            <el-radio class="radio" v-model="gender" label="m">男</el-radio>
            <el-radio class="radio" v-model="gender" label="f">女</el-radio>
          </el-form-item>

          <el-form-item label="手机号" v-if="type == 0">
            <el-input  :maxlength="13" :minlength="13" v-model="telephone" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="email" v-if="type == 0">
            <el-input  v-model="email" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="所在城市">
            <el-input  v-model="location" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="具体位置">
            <el-input  v-model="address" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="联系电话" v-if="type == 1">
            <el-input  :maxlength="13" :minlength="13" v-model="telephone" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="营业时间" v-if="type == 1">
          <el-time-picker is-range v-model="time" placeholder="选择时间范围"></el-time-picker>
          </el-form-item>

          <el-form-item label="餐厅图片" v-if="type == 1">
            <el-upload
              class="avatar-uploader"
              action="http://localhost/MeiBaiE/RestaurantApi/upload"
              :show-file-list="false" :with-credentials="true" name="picture"
              :on-success="(res, file) => handleAvatarSuccess(res, file)"
              :before-upload="beforeAvatarUpload">
              <img v-if="picture" :src="picture" title="点击上传新的图片" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item class="operate">
            <el-button type="primary" @click="submit">保存</el-button>
            <el-button @click="cancel">重置</el-button>
          </el-form-item>
          <div class="clear"></div>
        </el-form>
    </div>
  </div>
</template>

<script>
import { bus } from './Auth'
const base = {
  name: '',
  pwd: '',
  gender: 'm',
  telephone: '',
  email: '',
  location: '',
  address: '',
  picture: ''
}
let info = {
  name: '',
  pwd: '',
  gender: 'm',
  telephone: '',
  email: '',
  location: '',
  address: '',
  picture: '',
  time: [new Date(), new Date()]
}

const getData = vm => {
  if (vm.$store.state.isLogin) {
    const url = 'http://localhost/MeiBaiE/' + ((vm.$store.state.user.type) ? 'RestaurantApi' : 'UserApi') + '/getInfo'
    vm.$http.get(url, {
      credentials: true
    }).then(res => {
      if (res.body.status !== undefined && res.body.status === false) {
        for (let i in info) {
          info[i] = ''
        }
        info.pwd = ''
        info.time[0].setTime(new Date())
        info.time[1].setTime(new Date())
      } else {
        for (let i in res.body) {
          if (i === 'e-mail') {
            info['email'] = res.body[i]
            continue
          }
          if (i === 'open_time') {
            info.time[0].setHours(parseInt(res.body[i]) / 60)
            info.time[0].setMinutes(parseInt(res.body[i]) % 60)
            info.time[0].setSeconds(0)
            continue
          }
          if (i === 'close_time') {
            info.time[1].setHours(parseInt(res.body[i]) / 60)
            info.time[1].setMinutes(parseInt(res.body[i]) % 60)
            info.time[1].setSeconds(0)
            continue
          }
          info[i] = res.body[i]
        }
        info.pwd = ''
      }
    })
  }
}

bus.$on('rstLogin', that => {
  getData(that)
})

bus.$on('userLogin', that => {
  getData(that)
})

bus.$on('logout', (that) => {
  for (let i in base) {
    info[i] = base[i]
  }
  info.email = ''
})

export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$store.state.isLogin) {
        getData(vm)
      }
    })
  },
  methods: {
    handleAvatarSuccess (response, file) {
      if (response.status === false) {
        this.$message({
          message: response.error,
          duration: 1500,
          type: 'error'
        })
      } else {
        this.$message({
          message: '上传成功',
          duration: 1500,
          type: 'success'
        })
        info.picture = response.url
      }
    },
    beforeAvatarUpload () {
    },
    cancel () {
      getData(this)
    },
    submit () {
      const url = 'http://localhost/MeiBaiE/' + ((this.$store.state.user.type) ? 'RestaurantApi' : 'UserApi') + '/updateInfo'
      let data = this.type === 1 ? {
        name: info.name,
        address: info.address,
        location: info.location,
        telephone: info.telephone,
        open_time: info.time[0].getHours() * 60 + info.time[0].getMinutes(),
        close_time: info.time[1].getHours() * 60 + info.time[1].getMinutes(),
        picture: info.picture
      } : {
        name: info.name,
        gender: info.gender,
        'e-mail': info.email,
        address: info.address,
        location: info.location,
        telephone: info.telephone
      }
      if (info.pwd.length > 0) {
        data.password = info.pwd
      }
      this.$http.post(url, data, {
        emulateJSON: true,
        credentials: true
      }).then(res => {
        if (res.body.status === true) {
          let that = this
          this.$message({
            message: '修改成功',
            duration: 1500,
            type: 'success',
            onClose () {
              getData(that)
            }
          })
        } else {
          this.$message({
            message: '修改失败, 请先登录',
            duration: 1500,
            type: 'error'
          })
        }
      })
    }
  },
  computed: {
    type () {
      return this.$store.state.user.type
    },
    isLogin () {
      return this.$store.state.user.isLogin
    }
  },
  data () {
    return info
  }
}
</script>

<style scoped>
.content {
  padding: 20px;
}
.content-wrap {
  padding: 40px;
  width: 980px;
  background: #FFF;
  margin: auto;
}
.avatar-uploader {
  width: 200px;
  float: left;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 150px;
    display: inline-block;
  }

.operate {
  margin-top: 60px;
  margin-bottom: 0;
  float: right;
}
.clear {
  clear: both;
}
</style>

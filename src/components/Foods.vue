<template>
  <div class="content">
    <div class="content-wrap">
      <div v-for="food in foods" class="food-item">
        <el-form :model="food" :inline="true" label-width="80px" class="food-form">
          <el-upload
            class="avatar-uploader"
            action="http://localhost/MeiBaiE/RestaurantApi/upload"
            :show-file-list="false" :with-credentials="true" name="picture"
            :on-success="(res, file) => handleAvatarSuccess(res, file, food.id)"
            :before-upload="beforeAvatarUpload">
            <img v-if="food.picture" :src="food.picture" title="点击上传新的图片" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-form-item label="菜名">
            <el-input v-model="food.name"></el-input>
          </el-form-item>
          <el-form-item label="单价">
            <el-input v-model="food.price" placeholder="打折前的单价"></el-input>
          </el-form-item>
          <el-form-item label="折扣">
            <el-input v-model="food.discount" placeholder="请输入0~1之间的小数,如不打折请填1"></el-input>
          </el-form-item>
          <br>
          <el-form-item class="operate">
            <el-button type="primary" @click="submit(food.id)">保存</el-button>
            <el-button @click="reset(food.id)">重置</el-button>
            <el-button type="danger" @click="deleteFood(food.id)">删除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="add-dish" @click="addFood">添加菜品</div>
    </div>
  </div>
</template>

<script>
import { bus } from './Auth'
let foods = []

const getData = vm => {
  if (vm.$store.state.isLogin && vm.$store.state.user.type) {
    vm.$http.get('http://localhost/MeiBaiE/RestaurantApi/listDishes', {
      credentials: true
    }).then(res => {
      if (res.body.status !== undefined && res.body.status === false) {
        while (foods.pop()) {}
        return
      } else {
        while (foods.pop()) {}
        for (let i in res.body) {
          foods.push(res.body[i])
        }
      }
    })
  }
}

bus.$on('rstLogin', (that) => {
  getData(that)
})

bus.$on('logout', (that) => {
  while (foods.pop()) {}
})

// save if a new food to be added
let temp = false

export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      getData(vm)
    })
  },
  methods: {
    addFood () {
      if (!temp) {
        foods.push({
          name: '',
          picture: '',
          discount: 1,
          price: 0.0,
          id: undefined
        })
        temp = true
      }
    },
    deleteFood (id) {
      if (id === undefined) {
        foods.pop()
        temp = false
        return
      }
      this.$confirm('该操作即将删除此菜品, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('http://localhost/MeiBaiE/RestaurantApi/deleteDish', {
          id
        }, {
          emulateJSON: true,
          credentials: true
        }).then(res => {
          if (res.body.status === true) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500
            })
            getData(this)
          }
        })
      }).catch(() => {})
    },
    handleAvatarSuccess (response, file, id) {
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
        for (let i in foods) {
          if (foods[i].id === id) {
            foods[i].picture = response.url
            break
          }
        }
      }
    },
    beforeAvatarUpload () {
    },
    submit (id) {
      if (id !== undefined) {
        let data = {}
        for (let i in foods) {
          if (foods[i].id === id) {
            data = foods[i]
            break
          }
        }
        this.$http.post('http://localhost/MeiBaiE/RestaurantApi/updateDishes', { dish: window.JSON.stringify(data) }, {
          emulateJSON: true,
          credentials: true
        }).then(res => {
          if (res.body.status === false) {
            this.$message({
              message: '服务器响应失败',
              type: 'error',
              duration: 1500
            })
            return
          } else {
            this.$message({
              message: '更新菜品成功',
              type: 'success',
              duration: 1500
            })
            getData(this)
          }
        })
      } else {
        let data = {}
        for (let i in foods) {
          if (foods[i].id === undefined) {
            for (let j in foods[i]) {
              if (j !== 'id') {
                data[j] = foods[i][j]
              }
            }
            break
          }
        }
        this.$http.post('http://localhost/MeiBaiE/RestaurantApi/addDish', { dish: window.JSON.stringify(data) }, {
          emulateJSON: true,
          credentials: true
        }).then(res => {
          if (res.body.status === false) {
            this.$message({
              message: '服务器响应失败',
              type: 'error',
              duration: 1500
            })
            return
          } else {
            this.$message({
              message: '添加菜品成功',
              type: 'success',
              duration: 1500
            })
            temp = false
            getData(this)
          }
        })
      }
    },
    reset (id) {
      this.$http.get('http://localhost/MeiBaiE/RestaurantApi/listDishes', {
        credentials: true
      }).then(res => {
        if (res.body.status !== undefined && res.body.status === false) {
          this.$message({
            message: '服务器响应失败',
            type: 'error',
            duration: 1500
          })
          return
        } else {
          for (let i in res.body) {
            if (res.body[i].id === id) {
              for (let k in foods) {
                if (foods[k].id === id) {
                  for (let j in res.body[i]) {
                    foods[k][j] = res.body[i][j]
                  }
                  break
                }
              }
              break
            }
          }
        }
      })
    }
  },
  data () {
    return {
      foods
    }
  }
}
</script>

<style scoped>
.content {
  padding: 20px;
}
.content-wrap {
  width: 980px;
  background: #FFF;
  margin: auto;
}
.food-item {
  height: 190px;
  padding: 20px;
  border-bottom: #EFEFEF 1px solid;
}
.food-form {
  clear: left;
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
.add-dish:hover {
  cursor: pointer;
}
.add-dish {
  text-align: center;
  line-height: 60px;
  height: 60px;
  font-size: 16px;
  color: #999;
}
.operate {
  margin-left: 80px;
}
</style>

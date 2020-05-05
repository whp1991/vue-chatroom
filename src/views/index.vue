<template>
  <div class="mainPage">
    <img src="../assets/img/han3.jpg" alt="">
    <div class="box" id="box">
      <div class="header">
        <span>前端交流群</span>
      </div>
      <div class="content clearfix" id="list">
        <div class="list fl">
          <div class="block-item clearfix" v-for="(item,index) in list" :key="index">
            <div class="login" v-if="item.type==='loginSuc'">{{item.name}}进来了</div>
            <div class="login" v-if="item.type==='shake'">{{item.name}}发送了一次抖动</div>

            <div class="listItem fr item-right clearfix" v-if="(item.type==='msg' || item.type==='img')  && item.isMine">
              <img src="../assets/img/avatar-male.png" alt="" width="40">
              <div class="name">{{item.name}}</div>
              <div class="msg" v-if="item.type=='msg'" :style="{color:item.color}">{{item.msg}}</div>
              <div>
                <img :src="item.msg" alt="" width="80" height="60" v-if="item.type=='img'" style="border-radius: 8px">
              </div>
            </div>

            <div class="listItem fl item-left clearfix" v-if="item.type==='msg' && !item.isMine">
              <img src="../assets/img/avatar-male.png" alt="" width="40">
              <div class="name">{{item.name}}</div>
              <div class="msg" v-if="item.type=='msg'">{{item.msg}}</div>
              <div>
                <img :src="item.msg" alt="" width="80" height="60" v-if="item.type=='img'" style="border-radius: 8px">
              </div>
            </div>
          </div>

        </div>
        <div class="rightList fr">
          <div class="user" v-for="(item,index) in userList" :key="index">
            <img :src="require('../assets/img/chat/user'+ item.avatar +'.jpg')" alt="" width="40">
            <div class="name">{{item.name}}</div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="icon-img">
          <img src="../assets/img/chat/color.png" alt="" width="20">
          <img src="../assets/img/chat/emoji.png" alt="" width="20">
          <img src="../assets/img/chat/dong.png" alt="" width="20" id="shake" @click="toShake">
          <img src="../assets/img/chat/pic.png" alt="" width="20">

          <input type="color" id="color" value="#000000" @change="getColor">
          <input type="file" id="file" @change="getFile">
        </div>
        <div class="input">
          <textarea v-model="word" @keyup.enter="submit"></textarea>
          <!-- <span @click="submit">发送</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ws: null,
      userList: [],
      list: [],
      word: ''
    }
  },
  methods: {
    getColor () {
      let dom = document.getElementById('color')
      console.log(dom.value)
      sessionStorage.setItem('color', dom.value)
    },
    toShake () {
      let data = {
        type: 'shake',
        name: 'lzg'
      }
      this.ws.send(JSON.stringify(data))
    },
    shakeing () {
      let dom = document.getElementById('box')
      dom.classList.add('shaking')
      setTimeout(() => {
        dom.classList.remove('shaking')
      }, 500)
    },
    getFile (e) {
      let vm = this
      let dom = document.getElementById('file')
      let file = dom.files[0]
      console.log(file)
      var reader = new FileReader()
      reader.onerror = function () {
        console.log('读取文件失败，请重试！')
      }
      // 读取成功后
      reader.onload = function () {
        let src = reader.result // 读取结果
        console.log(src)
        vm.ws.send(JSON.stringify({ type: 'img', msg: src, name: 'lzg' }))
        setTimeout(() => {
          vm.ws.send(JSON.stringify({ type: 'msg', msg: '收到了', name: 'jack' }))
        }, 300)
      }
      reader.readAsDataURL(file) // 读取为64位
    },
    submit () {
      let color = sessionStorage.getItem('color') || '#000'
      this.ws.send(JSON.stringify({ type: 'msg', msg: this.word, name: 'lzg', color: color }))
      this.word = ''
      setTimeout(() => {
        this.ws.send(JSON.stringify({ type: 'msg', msg: '收到了', name: 'jack' }))
      }, 300)
    }
  },
  mounted () {
    let vm = this
    sessionStorage.removeItem('color')
    this.ws = new WebSocket('ws://localhost:3000')
    this.ws.onopen = function () {
      console.log('连接成功')
      let data = {
        type: 'login',
        name: 'lzg',
        userId: new Date().getTime()
      }
      vm.ws.send(JSON.stringify(data))
    }
    this.ws.onmessage = function (data) {
      let item = JSON.parse(data.data)
      if (item.type === 'loginSuc') {
        vm.userList = item.usersInfo
        console.log(vm.userList)
      }

      if (item.type === 'shake') {
        vm.shakeing()
      }

      if (item.name === 'lzg') {
        item.isMine = true
      } else {
        item.isMine = false
      }
      vm.list.push(item)
      console.log(vm.list)

      setTimeout(() => {
        document.getElementById('list').scrollTop = document.getElementById('list').scrollHeight
      }, 500)
    }
    this.ws.onerror = function (event) {
      console.log('网络错误')
    }
    this.ws.onclose = function (event) {
      console.log('离开了')
    }
  }
}
</script>

<style scoped lang="less">
.mainPage {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  > img {
    height: 100%;
    width: 100%;
  }
  .box {
    width: 750px;
    height: 670px;
    background-color: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    left: calc(50% - 7px);
    transform: translate(-50%, -50%);
    z-index: 999;
    border-radius: 10px;
    .header {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #eee;
      padding: 0 20px;
      background-color: rgb(66, 155, 254);
      color: #fff;
    }
    .content {
      height: 500px;
      padding: 0 20px;
      overflow: auto;
      .rightList {
        width: 200px;
        height: 100%;
        padding-top: 15px;
        .user {
          display: inline-block;
          // margin-right: 10px;
          padding: 5px 10px;
          .name {
            text-align: center;
            font-size: 12px;
            color: #888;
          }
        }
      }
      .list {
        overflow: auto;
        width: 500px;
        border-right: 1px solid #eee;
        padding-right: 15px;
        min-height: 100%;
        .login {
          text-align: center;
          font-size: 12px;
          line-height: 22px;
          color: #888;
        }
        .listItem {
          position: relative;
          width: 60%;
          padding: 15px 0;
          font-size: 12px;
          > img {
            position: absolute;
            top: 20px;
          }
          .name {
            line-height: 24px;
          }
          .msg {
            padding: 6px;
            background-color: #86bdf8;
            display: inline-block;
            border-radius: 4px;
            line-height: 24px;
          }
        }
        .item-right {
          text-align: right;
          padding-right: 50px;
          > img {
            right: 0;
          }
        }
        .item-left {
          text-align: left;
          padding-left: 50px;
          > img {
            left: 0;
          }
        }
      }
    }
    .footer {
      height: 120px;
      border-top: 1px solid #eee;
      padding: 10px 20px;
      position: relative;
      .icon-img {
        margin-bottom: 10px;
        > img {
          margin-right: 10px;
        }
      }
      .input {
        > textarea {
          width: 100%;
          height: 100%;
          font-size: 14px;
          line-height: 18px;
        }
      }
    }
  }
}
div::-webkit-scrollbar {
  display: none;
}
#color {
  position: absolute;
  top: 12px;
  left: 12px;
  opacity: 0;
}

#file {
  position: absolute;
  top: 12px;
  left: 112px;
  opacity: 0;
}

.shaking {
  animation: run 0.2s infinite;
}
@keyframes run {
  0% {
    left: 50%;
  }
  25% {
    left: calc(50% - 7px);
  }
  50% {
    left: calc(50% + 7px);
  }
  100% {
    left: 50%;
  }
}
</style>

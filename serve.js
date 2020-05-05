//引入ws模块
var webSocket = require('ws')

var ws = new webSocket.Server({ port: 3000 })

var users = [] // 储存登录用户
var usersInfo = [] // 存储用户姓名和头像

//监听客户端的连接事件
ws.on('connection', function (ws) {
  console.log('新用户连接')

  //接收前端的信息
  ws.on('message', function (event) {
    let obj = JSON.parse(event)
    let type = obj.type
    console.log(type)
    if (type === 'login') {
      var imgN = Math.floor(Math.random() * 4) + 1; // 随机分配头像
      users.push(obj.name)
      usersInfo.push({
        name: obj.name,
        userId: obj.userId,
        avatar: String(imgN)
      })
      // ws.send(JSON.stringify({ type: 'user', list: usersInfo }))
      let data = {
        type: 'loginSuc',
        msg: obj.name + '进来了',
        name: obj.name,
        usersInfo: usersInfo
      }
      ws.send(JSON.stringify(data))
    } else if (type === 'shake') {
      let data = {
        type: 'shake',
        msg: obj.name + '发送了一次抖动了',
        name: obj.name
      }
      ws.send(JSON.stringify(data))
    }
    else if (type === 'msg' || type === 'img') {
      let img = ''
      for (var i = 0; i < usersInfo.length; i++) {
        if (usersInfo[i].name == obj.name) {
          img = usersInfo[i].img
        }
      }
      let data = {
        type: type,
        msg: obj.msg,
        name: obj.name,
        img: img,
        color: obj.color
      }
      ws.send(JSON.stringify(data))
      // setInterval(() => {
      //   ws.send(JSON.stringify(data))
      // }, 300)
    }
  })
})

console.log('websocket server is running')

// ws.broadcast = function (data) {
//   ws.clients.forEach(function (client) {
//       client.send(data);
//   });
// };

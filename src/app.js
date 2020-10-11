import express from 'express'
import config from './config.js'
import db from './../db/db.js'

import session from 'express-session'
const mongoStore = require('connect-mongo')(session)
import bodyParser from './../middle_wares/body_parser.js'

import homeRouter from './../routes/home.js'
import categoryRouter from './../routes/category.js'
import usersRouter from './../routes/users.js'
import cartRouter from './../routes/cart.js'
import addressRouter from './../routes/address.js'
import orderRouter from './../routes/order.js'

const app = express()

// session
app.use(session({
  secret: config.secret,
  name: config.name,
  resave:false,
  saveUninitialized:true,
  cookie:{maxAge:config.maxAge },
  rolling:true,
  store:new mongoStore({
      url:config.db_url,
      touchAfter: config.maxAge
  })
}))

// 配置数据处理的中间件
app.use(bodyParser);

// 路由
app.use(homeRouter)
app.use(categoryRouter)
app.use(usersRouter)
app.use(cartRouter)
app.use(addressRouter)
app.use(orderRouter)

app.use((req, res) => {
  res.send('404, 页面找不到')
})

app.listen(config.port, () => {
  console.log(`服务器已经启动, 端口是: ${config.port}`);
})
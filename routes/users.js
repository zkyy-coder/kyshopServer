import express from 'express'
const router = express.Router({})
import svgCaptcha from 'svg-captcha'

import usersModel from './../model/users.js'

// 生成随机图形验证码
router.get('/web/kyshop/api/captcha', (req, res) => {
  // 生成随机的验证码
  let captcha = svgCaptcha.create({
    color: true,
    noise: 2,
    size: 4,
    ignoreChars: '0o1i',
  });

  // 保存验证码到session
  req.session.captcha = captcha.text.toLocaleLowerCase();

  // 返回给客户端
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.type('svg');
  res.status(200).send(captcha.data);
})

// 用户名密码登录
router.post('/web/kyshop/api/login_pwd', async (req, res) => {
  let user_name = req.body.user_name
  let user_pwd = req.body.user_pwd
  let captcha = req.body.captcha.toLowerCase()

  // 验证码是否正确
  if(captcha !== req.session.captcha) {
    return res.send({err_code: 0, message: '验证码不正确'})
  }

  // 删除验证码
  delete req.session.captcha


  await usersModel.find({ user_name }, (err, data) => {
    if (Object.keys(data).length === 0) { // 如果没有注册,则进行注册
      let user = new usersModel({ user_name, user_pwd })
      user.save((err, data) => {
        req.session.userid = data._id
        res.send({
          success_code: 200,
          data: {
            token: data._id,
            real_name: data.real_name,
            user_name: data.user_name
          }
        })
      })
    } else { // 存在则登录
      let user = data[0]
      // 验证密码
      if (user_pwd !== user.user_pwd) {
        res.send({ err_code: 0, message: '用户名或者密码错误' })
      } else {
        req.session.userid = user._id
        res.send({
          success_code: 200,
          data: {
            token: user._id,
            real_name: user.real_name,
            user_name: user.user_name,
            phone: user.user_phone,
            icon_url: user.icon_url
          }
        })
      }
    }
  })
})

// 获取手机短信验证码
router.get('/web/kyshop/api/send_code', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  let code = random(6)

  setTimeout(() => {
    req.session.code = code
    res.json({
      success_code: 200,
      message: '验证码获取成功',
      code
    })
  }, 2000)
})

// 手机验证码登录
router.post('/web/kyshop/api/login_code', async (req, res) => {
  // 获取验证码和手机号
  let phone = req.body.phone
  let code = req.body.code

  // 判断短信验证码是否正确
  if (code === undefined || req.session.code === undefined || code !== req.session.code) {
    return res.json({
      err_code: 0,
      message: '短信验证码错误'
    })
  }

  // 判断该手机号是否被注册
  delete req.session.phone
  await usersModel.findOne({ phone }, (err, data) => {
    if (data) {
      req.session.userid = data._id
      res.json({
        success_code: 200,
        data: {
          token: data._id,
          real_name: data.real_name,
          user_name: data.user_name,
          phone: data.phone,
          icon_url: data.icon_url
        }
      })
    } else {
      let user = new usersModel({ phone })
      user.save((err, data) => {
        req.session.userid = data._id
        res.json({
          success_code: 200,
          data: {
            token: data._id,
            real_name: data.real_name,
            user_name: data.user_name,
            phone: data.phone,
            icon_url: data.icon_url
          }
        })
      })
    }
  })
  })

// 自动登录
router.get('/web/kyshop/api/userinfo', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  // 获取在session中的userid
  let userId = req.session.userid

  // 查询该用户
  usersModel.findOne({_id: userId}, {user_pwd: 0, l_edit: 0, _v: 0}, (err, data) => {
    if(data) {
      res.json({
        success_code: 200,
        data: {
          token: data._id,
          real_name: data.real_name,
          user_name: data.user_name,
          phone: data.phone,
          icon_url: data.icon_url
        }
      })
    } else {
      delete req.session.userid
      res.json({
        err_code: 0,
        message: '请先登录'
      })
    }
  })
})

// 退出登录
router.get('/web/kyshop/api/logout', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  // 删除session中的数据
  delete req.session.userid

  res.json({
    success_code: 200,
    message: '退出登录成功'
  })
})

// 生成指定长度的随机数
function random(length) {
  let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let res = ''
  for (let i = 0; i < length; i++) {
    res += chars[Math.ceil(Math.random() * 9)]
  }
  return res
}

export default router
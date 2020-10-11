import express from 'express'
import { ObjectID } from 'mongodb'
const router = express.Router({})
import orderModel from './../model/order.js'

// 提交订单
router.post('/web/kyshop/api/order/post', (req, res) => {
  let { user_id, address_id, arrive_time, cart_shop, notice, shop_price, dis_price } = req.body

  if (user_id) {
    let order = new orderModel({
      user_id, 
      address_id, 
      arrive_time, 
      cart_shop, 
      notice, 
      shop_price, 
      dis_price
    })

    order.save((err, data) => {
      if(err) return res.json({ err_code: 0, message: '生成订单失败' })

      res.json({
        success_code: 200,
        message: '创建订单成功',
        data: {
          order_id: data._id,
          user_id: data.user_id,
          total_price: data.dis_price + data.shop_price
        }
      })
    })
  } else {
    return res.json({ err_code: 0, message: '非法用户' })
  }
})

// 查询订单
router.post('/web/kyshop/api/order/get', (req, res) => {
  let { user_id, status } = req.body

  if(user_id) {
    orderModel.find({user_id: ObjectID(user_id), order_status: status}, (err, data) => {
      if(err) return res.json({ err_code: 0, message: '查找失败' })

      res.json({
        success_code: 200,
        message: '查找订单成功',
        data
      })
    })
  } else {
    return res.json({ err_code: 0, message: '非法用户' })
  }
})

// 改变订单状态
router.post('/web/xlmc/api/order/change_status', (req, res) => {
  let { user_id, order_id } = req.body

  if(user_id) {
    orderModel.findOne({user_id: ObjectID(user_id), _id: ObjectID(order_id)}, (err, data) => {
      if(err) return res.json({ err_code: 0, message: '查找失败' })

      console.log(data);
      if(data) {
        data.order_status = !data.order_status
        data.save((err, data) => {
          if(err) return res.json({ err_code: 0, message: '修改失败' })

          res.json({
            success_code: 200,
            message: '修改成功',
            data
          })
        })
      } else {  
        return res.json({ err_code: 0, message: '不存在该订单' })
      }
    })
  } else {
    return res.json({ err_code: 0, message: '非法用户' })
  }
})

export default router
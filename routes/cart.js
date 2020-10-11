import express from 'express'
const router = express.Router({})
import { ObjectID } from 'mongodb'
import cartModel from './../model/cart.js'

// 添加商品到购物车
router.post('/web/kyshop/api/cart/add', (req, res, next) => {
  let { user_id, goods_id, goods_name, goods_price, small_image } = req.body
  if (user_id) {
    cartModel.findOne({ user_id: ObjectID(user_id), goods_id: ObjectID(goods_id) }, (err, data) => {
      if (err) {
        return res.json({
          err_code: 0,
          message: '用户或者商品id错误'
        })
      }
      // 如果有该商品数量+1, 没有则添加该商品
      if (data) {
        data.num += 1
        data.save(() => {
          res.json({
            success_code: 200,
            data,
            message: '新增成功'
          })
        })
      } else {
        let cart = new cartModel({
          user_id,
          goods_id,
          goods_name,
          goods_price,
          small_image,
          num: 1
        })

        cart.save((err, data) => {
          if (err) {
            return res.json({
              err_code: 0,
              message: '新增失败,未输入完整数据'
            })
          }
          res.json({
            success_code: 200,
            data,
            message: '新增成功'
          })
        })
      }
    })
  } else {
    return res.json({
      err_code: 0,
      message: '非法用户'
    })
  }
})

// 获取该用户购物车中的数据
router.get('/web/kyshop/api/cart/search/:user_id', (req, res) => {
  let user_id = req.params.user_id
  if (user_id) {
    cartModel.find({ user_id: ObjectID(user_id) }, (err, data) => {
      if (err) {
        return res.json({
          err_code: 0,
          message: '查找失败'
        })
      }
      res.json({
        success_code: 200,
        message: '查找成功',
        data
      })
    })
  } else {
    return res.json({
      err_code: 0,
      message: '非法用户'
    })
  }
})

// 修改购物车中单个商品数量
router.post('/web/kyshop/api/cart/num', (req, res) => {
  let { user_id, goods_id, type } = req.body
  if (user_id) {
    cartModel.findOne({ user_id: ObjectID(user_id), goods_id: ObjectID(goods_id) }, (err, data) => {
      if (err) {
        return res.json({
          err_code: 0,
          message: '查找失败'
        })
      }

      // console.log(data);
      if (data != null) {
        let currentNum = parseInt(data.num)
        currentNum += (type === 'add' ? 1 : -1)
        // 当商品数量为0时删除商品
        if (currentNum === 0) {
          data.remove((err, data) => {
            if (err) {
              return res.json({
                err_code: 0,
                message: '删除商品失败'
              })
            }

            res.json({
              success_code: 200,
              message: '该商品已删除'
            })
          })
        } else {
          data.num = currentNum
          data.save((err, data) => {
            if (err) return res.json({ err_code: 0, message: '修改商品数量失败' })

            res.json({
              success_code: 200,
              message: '修改商品数量成功'
            })
          })
        }
      } else {
        return res.json({
          error_code: 0,
          message: '购物车中没有该商品'
        })
      }
    })
  } else {
    return res.json({
      err_code: 0,
      message: '非法用户'
    })
  }
})

// 删除该用户购物车数据
router.get('/web/kyshop/api/clear/:user_id', (req, res) => {
  let user_id = req.params.user_id

  if (user_id) {
    cartModel.deleteMany({ user_id: ObjectID(user_id) }, (err, data) => {
      if (err) return res.json({ err_code: 0, message: '清空失败' })

      res.json({
        success_code: 200,
        message: '清空成功'
      })
    })
  } else {
    return res.json({
      err_code: 0,
      message: '非法用户'
    })
  }
})

// 单个商品的选中和取消选中
router.post('/web/kyshop/api/cart/singer_select', (req, res) => {
  let { user_id, goods_id } = req.body

  if (user_id) {
    cartModel.findOne({ user_id: ObjectID(user_id), goods_id: ObjectID(goods_id) }, (err, data) => {
      if (err) return res.json({ err_code: 0, message: '修改失败' })

      if (data) {
        data.checked = !data.checked
        data.save((err, data) => {
          if (err) return res.json({ err_code: 0, message: '修改失败' })

          res.json({
            success_code: 200,
            message: '修改成功'
          })
        })
      } else {
        return res.json({ err_code: 0, message: '购物车中无该商品' })
      }
    })
  } else {
    return res.json({
      err_code: 0,
      message: '非法用户'
    })
  }
})

// 后台商品的全选和取消
router.post('/web/kyshop/api/cart/all_select', (req, res) => {
  let { user_id, flag } = req.body

  if (user_id) {
    cartModel.updateMany({ user_id: ObjectID(user_id) }, { checked: !flag }, (err, data) => {
      if (err) return res.json({ err_code: 0, message: '修改失败' })
      res.json({
        success_code: 200,
        message: '修改成功'
      })
    })
  } else {
    return res.json({
      err_code: 0,
      message: '非法用户'
    })
  }
})

// 查询所有已经被选中的商品
router.get('/web/kyshop/api/cart/selected/:user_id', (req, res) => {
  let user_id = req.params.user_id

  if (user_id) {
    cartModel.find({ user_id: ObjectID(user_id), checked: true }, (err, data) => {
      if (err) return res.json({ err_code: 0, message: '查找失败' })

      if (data) {
        res.json({
          success_code: 200,
          message: '查找成功',
          data
        })
      } else {
        return res.json({
          err_code: 0,
          message: '请选择商品'
        })
      }
    })
  } else {
    return res.json({
      err_code: 0,
      message: '非法用户'
    })
  }
})

// 删除已经生成订单的商品
router.get('/web/kyshop/api/cart/del_checked/:user_id', (req, res) => {
  let user_id = req.params.user_id

  if (user_id) {
    cartModel.deleteMany({ user_id: ObjectID(user_id), checked: true }, (err, data) => {
      if (err) return res.json({ err_code: 0, message: '查找失败' })

      res.json({
        success_code: 200,
        message: '成功删除已经生成订单的商品'
      })
    })
  } else {
    return res.json({
      err_code: 0,
      message: '非法用户'
    })
  }
})

export default router
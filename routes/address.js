import express, { json } from 'express'
const router = express.Router({})
import addressModel from './../model/address.js'
const ObjectID = require('mongodb').ObjectID

// 添加用户收货地址
router.post('/web/kyshop/api/address/add', (req, res) => {
  let { user_id, address_name, address_phone, address_area, address_area_detail,
    address_post_code, address_tag, province, city, county, areaCode } = req.body

  if (user_id) {
    let address = new addressModel({
      user_id, address_name, address_phone, address_area, address_area_detail,
      address_post_code, address_tag, province, city, county, areaCode
    })
    address.save((err, data) => {
      if(err) return res.json({ err_code: 0, message: '添加地址失败' })

      res.json({
        success_code: 200,
        message: '新增地址成功',
        data
      })
    })
  } else {
    return res.json({ err_code: 0, message: '非法用户' })
  }
})

// 获取当前用户收货地址
router.get('/web/kyshop/api/address/search/:user_id', (req, res) => {
  let user_id = req.params.user_id

  if(user_id) {
    addressModel.find({user_id: ObjectID(user_id)}, (err, data) => {
      if(err) return res.json({ err_code: 0, message: '获取地址失败' })

      res.json({
        success_code: 200,
        message: '获取地址成功',
        data
      })
    })
  } else {
    return res.json({ err_code: 0, message: '非法用户' })
  }
})

// 获取用户单条地址
router.post('/web/kyshop/api/address/one', (req, res) => {
  let { user_id, address_id } = req.body

  if(user_id) {
    addressModel.findOne({user_id: ObjectID(user_id), _id: ObjectID(address_id)}, (err, data) => {
      if(err) return res.json({ err_code: 0, message: '获取地址失败' })

      res.json({
        success_code: 200,
        message: '获取地址成功',
        data
      })
    })
  } else {
    return res.json({ err_code: 0, message: '非法用户' })
  }
})

// 修改用户地址
router.post('/web/kyshop/api/address/edit', (req, res) => {
  let { address_id, user_id, address_name, address_phone, address_area, address_area_detail,
    address_post_code, address_tag, province, city, county, areaCode } = req.body

  if(user_id) {
    addressModel.findById(address_id, (err, data) => {
      if(err) return res.json({ err_code: 0, message: '修改失败' })
      console.log(data);
      // 修改数据
      data.address_name = address_name
      data.address_phone = address_phone
      data.address_area = address_area
      data.address_area_detail = address_area_detail
      data.address_post_code = address_post_code
      data.address_tag = address_tag
      data.province = province
      data.city = city
      data.county = county
      data.areaCode = areaCode

      data.save((err, data) => {
        if(err) return res.json({ err_code: 0, message: '修改失败' })

        res.json({
          success_code: 200,
          message: '修改地址成功',
          data
        })
      })
    })
  } else {
    return res.json({ err_code: 0, message: '非法用户' })
  }
})

// 删除用户地址
router.get('/web/kyshop/api/address/del/:address_id', (req, res) => {
  let address_id = req.params.address_id

  addressModel.deleteOne({ _id: ObjectID(address_id) }, (err, data) => {
    if(err) return res.json({ err_code: 0, message: '修改失败' })

    res.json({
      success_code: 200,
      message: '删除地址成功'
    })
  })
})

export default router
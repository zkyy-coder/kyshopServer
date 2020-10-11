import express from 'express'
const router = express.Router({});
import categoryModel from './../model/category.js'
import productsModel from './../model/c_products.js'

// 分类数据
router.get('/web/kyshop/api/categories', async (req, res, next) => {
  await categoryModel.find({}, (err, data) => {
    if (err) return res.json({ err_code: 0,message: '分类数据失败' })
    res.json({
      success_code: 200,
      message: '获取分类成功',
      data: {
        data
      }
    });
  })
})

// 分类详情
router.get('/web/kyshop/api/categoriesdetail/ky:_id', async (req, res) => {
  let page = 0
  let name = ''
  let cate = []
  if(req.params._id === '001') {
    page = 0
    name = '猜你喜欢'
  } else if(req.params._id === '002') {
    page = 15
    name = '会员特价'
  } else {
    page = 30
    name = '推荐'
  }

  let data = await productsModel.find({}).limit(15).skip(page)
  cate.push({
    name,
    products: data
  })

  res.json({
    success_code: 200,
    message: '获取分类详情成功',
    data: {
      cate
    }
  })
})

export default router
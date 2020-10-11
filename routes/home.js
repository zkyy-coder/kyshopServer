import express from 'express'
const router = express.Router({});
import BannerModel from './../model/banner.js'
import RecommendModel from './../model/recommend.js'
import flashSaleModel from './../model/flash_sale.js'
import youLikeModel from './../model/you_like.js'

// 首页数据
router.get('/web/kyshop/api/home', async (req, res, next) => {
    let list = []

    // 获取轮播图数据
    await BannerModel.find({}, (err, data) => {
        if(err) return res.json({err_code: 0, message: '获取轮播图数据失败'})
        let d = { icon_list: data }
        list.push(d)
    })

    // 获取今日推荐数据
    await RecommendModel.find({}, (err, data) => {
        if (err) return res.json({err_code: 0, message: '获取今日推荐数据失败'})
        let d = { icon_list: data }
        list.push(d)
    })

    // 获取抢购数据
    await flashSaleModel.find({}, (err, data) => {
        if (err) return res.json({err_code: 0, message: '获取抢购数据失败'})
        let d = {
            link: {
                type: 2,
                data: {
                    id: "5d1d79c025e1f7624c8b4567",
                    title: "限时抢购"
                }
            },
            status: 2,
            promotion_id: "5d1d79c025e1f7624c8b4567",
            sub_title: "07:00场",
            start_time: 1564786800,
            end_time: 1564804800,
            product_list: data
        }
        list.push(d)
    })

    // 获取猜你喜欢数据
    await youLikeModel.find({}, (err, data) => {
        if (err) return res.json({err_code: 200, message: '获取猜你喜欢数据失败'})
        let d = {
            page: 1,
            product_list: data
        }
        list.push(d)
    })

    res.json({
        success_code: 200,
        message: '获取首页数据成功',
        data: {
            list
        }
    })
});

export default router
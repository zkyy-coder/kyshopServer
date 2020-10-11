import mongoose from 'mongoose'
const Schema = mongoose.Schema

// 轮播图模型
const BannerSchema = new Schema({
  cid: Number,
  public_id: String,
  public_name: String,
  meteria_id: String,
  icon_url: String,
  link: Object,
  is_pop_login: Number
})

const BannerModel = mongoose.model('banners', BannerSchema)
export default BannerModel
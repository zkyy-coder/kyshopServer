import mongoose, { mongo } from 'mongoose'
const Schema = mongoose.Schema

// 今日推荐模型
const RecommendSchema = new Schema({
  icon_url: String,
  link: Object,
  public_id: String,
  public_name: String,
  cid: Number,
  name: String,
  is_pop_login: Number
})

const RecommendModel = mongoose.model('recommends', RecommendSchema)
export default RecommendModel
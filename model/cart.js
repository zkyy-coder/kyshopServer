import mongoose from 'mongoose'
const Schema = mongoose.Schema

// 购物车商品模型
const cartSchema = new Schema({
  goods_id: { type: Schema.Types.ObjectId, required: true }, // 商品id
  user_id: { type: Schema.Types.ObjectId, required: true }, // 用户id
  goods_name: { type: String, required: true }, // 商品名
  goods_price: { type: Number, required: true }, // 商品价格
  small_image: { type: String, required: true }, // 商品图片
  num: { type: Number, required: true }, // 商品数量
  checked: { type: Boolean, default: true }, // 是否被选中
  isDel: { type:Boolean, default: false }, // 是否被删除
  ctime: { type: String, default: Date.now() } // 时间
})

const cartModel = mongoose.model('carts', cartSchema)
export default cartModel
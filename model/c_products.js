import mongoose from 'mongoose'
const Schema = mongoose.Schema

const productsSchema = new Schema({
  "product_name": String,
  "name": String,
  "origin_price": String,
  "price": String,
  "vip_price": String,
  "spec": String,
  "small_image": String,
  "category_id": String,
  "sizes": Array,
  "total_sales": Number,
  "month_sales": Number,
  "buy_limit": Number,
  "mark_discount": Number,
  "mark_new": Number,
  "mark_self": Number,
  "status": Number,
  "category_path": String,
  "type": Number,
  "stockout_reserved": Boolean,
  "is_promotion": Number,
  "sale_point_msg": Array,
  "activity": Array,
  "is_presale": Number,
  "presale_delivery_date_display": String,
  "is_gift": Number,
  "is_onion": Number,
  "is_invoice": Number,
  "sub_list": Array,
  "badge_img": String,
  "is_vod": Boolean,
  "stock_number": Number,
  "today_stockout": String,
  "is_booking": Number
})

const productsModel = mongoose.model('c_products', productsSchema, 'c_products')
export default productsModel
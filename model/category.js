import mongoose from 'mongoose'
const Schema = mongoose.Schema

// 创建类别模型
const categorySchema = new Schema({
  name: String
})

const categoryModel = mongoose.model('category', categorySchema, 'category')
export default categoryModel

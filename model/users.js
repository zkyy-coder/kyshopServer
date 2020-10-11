import mongoose from 'mongoose'
const Schema = mongoose.Schema

// 创建管理员(用户)的模式对象
const usersSchema = new Schema({
    // 姓名
    real_name: {type: String, default: '阳光宝宝'},
    // 用户名
    user_name: {type: String, required: false},
    // 密码
    user_pwd: {type: String, required: false},
    // 头像
    icon_url: {type: String, default: 'https://img.alicdn.com/tfs/TB1MaLKRXXXXXaWXFXXXXXXXXXX-480-260.png'},
    // 手机号码
    phone: {type: String, required: false},
    // 当前编辑的时间
    l_edit: {type: Date, default: Date.now()},
    // 添加时间
    c_time: {type: Date, default: Date.now()},
});

const usersModel = mongoose.model('users', usersSchema);
export default usersModel;
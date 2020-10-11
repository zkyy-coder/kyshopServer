import querystring from 'querystring'

// 处理post请求
export default (req, res, next)=>{
    // 过滤get请求
    if(req.method.toLowerCase() === 'get'){
        return next();
    }

    // 数据流的拼接
    let data = '';
    req.on('data', (chunk)=>{
        data += chunk;
    });
    req.on('end', ()=>{
        // console.log(data);
        // req.body = querystring.parse(data);
        req.body =  JSON.parse(data);
        next();
    });
}
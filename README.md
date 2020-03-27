## 给数据库表创建映射 (db 目录下)

使用 Sequelize
为每个表创建 Module

## body-parser

## 路由模块化

使用 express 的 router 模块

## 请求的 body 过长返回 413 pyload too large

https://s1.ax1x.com/2020/03/25/8j22Qg.png
修改图片类型未 jpeg

## axios 的 post 请求中的 body 需要进行序列化

使用 qs 库多 post 请求中的 body 进行序列化，不然后端调用百度的 api 无法成功

比如：

```javascript
/*
路径：/user/regFace
*/
router.post("/regFace", function(req, res) {
  axios
    .post(
      "https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add",
      qs.stringify(req.body) //此处使用qs进行序列化
    )
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});
```

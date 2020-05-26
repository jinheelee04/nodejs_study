const express =require("express");
// helmet 모듈은 노드 사용시 보안관련 모듈
const helmet = require("helmet");
const routes = require("./routes");
const globalRouter = require("./routers/globalRouter");
const models = require("./models/index.js");

models.sequelize.sync().then(()=>{
    console.log("DB 연결 성공");
}).catch(err=>{
    console.log("DB 연결 실패");
    console.log(err);
});


app = express();
app.set("view engine", "ejs");

app.use(helmet());
app.use(routes.home, globalRouter);
// app.get("/", function(req, res){
//     res.send("HELLO NODE");
// });


module.exports = app;
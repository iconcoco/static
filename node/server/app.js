

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const mime = require('./controler/mimeControler.js');
 
// Serve up public/ftp folder
//配置静态资源的使用目录

function STUTICFILE(stuticPaty,req,res){
    let pathObj = url.parse(req.url,true);

    let filePath = path.join(stuticPaty,pathObj.pathname);  //文件的路径
    let extname = path.extname(pathObj.pathname);           //文件扩展名

    //如果没有扩展名，当做接口请求
    if(!extname){
        console.log(`请求的是接口`);
        let data =  {
            code:0,
            data:'success',
            msg:'ojbk'
        };
        res.writeHead(200,'ok');
        res.end(JSON.stringify(data));
    };
    //否则 请求静态资源 读取文件并返回
    fs.readFile(filePath,(err,fd)=>{
        if(err) {res.writeHead(404,'Not found') ;return res.end(`<h1>404 找不到</h1>`);}

        res.setHeader("Content-Type",`${mime(extname)};charset=UTF-8`);
        res.writeHead(200,'ok');
        res.write(fd);
        res.end();
    });
};
 
// Create server // Listen
http.createServer(function onRequest (req, res) {
    //返回静态资源
    STUTICFILE(path.join(__dirname,'public'),req,res);
}).listen(3000);



console.log('server is running at http://127.0.0.1:3000');
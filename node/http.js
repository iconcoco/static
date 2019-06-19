const http = require('http');

http.createServer( (request, response) => {

    console.log(request);

    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/html
    response.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});

    // 发送响应数据 "Hello World"
    //end里面必须是字符串  或者 buffer
    response.end("<h1>hello world~!!</h1>");
}).listen(8888,'127.0.0.1');

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
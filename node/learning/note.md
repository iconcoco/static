8bit = 1byte;
1024byte = 1kb;
1024bk = 1mb;
1024bm = 1gb;

1个汉字 = 3byte;
# Node.js的特点
Node.js是一个单线程，基于事件驱动，异步无阻塞I/O的javascript运行环境；

NodeJs拥有JS所有语言核心语法，但是没有关于DOM的语法；没有window对象
# Buffer


# http

    创建一个服务器：createService((rquest,response)=>{
        response.end(`hello world!!`)
    }).listen(3000,'127.0.0.1');

    - response.end();
        向客户端返回数据，end里面是字符串或者buffer数据

    - response.writeHead();
        修改响应头；response.writeHead('Content-Type': 'text/html;charset=UTF-8');

#  Node中的模块

    module.exports === exports

    module.eexports与exports 并不会阻止后面代码的执行
    
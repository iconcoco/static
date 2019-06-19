/**
 * fa 文件系统
 *    - 文件系统就是通过Node来操作系统中的文件
 *    - fs是核心模块，直接引入无需下载
 *    - fs模块中的所有操作有同步和异步选择 fnSync 同步  fn异步
 *    - 所有文件系统操作都具有同步和异步的形式
 */

const fs = require('fs');
// const path = require('path');
// console.log(path.dirname);


//1. 打开文件  open(path,flags(,mode)); openSync(path); openSync()
/**
 * path  文件的路径
 * flags  r 只读  w 可写
 */
// fs.open()
let fd = fs.openSync('./text.txt','w');

//2. 写文件 write(fd,string(,position,{,encoding}));
/**
 * fd    写入文件的文件数据
 * string  文件内容
 */
fs.writeSync(fd,'学习node的fs模块！');
fs.writeSync(fd,'重新再学node的fs模块知识！');

//3. 保存并关闭  close(fd);  closeSync(fd);
/**
 * fd   需要关闭的文件。否则会一直暂用内存；
 */
fs.closeSync(fd);

//  以上代码就是fs.writeFile的源码，会覆盖原来文件的内容；
// fs.writeFile 就是基于 fs.open/fs.write/fs.close 进行封装的一个方法

// fs.createWriteStream(path)  文件流
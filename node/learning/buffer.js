
/**
 * Buffer(缓冲区)
 *      - Buffer的结构和数组很像，操作的方法也和数组类似。
 *      - 一个二进制的缓冲区，通过这个二进制可以深入到网络传输、文件操作、图片处理等领域
 *      - Buffer所有的构造函数都不推荐使用
 *      - 
 * 
 *      - Buffer是对底层内存的操作，buffer的长度一旦固定，就不能再更改
 */

// const buf = Buffer.from('runoob','ascii');

let buf = Buffer.from('learning node')

// console.log(buf.toString());


//创建固定长度的Buffer
let buf2 = Buffer.alloc(10);//创建一个十个字节的buufer
buf2[0] = aa;
console.log(buf2);
console.log(buf2.length);
// Buffer.allocUnsafe() 与alloc一样，可以指定一个buffer的长度，但是分配的内存可能含有敏感数据；
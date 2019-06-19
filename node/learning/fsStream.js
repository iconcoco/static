const fs = require('fs');

//对于传输大量文件的过程，如果只是用读写的方式，会造成程序阻塞，运行变得缓慢
//那么可以使用文件流，将文件变成一节一节流文件传输，就不会产生阻塞

let ws =  fs.createWriteStream('./text.txt');//创建一个文件流通道

//可以进行文件流过程进行监听
ws.once('open',()=>{
    console.log(`文件打开了@！`);
});

ws.once('close',()=>{
    console.log(`文件传输进程关闭`);
});

ws.write(`我要向文件中输入这个东西`);
ws.write(`ssfwer`);
ws.write(`5566`);





ws.end();//文件流传输是一个过程，不能使用close，close将会关闭整个传输程序，end是传输完毕执行关闭任务，减少内存占用；
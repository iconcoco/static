let fs = require('fs');


function readerFiles(file){
    return new Promise((s,e)=>{
        // readFile 是node异步读取文件
        fs.readFile(file,(err,data)=>{
            if(err) e(err);
            s(data);
        })
    })
};


//async 需要声明那个函数是异步函数
async function fn(){
    let f1 = await readerFiles('./1.txt');
    console.log(f1);
    let f2 = await readerFiles('./2.txt');
    console.log(f2);
};

fn();



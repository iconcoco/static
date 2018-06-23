let fs = require('fs');


function readerFiles(file){
    return new Promise((s,e)=>{
        // readFile 是node异步读取文件
        fs.readFile(file,(err,data)=>{
            if(err) e(err);
            s(data);
        })
    })
}

//
readerFiles('./1.txt').then(data=>{
    console.log(data.toString());
    return readerFiles('./2.txt')
}).then(data=>{
    console.log(data.toString())
})
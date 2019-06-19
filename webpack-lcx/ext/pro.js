const fs = require('fs');
const path = require('path');
const prodConfig = require('./pro.unit.js');

module.exports = function(){

    let DOMAIN ="";
    // 同步读写文件，更改host配置
    switch(process.env.type){
        case 'build':{ DOMAIN = prodConfig.prod }break;
        case 'test':{ DOMAIN = prodConfig.test }break;
        case 'dev':{ DOMAIN = prodConfig.dev }break;
    };

    let fd = `
    module.exports={
        login:'${DOMAIN}/index.html',
        carespay:'${DOMAIN}/carespay.html',
        url:'${DOMAIN}'
    }`;

    fs.writeFileSync(path.resolve(__dirname,'./../src/js/domain.js'),fd);
};
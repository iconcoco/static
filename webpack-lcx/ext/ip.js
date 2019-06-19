const interfaces = require('os').networkInterfaces();

let IPAdress = null;
for (let devName in interfaces) {
    let iface = interfaces[devName];

    for(var i=0;i<iface.length;i++){  
        var alias = iface[i];  
        
        if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal && !IPAdress){  
              IPAdress = alias.address;  
        }  
    }  
};

//获取本机的ip地址
module.exports = IPAdress;
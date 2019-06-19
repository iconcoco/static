
const IP = require('./ip.js');
const port = 1005;
const fs = require('fs');
const path = require('path');

let fd = `
module.exports={
    login:'http://${IP}:${port}/index.html',
    carespay:'http://${IP}:${port}/carespay.html',
    url:'http://${IP}:${port}/'
}
`;
//变更开发环境下的domain
fs.writeFileSync(path.join(__dirname,'./../src/js/domain.js'),fd);

module.exports = {
    host:IP,
    port
};
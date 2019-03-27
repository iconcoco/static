const layout = require('./../layout.js');


module.exports = layout.init({title:"CaresPAY金融"}).run({
    body:function(){ return "<div id='App'></div>" },
    head:require('./../common/wxHead.ejs')
});
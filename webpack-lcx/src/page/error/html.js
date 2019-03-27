import layout from './../layout.js';

module.exports = layout.init({title:`502`}).run({
    body:require('./502.ejs'),
    head:require('./errorStyle.ejs')
});
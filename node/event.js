const EventEmitter = require('events').EventEmitter;
const event = new EventEmitter(); //创建一个事件监听的是观察者实例

event.on('dosomething',(pa1,pa2)=>{
    console.log(`事件触发了1!参数是${pa1}--${pa2}`);
});

event.on('dosomething',(pa1,pa2)=>{
    console.log(`事件触发了2!参数是${pa1}--${pa2}`);
});

console.log(`准备触发事件!`);

setTimeout(() => {
    event.emit('dosomething','一条大河','真的触发了');
}, 1000);
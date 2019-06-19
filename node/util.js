const util = require('util');


//1. util.inspect() 将任意对象转化为字符串的方法
function Person(){
    this.name="luolin";
}

let p = new Person();

// console.log(util.inspect(p));

//2. util.isArray()  判定一个对象是不是数组
console.log(util.isArray([]));
console.log(util.isArray(p));

//3. util.isRegExp()  判定一个对象是不是正则
console.log(util.isRegExp(/\d/));
console.log(util.isRegExp(p));

//3. util.isDate()  判定一个对象是不是日期
console.log(util.isDate(new Date()));
console.log(util.isDate(p));
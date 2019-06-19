
/**
 * 
setTimeout(function(){ console.log(6666) },0);

new Promise((resolve,reject)=>{
    console.log(4)
    resolve();
    console.log(5)
}).then(()=>{
    console.log('成功！');
});

console.log(`promise 之后`);

setTimeout(function(){ console.log(77777) },0);

console.log(`setTimeout 之后`);



// 4
// 5
//promise 之后
//setTimeout 之后
// 成功！
// 6666
// 77777



 //使用括号包裹定义函数体，解析器将会以函数表达式的方式去调用定义函数。也就是说，任何能将函数变成一个函数表达式的作法，都可以使解析器正确的调用定义函数。而 ! 就是其中一个，而 + - || 都有这样的功能。
// !function(){
//      console.log(4);
//  }()

const interfaces = require('os').networkInterfaces();

let IPAdress = null;
for(var devName in interfaces){  
  var iface = interfaces[devName]; 
   
  for(var i=0;i<iface.length;i++){  
        var alias = iface[i];  
        console.log(alias);
        
        if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal && !IPAdress){  
              IPAdress = alias.address;  
        }  
  }  
};

// console.log(IPAdress);


console.log(`require之前执行的代码！----------`);
 require('./dist/domain.js');
console.log(`require之后执行的代码！++++++++`);

node 中


let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length:3
};

let arr = Array.from(arrayLike,params=>{
    console.log(params);
});



 function mul(a,b){
     if(!arguments.length) return;

     if(arguments.length<mul.length){

        return function( c ){
            return mul(arguments[0],c);
        }

     }else{
         console.log(`执行代码！`);;
     }
 }



  let arr = [22,55,44];

  let obj={
      name:'jack',
      age:30
  };

  let arr2 = arr.find(function(val,index,arr){
      return val > this.age
  },obj);
  
  console.log(arr2);


let arr = [3,4,5].fill({ name:'jack' });
arr[0].name='lucy';
console.log(arr);//[ { name: 'lucy' }, { name: 'lucy' }, { name: 'lucy' } ]

let arr = [1,1,'1',undefined,undefined,null,null,NaN,NaN,{},{}];
let setArr = new Set(arr);

console.log(Array.from(setArr));


let obj = {
    name:'jack',
    child:{
        name:'lucy',
        age:2
    }
};

let nObj =Object.assign({},obj);

nObj.child.age=6;
console.log(nObj.child === obj.child); //true





class Bromise{

    //静态属性

    constructor( BromiseCallback ){

        BromiseCallback(Bromise.__doThen.bind(this),Bromise.__doCatch.bind(this))
        return this;
    }

    static __doThen(thenResult){
        Bromise.__Result_success = thenResult;
    }

    static __doCatch(errorResult){
        Bromise.__Result.error = errorResult;
    }

    then(thenFunction){
        thenFunction(Bromise.__Result_success);
        return this;
    }

    catch(errorFunction){
        errorFunction(Bromise.__Result_error)
        return this;
    }
};

Bromise.__Result_success = null;
Bromise.__Result_error = null;

let p = new Bromise((resolve,reject)=>{
    console.log(`开始执行`);
    setTimeout(()=>{
        resolve(89658)
    },1000);
}).then(res=>{
    console.log(res)
});

p = null;

console.log([2,5,7,100].includes(7));





let {...n} = obj;
n.name="tracy";

console.log(n);;
console.log(obj);



let obj = {
    name:'jack',
    age:16,
    child:{
        name:'lucy',
        age:10
    }
};

console.log(Object.values(obj));

function Fcc(){

}
Fcc.prototype = {
    constructor:'Fcc',
    run(){
        console.log(`跑`);
        
    },
    id:1003
};


let FT = new Fcc();

console.log(Object.setPrototypeOf(FT,{
    name:'lucy'
}));

console.log(Object.getPrototypeOf(FT));

console.log(Fcc.prototype);

let obj = { name:'jack', age:'16' ,child:{ name:'lucy' }};

console.log(Object.values(obj));  //[ 'jack', '16' ]
function mul(){

    const fn = ()=>{ };

    fn.toString = function(){
        console.log(141);
        return 100
    }

    return fn;
};



// 实现一个add方法，使计算结果能够满足如下预期：
// add(1)(2)(3) = 6;
// add(1, 2, 3)(4) = 10;
// add(1)(2)(3)(4)(5) = 15;

function add() {
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = Array.prototype.slice.call(arguments);

    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var _adder = function() {
        _args.push(...arguments);
        return _adder;
    };

    // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
    _adder.toString = function () {
        return _args.reduce(function (a, b) {
            return a + b;
        });
    }
    return _adder;
}

add(1)(2)(3)                // 6
add(1, 2, 3)(4)             // 10
add(1)(2)(3)(4)(5)          // 15
add(2, 6)(1)                // 9


// add(1, 2, 3)
// add(1)(2)(3) 

function add(a,b,c){
    let params = [...arguments];
    
    if(params.length === add.length){
        return params.reduce((a,b)=>a+b)
    }else{
        return (f)=> add(f,...params)
    }
};



// 柯里化函数

function curry(func){
    if(func.length <= 1) return func;

    const generator = (...args)=>{
        if(args.length === func.length){
            return func(...args);
        }else{
            return (...args2)=>{
                return generator(...args2,...args);
            }
        }
    };

    return generator;
}


const countSum = (a,b,c,d)=>{ console.log( a+b+c+d ) };

let mySum = curry(countSum);

mySum(2, 6)(1)(7);
mySum(2)(6)(1)(7);
mySum(2,6,1)(7);
mySum(2,6)(1,7)
*/
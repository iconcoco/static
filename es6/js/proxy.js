/**
 * Proxy可以理解为代理拦截,意思就是在目标对象上进行一些拦截处理  对象拦截器
 * Proxy传入两个参数 new Proxy(target,handle);
 * 
 * 
 * **/

 let target = {
    age:15
 }

let obj = new Proxy(target,{
    get:(target, key)=>{
        //target 原对象
        //key  访问的对象属性
        // console.log(`获取的的属性是${key}`);
        if(key in target){
            return target[key]
        }else{
            return new ReferenceError('你访问的属性不存在')
        }
        // return Reflect.get(target, key);
    },
    set:(target,key,value)=>{
        //key 访问的对象的属性
        //value  需要对其设置的值
        // console.log(`设置 ${key}! 值为 ${value}`);
        // return Reflect.set(target, key, value);
        if(typeof value == 'string' ){
            target[key] = value;
        }else{
            throw new ReferenceError('名字必须是字符串');
        }
    }
});

try {
    obj.name = 111;
} catch (error) {
    console.log(error)
}
// obj = {
//     name:'jack'
// }
console.log(obj.name);
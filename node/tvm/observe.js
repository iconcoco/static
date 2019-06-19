
function Observe(data){
    if(!data || typeof data !== 'object') return;
    Object.keys(data).forEach(key=>{
            defineReactive(data,key,data[key]);
    });
}

function defineReactive(data,key,val){
    let Deper = new Dep;
    Observe(val);

    Object.defineProperty(data,key,{
        get:function(){
            //设置
            // 由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
            
            Dep.target && Deper.addSub(Dep.target);
            return val
        },
        set:function(value){
            //通知变化
            val = value;
            Deper.notify()
        }
    });
};

//用于装载监听器
function Dep(){
    this.subs = [];
}
Dep.prototype = {
    addSub:function(sub){
        this.subs.push(sub);
    },
    notify:function(){
        this.subs.forEach(sub=>{
            sub.updata();
        });
    }
};

//监听器
function Watcher(vm,exp,cb){
    this.vm = vm;    //指向SelfVue的作用域
    this.exp = exp;  //绑定属性的key值
    this.cb = cb;    //回调函数
    this.value = this.get();    //保存原来的值
}
Watcher.prototype = {
    updata:function(){
        
        // console.log(`我要更新了`);
        var value = this.get(); // 取到最新值
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value; //重新赋值保存
            this.cb.call(this.vm, value, oldVal); // 执行Compile中绑定的回调，更新视图
        }
    },
    get:function(){
        Dep.target = this;  //赋值实例变量  obsever的get中有使用判断 
        var value = this.vm[this.exp];  //这里就会触发obsever的get
        Dep.target = null;
        return value
    }
};

/**--------------------------------------------------- */
let obj = {
    name:'lucy',
    age:66,
    children:{
        name:'jack',
        age:100
    }
};

//就相当于  把数据实例放到 观察者里面
Observe(obj);

//渲染试图
obj.name
// obj.age
new Watcher(obj,'age',function(newValue,oldValue){
    console.log(this);
    console.log(newValue);
    console.log(oldValue);
    console.log(`改变之后要执行的回调函数`);
});
//改变数据
// obj.name = 'jack';
// setTimeout(() => {
//     obj.age = 88;
// }, 2000);

// console.log(Dep.target)

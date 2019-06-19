//公共组件的混入-- 注入混入的组件执行的方法对象

export default ()=>{

    let __Data = {
        name:'',
    };

    return  {
        created(){
            __Data.name = this.$route.name;
            let m =  this.$route.params.reflesh ? null : this.$store.state.Memory[__Data.name];
    
            m?(
                Object.assign(this,m)
            ):(
                this.__LOADING()
            );
                 
        },
        destroyed(){
            let tabArr = this.$store.state.TabList;
            tabArr.forEach(item=>{
                if(item.name==__Data.name){
                    return  this.$store.commit('setModelRecordData',{
                         key:__Data.name,
                         data:this._data
                     });
                }
            });
        }
    }
}
<template>
    <div class="select-container"   @blur="bindSelectBlur" tabindex="0">
        <label @click="bindSelectClick" href="javascript:;" class="select-title">{{title}}</label>
        <ul class="select-option" :class="{active:flag}">
            <li v-for="(item,index) in option" :key="index" @click="bindSelectChange(item.value,item.name)"> {{item.name}}</li>
        </ul>

        <select :name="name"  v-model="seleted">
            <option v-for="(item,index) in option" :key="index" :value="item.value">{{item.name}}</option>
        </select>
    </div>
</template>

<script>
    /**
     * 自定义select组件
     * name:select的name
     * option：数组对象，对应select的option选项的value,name
     * value: 父子组件通信的接收值 父组件中使用v-model
     */
    export default{
        data(){
            return {
                title:'',
                flag:false
            }
        },
        props:{
            name:{
                required:true
            },
            option:{
                required:true,
                type:Array
            },
            value:{//父子组件通信的接收值 父组件中使用v-model

            }
        },
        created() {
            let opt = this.option,
                val = this.value,
                _this = this;
               if(val){
                    opt.forEach(ele=>{
                    ele.value == val && (_this.title = ele.name);
                });
               }else{
                   _this.title = opt[0].name
               }
        },
        methods:{
           bindSelectChange(val,name){
                this.seleted ? (this.seleted = val):(this.title=name,this.seleted = val);
                this.flag = false;
           },
           bindSelectClick(){
               this.flag = !this.flag;
           },
           bindSelectBlur(){
                this.flag = false;
           }
        },
        computed:{
            seleted:{
                get:function(){
                    return this.value
                },
                set:function(val){
                    this.$emit('input',val)
                }
            }
        },
        watch:{
            seleted(newval){
                 let opt = this.option,
                    _this = this;
                 opt.forEach(ele=>{
                    ele.value == newval && (_this.title = ele.name);
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    select{
        display: none;
    }
    .select-container{
        display: inline-block;
        width: 120px;
        height: 30px;
        position: relative;
        &:focus{
            outline: none;
        }
    }
    .select-title{
        vertical-align: top;
        display: inline-block;
        height: 30px;
        line-height: 30px;
        border: 1px solid #eee;
        width: 100%;
        color: #333;
        padding-left: 8px;
        font-size: 14px;
        box-sizing: border-box;
        background: #fff url('../images/carepay/arrow.png') no-repeat 95% center;
        cursor: pointer;
    }

    .select-option{
        position: absolute;
        top: 30px;
        left: 0;
        width: 100%;
        border: 1px solid #eee;
        border-top: 0;
        display: none;
        z-index: 2;
        &.active{
            display: block;
        }
        li{
            height: 30px;
            line-height: 30px;
            background-color: #fff;
            font-size: 14px;
            color: #333;
            padding-left: 8px;
            &:hover{
                background-color: #f8b62d;
                color: #fff;
            }
        }
    }
</style>

<template>
        <label :class="{active:check,'input-radio':this.type=='radio','input-checkbox':this.type=='checkbox'}" :for="id||'input-'+val">
            <!-- {{value}} -->
            <input :type="type" :id="id||'input-'+val" :name="name" :value="val"  v-model="iptvalemodel"/>
        </label>
</template>

<script>

    export default{
        data(){
            return{
                check:(this.value == this.val),
                num:this.val
            }
        },
        props:{
            'type':{
                 required: true
            },
            'val':{
                 required: true
            },
            'name':{
                 required: true
            },
           'value':{},
           'id':{}
        
        },
        methods:{
           
        },
        watch:{
          value(a,b){
              a.indexOf(this.val)>-1 ? (this.check=true) :(this.check=false);
          }  
        },
        computed:{
            iptvalemodel:{
                get:function(){
                    return this.value;
                },
                set:function(val){
                    this.$emit('input', val);
                }
            }
        }
      
        
    }
</script>

<style lang="scss">

    //自定义样式
    .input-radio{
        display: inline-block;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        border: 1px solid #dbdbdb;
        cursor: pointer;
        box-sizing: border-box;
        &.active{
            border-color: #fbb03b;
            position: relative;
            &::after{
                content: '';
                width: 8px;
                height: 8px;
                position: absolute;
                background-color: #fbb03b;
                top: 50%;
                left: 50%;
                border-radius: 50%;
                margin-left: -4px;
                margin-top: -4px;
            }
        }
         input{
            display: none;
        }
    }

     .input-checkbox{
        display: inline-block;
        height: 14px;
        width: 14px;
        border: 1px solid #dbdbdb;
        cursor: pointer;
        box-sizing: border-box;
        &.active{
            border-color: #fbb03b;
            position: relative;
            &::after{
                content: '';
                width: 8px;
                height: 8px;
                position: absolute;
                background-color: #fbb03b;
                top: 50%;
                left: 50%;
                margin-left: -4px;
                margin-top: -4px;
            }
        }
        input{
            display: none;
        }
    }
</style>


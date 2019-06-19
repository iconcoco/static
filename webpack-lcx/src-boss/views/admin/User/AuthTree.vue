<template>
 <transition name="fade">
    <div>
       <div class="auth-container">
            <div class="handle clearfix">
                <h3 class="fl">角色：<span class="no">{{roleName}}</span></h3>
                <el-button type="primary" @click="bindSetAuth" plain class="fr">确认设置</el-button>
            </div>
            <p>权限树：</p>
            <ul class='outside-ul'>
                <li v-for="(item, index) in table" :key="index">
                    <p> 
                        <template v-if="item.childList.length">
                            <span class="fa fa-plus-square"></span>
                            <i class="fa fa-minus-square"></i>
                        </template>
                         
                        <el-checkbox :label="item.id" v-model="checkList" @change="bindTreeChange(item.id)">{{item.authDesc}}</el-checkbox>
                    </p>
                    <ul class='center-ul'>
                        <li v-for="(second,sindex) in item.childList" :key="`${index}-${sindex}`">
                            <p> 
                                <template v-if="second.childList.length">
                                    <span class="fa fa-plus-square"></span>  
                                    <i class="fa fa-minus-square"></i>  
                                </template>

                                <el-checkbox :label="second.id" @change="bindTreeChange(item.id,second.id)" v-model="checkList">{{second.authDesc}}</el-checkbox>
                            </p>
                            <ul class="inner-ul">
                                <li v-for="(last, tindex) in second.childList" :key="`${index}-${sindex}-${tindex}`">
                                    <p><el-checkbox :label="last.id" @change="bindTreeChange(item.id,second.id,last.id)"  v-model="checkList">{{last.authDesc}}</el-checkbox></p>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>

       </div>
    </div>
 </transition>
</template>

<script>
// loadRoleAuthTree
import $ from 'jquery';
 import { loadRoleAuthTree,setAuth } from '../../../utils/axios/api.js';
 import { ArrayFilter } from '../../../utils/common.js';

 let Auth = {
     init:function(){
         this._event.bindAuthSlider();
     },
     _event:{
         bindAuthSlider:function(){
             $('.outside-ul').on('click','p span,p i',function(e){
                 e.stopPropagation();

                 let _this = $(this).parent('p');

                 if(_this.hasClass('active')){
                     _this.removeClass('active');
                     _this.siblings('ul').slideDown(300)
                 }else{
                    _this.addClass('active');
                     _this.siblings('ul').slideUp(300)
                 }
            });
         }
     }
 };

    function findId(...arg){
        let childList = null,
            box = [],
            auth = [];
       (function fillter(arr,id){
            if(!arr || !arr.length) return
            arr.forEach(ele => {
                box.push(ele.id);

                if(ele.isSelectd==1){
                    auth.push(ele.id)
                }

                if(ele.id == id){
                    return childList = ele.childList;
                }
                fillter(ele.childList,id);
            });
        })(arg[0],arg[1]);

        let t = arg.length;
        if(t==3){
            return auth;
        }else if(t==2){
            return childList;
        }else{
            return box;
        }
    }


    export default{
        data(){
            return{
                table:[],
                checkList:[],
                roleId:null,
                roleName:'',
            }
        },
        created(){
            let params = this.$route.params

            if(!params.roleId) return this.$router.push({name:'Role'});
            this.roleId = params.roleId;
            this.roleName = params.roleName;

            loadRoleAuthTree({roleId:params.roleId}).then(res=>{
                 if(res.code==0){
                    this.table = res.data.childList;
                    this.checkList = findId(this.table,0,0);
                    
                 }else{
                     this.$message.error(res.msg);
                 }
            })
        },
        mounted() {
            Auth.init();
        },
        methods:{
            bindTreeChange(...arg){
                
                let id = arg[arg.length-1],                 
                    bol =  this.checkList.indexOf(id)>-1, //当前是否选择
                    ids = findId(findId(this.table,id)), //当前选择的下面的所有的id
                    chec = this.checkList;

                if(bol){
                    this.checkList =  ArrayFilter(chec.concat(arg,ids)) ;
                }else{
                    ids.push(id);   //需要移除的id

                    this.checkList = this.checkList.filter(item=>{
                        let flag = true;
                        ids.forEach(inner=>{
                            if(inner == item){flag = false};
                        });

                        if(flag) return item;
                    });
                }

            },
            //给角色设置权限
            bindSetAuth(){
                let setAuthSubVoList = [];
                this.checkList.forEach(i =>{
                    setAuthSubVoList.push({
                        roleId:this.roleId,
                        authId:i
                    });
                });

                setAuth({
                    "authSubVoList":setAuthSubVoList
                }).then(res=>{
                    if(res.code==0){
                         this.$message.success(`设置成功！`);
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .auth-container{
        background-color: #fff;
        padding: 20px;
        .handle{
            .el-button{
                margin-top: 10px;
            }
        }
        h3{
            height: 60px;
            line-height: 60px;
            font-weight: normal;
        }
        li{
            line-height: 30px;
            // border-left: 1px solid #dbdbdb;
            position: relative;
            // &::before{
            //     content:"";
            //     position: absolute;
            //     width: 1px;
            //     height: 100%;
            //     background-color: #dbdbdb;
            //     top: 9px;
            //     left: 6px;
            // }
            p{
                border:1px solid #dbdbdb;
                margin-top:-1px;
                span{
                    display:none;
                }

                span,i{
                    color:#f8b62b;
                    cursor:pointer;
                }
                &.active{
                    span{
                        display:inline;
                    }
                    i{
                        display:none;
                    }
                }
            }
        }

    }


    .outside-ul{
        width:50%;
        margin:0 auto;
        p{
            padding-left:10px;
        }
    }
    .center-ul{
        p{
            padding-left:50px;
        }
    }
    .inner-ul{
        p{
            padding-left:100px;
        }
    }
</style>


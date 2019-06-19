<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form class="admin-form-inline subAccount-form" :inline="true" :model="form">

                    <el-form-item class="data" label="开始时间：">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="form.startDate"
                            type="date"
                            placeholder="请选择开始时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item class="data" label="结束时间：">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="form.endDate"
                            type="date"
                            placeholder="请选择结束时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="来源渠道：">
                        <el-select v-model="form.platForm" placeholder="请选择来源渠道">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="销售获客" value="1"></el-option>
                        <el-option label="市场推广" value="2"></el-option>
                        <el-option label="搜索引擎" value="3"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="用户类型：">
                        <el-select v-model="form.type" placeholder="请选择统计用户类型">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="注册用户" value="1"></el-option>
                        <el-option label="有效用户" value="2"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-button @click="loadingQuery" type="primary" plain>查询</el-button>
                    <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
        </div>
        <!-- 全部 -->
        <div v-show="platForm==0" class="clearfix">
            <div v-show="type==0 || type== 1" class="table-container index-db">
                <div class="admin-tab-title" >注册用户来源</div>
                <div class="map">
                    <Pie TID="P_SOURCE" :data="P_SOURCE" :text="{
                        title:'注册用户来源统计',
                        tip:'注册用户来源'
                    }"></Pie>
                </div>
            </div>

            <div v-show="type==0 || type== 2" class="table-container index-db mr_0">
                <div class="admin-tab-title" >有效用户来源</div>
                <div class="map">
                    <Pie TID="T_SOURCE" :data="T_SOURCE" :text="{
                        title:'有效用户来源统计',
                        tip:'有效用户来源'
                    }"></Pie>
                </div>
            </div>
        </div>

        <!-- 销售 -->
        <div v-show="platForm==1" class="clearfix">
            <div v-show="type==0 || type== 1" class="table-container index-db">
                <div class="admin-tab-title" >销售获客-注册用户</div>
                <div class="map">
                     <Pie TID="P_SALE_SOURCE" :data="P_SALE_SOURCE" :text="{
                        title:'销售获客-注册用户来源统计',
                        tip:'注册用户来源'
                    }"></Pie>
                </div>
            </div>

            <div v-show="type==0 || type== 2" class="table-container index-db mr_0">
                <div class="admin-tab-title" >销售获客-有效用户</div>
                <div class="map">
                    <Pie TID="T_SALE_SOURCE" :data="T_SALE_SOURCE" :text="{
                        title:'销售获客-有效用户',
                        tip:'有效用户来源'
                    }"></Pie>
                </div>
            </div>
        </div>

        <!-- 市场推广 -->
        <div v-show="platForm==2" class="clearfix">
            <div v-show="type==0 || type== 1" class="table-container index-db">
                <div class="admin-tab-title" >市场推广-注册用户</div>
                <div class="map">
                     <Pie TID="P_MARKET_SOURCE" :data="P_MARKET_SOURCE" :text="{
                        title:'市场推广-注册用户',
                        tip:'注册用户来源'
                    }"></Pie>
                </div>
            </div>

            <div v-show="type==0 || type== 2" class="table-container index-db mr_0">
                <div class="admin-tab-title" >市场推广-有效用户</div>
                <div class="map">
                    <Pie TID="T_MARKET_SOURCE" :data="T_MARKET_SOURCE" :text="{
                        title:'市场推广-有效用户',
                        tip:'注册用户来源'
                    }"></Pie>
                </div>
            </div>
        </div>

        <!-- 搜索引擎 -->
        <div v-show="platForm==3" class="clearfix">
            <div v-show="type==0 || type== 1" class="table-container index-db">
                <div class="admin-tab-title" >搜索引擎-注册用户</div>
                <div class="map">
                    <Pie TID="P_SEO_SOURCE" :data="P_SEO_SOURCE" :text="{
                        title:'搜索引擎-注册用户',
                        tip:'注册用户来源'
                    }"></Pie>
                </div>
            </div>

            <div v-show="type==0 || type== 2" class="table-container index-db mr_0">
                <div class="admin-tab-title" >搜索引擎-有效用户</div>
                <div class="map">
                     <Pie TID="T_SEO_SOURCE" :data="T_SEO_SOURCE" :text="{
                        title:'搜索引擎-有效用户',
                        tip:'注册用户来源'
                    }"></Pie>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
  import {
      queryUserStaticList,      //每月注册来源
      saleUserSource,      //销售用户来源统计
      extensionUserSource,      //市场推广用户来源统计
      seoUserSource,      //搜索引擎用户来源统计
    } from '../../../utils/axios/api.js';

import { custemerSource } from '../../../ext/localBase.js';

import {formatTimer} from '../../../utils/common.js';

import Pie from './../DashBoard/Pie.vue';

export default {
    data(){
        return{
            form:{
                startDate:'',
                endDate:'',
                platForm:'0',
                type:'0',
            },
            platForm:"0",
            type:"0",


            P_SOURCE:{},
            T_SOURCE:{},

            P_SALE_SOURCE:{},
            T_SALE_SOURCE:{},

            P_MARKET_SOURCE:{},
            T_MARKET_SOURCE:{},

            P_SEO_SOURCE:{},
            T_SEO_SOURCE:{},

            custemerSource:{}
        }
    },
    components:{
        Pie
    },
    created(){
         let flag = this.$route.params.flag;
        if(!flag) return this.$router.push({name:'index'});

        custemerSource().then(res=>{ this.custemerSource = res });

        this.reset();
        this.loadingQuery();
    },
    methods:{
        loadingQuery(){
            switch(Number(this.form.platForm)){
                case 0:
                {   //全部
                   queryUserStaticList(this.form).then(res=>{
                       if(res.code==0){
                            this.platForm =  this.form.platForm; 
                            this.type =  this.form.type;

                            let P_SOURCE = {};
                            let T_SOURCE = {}; //有效用户来源
                            
                            res.data.map(item=>{
                                let k_name = null;

                                k_name = this.custemerSource[item.source];

                                k_name != null &&  (
                                    P_SOURCE[k_name] = {
                                        value:item.newsuer,
                                        name:k_name
                                    },
                                    T_SOURCE[k_name]={
                                        value:item.validuser,
                                        name:k_name
                                    });
                            });

                            this.P_SOURCE = P_SOURCE;
                            this.T_SOURCE = T_SOURCE;
                       }else{
                           this.$message.error(res.msg);
                       }
                   });
                }
                break;
                case 1:
                {   //销售获客
                    saleUserSource(this.form).then(res=>{
                        if(res.code==0){
                            this.platForm =  this.form.platForm;
                            this.type =  this.form.type;


                            let P_SOURCE = {};
                            let T_SOURCE = {}; //有效用户来源

                            res.data.map(item=>{
                                let k_name = null;

                                //名字中文
                                k_name = item.source;

                                k_name != null &&  (
                                    P_SOURCE[k_name] = {
                                        value:item.newsuer,
                                        name:k_name
                                    },
                                    T_SOURCE[k_name]={
                                        value:item.validuser,
                                        name:k_name
                                    });
                            });

                            this.P_SALE_SOURCE = P_SOURCE;
                            this.T_SALE_SOURCE = T_SOURCE;

                        }else{
                            this.$message.error(res.msg);
                        }
                    });
                }
                break;
                case 2:
                {   //市场推广
                    extensionUserSource(this.form).then(res=>{
                        if(res.code==0){

                            this.platForm =  this.form.platForm;
                            this.type =  this.form.type;


                            let P_SOURCE = {};
                            let T_SOURCE = {}; //有效用户来源

                            res.data.map(item=>{
                                let k_name = null;

                                //名字中文
                                k_name = this.custemerSource[item.source];

                                k_name != null &&  (
                                    P_SOURCE[k_name] = {
                                        value:item.newsuer,
                                        name:k_name
                                    },
                                    T_SOURCE[k_name]={
                                        value:item.validuser,
                                        name:k_name
                                    });
                            });

                            this.P_MARKET_SOURCE = P_SOURCE;
                            this.T_MARKET_SOURCE = T_SOURCE;

                        }else{
                            this.$message.error(res.msg);
                        }
                    });
                }
                break;
                case 3:
                {   //搜索引擎
                    seoUserSource(this.form).then(res=>{
                        if(res.code==0){
                             this.platForm =  this.form.platForm;
                            this.type =  this.form.type;

                            let P_SOURCE = {};
                            let T_SOURCE = {}; //有效用户来源


                            res.data.map(item=>{
                                let k_name = null;

                                //名字中文
                                k_name = item.source;

                                k_name != null &&  (
                                    P_SOURCE[k_name] = {
                                        value:item.newsuer,
                                        name:k_name
                                    },
                                    T_SOURCE[k_name]={
                                        value:item.validuser,
                                        name:k_name
                                    });
                            });


                            this.P_SEO_SOURCE = P_SOURCE;
                            this.T_SEO_SOURCE = T_SOURCE;


                        }else{
                            this.$message.error(res.code);
                        }
                    });
                }
                break;
            }
        },
        reset(){

            let D = new Date();

            let y = D.getFullYear(),
                m = D.getMonth()+1,
                d = D.getDate(),
                YY = y,
                MM = m < 10 ? '0'+m : m,
                DD = d < 10 ? '0'+d : d;

            this.form = {
                startDate:`${YY}-${MM}-01`,
                endDate:`${YY}-${MM}-${DD}`,
                platForm:'0',
                type:'0',
            };
        },
    }
}
</script>

<style lang="scss" scoped>
  .table-container{
        .el-form-item{
            margin-bottom: 0px;
        }
        &.index-db{
            display: block;
            width: 49.5%;
            float: left;
            margin-right: 10px;
            margin-bottom: 0px;
             &.mr_0{
                margin-right: 0;
            }
        }
        .map{
            height: 420px;
        }
    }
</style>



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

                 <el-form-item label="统计标准：">
                    <el-select v-model="form.optionStatus" placeholder="请选择统计标准">
                      <el-option label="全部" value="0"></el-option>
                      <el-option label="店铺转化率统计" value="1"></el-option>
                      <el-option label="新增店铺详情统计" value="2"></el-option>
                      <el-option label="流失店铺详情统计" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
        </div>

            <!-- 表盘统计 -->
        <div v-show="optionStatus==1 || optionStatus==0" class="clearfix" style="margin-bottom:10px;">
              <div class="table-container index-db">
                <div class="admin-tab-title">总店铺统计</div>
                <div class="map">
                    <Funnel :data="M_AllSTORY" TID="M_AllSTORY"></Funnel>
                </div>
            </div>

            <div style="margin-right:0px;" class="table-container index-db">
                <div class="admin-tab-title">新增店铺统计</div>
                <div class="map">
                    <Funnel :data="M_STORY" TID="M_STORY"></Funnel>
                </div>
            </div>
        </div>

          <!-- 新增店铺详情统计 -->
       <div class="table-container" v-if="optionStatus==2 || optionStatus==0">
           <div class="admin-tab-title" >新增店铺详情统计</div>
            <!-- 查询结果 -->
            <el-table :data="addTable" border>
                <el-table-column label="序号">
                    <template slot-scope="scoped">
                        <span>{{scoped.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="storeName" label="店铺名称"></el-table-column>
                <el-table-column prop="platform" label="店铺所属平台"></el-table-column>
                <el-table-column prop="name" label="店铺所属客户名（KYC主体姓名）"></el-table-column>
                <el-table-column prop="isValid" label="是否有效"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scoped">
                        <a @click="bindToStoreDE(scoped.row.storeId)" class="primary" href="javascript:;">查看详情</a>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 页码组件 -->
            <Pagination 
                :page="addForm.pageNum"
                :pageSize="addForm.pageSize"
                :count="addForm.totalSize"
                :chosefallback="pageChange_add"
            ></Pagination>
       </div>

         <!-- 流失店铺详情统计 -->
       <div class="table-container" v-if="optionStatus==3 || optionStatus==0">
           <div class="admin-tab-title" >新增店铺详情统计</div>
            <!-- 查询结果 -->
            <el-table :data="lossTable" border>
                <el-table-column label="序号">
                    <template slot-scope="scoped">
                        <span>{{scoped.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="storeName" label="店铺名称"></el-table-column>
                <el-table-column prop="platform" label="店铺所属平台"></el-table-column>
                <el-table-column prop="name" label="店铺所属客户名（KYC主体姓名）"></el-table-column>
                <el-table-column prop="isValid" label="是否有效"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scoped">
                        <a @click="bindToStoreDE(scoped.row.storeId)"  class="primary" href="javascript:;">查看详情</a>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 页码组件 -->
            <Pagination 
                :page="lossForm.pageNum"
                :pageSize="lossForm.pageSize"
                :count="lossForm.totalSize"
                :chosefallback="pageChange_loss"
            ></Pagination>
       </div>

    </div>
</template>

<script>
  import {
        queryNewAllStoreCount,//新店铺统计
        queryAllStoreCount,//总店铺统计
        queryStoreStatistics,//新增店铺详情统计
        queryLossStore,//流失店铺详情统计
    } from '../../../utils/axios/api.js';

import Funnel from './../DashBoard/Funnel.vue';

export default {
    data(){
        return{
            form:{
                startDate:'',
                endDate:'',
                optionStatus:'0',
            },
            addForm:{
                pageNum:1,
                pageSize:10,
                totalSize:1
            },
            lossForm:{
                pageNum:1,
                pageSize:10,
                totalSize:1
            },
            addTable:[],
            lossTable:[],




            optionStatus:'0',

            M_AllSTORY:[],
            M_STORY:[],
        }
    },
    components:{
        Funnel
    },
    created(){
        let flag = this.$route.params.flag;
        if(!flag) return this.$router.push({name:'index'});

        this.reset();
        this.loadingQuery();
    },
    methods:{
        loadingQuery(){
            switch(Number(this.form.optionStatus)){
                case 0:
                {
                    this.queryAll();
                    this.queryStoreStatistics();
                    this.queryLossStore();

                }
                break;
                case 1:
                {
                     this.queryAll();
                }
                break;
                case 2:
                {
                     this.queryStoreStatistics();
                }
                break;
                case 3:
                {
                    this.queryLossStore();
                }
                break;
            }
        },
        queryAll(){
            Promise.all([
                queryNewAllStoreCount(this.form),   //新
                queryAllStoreCount(this.form),      //总
            ]).then(resp=>{
                resp.map((res,index)=>{
                    if(res.code==0){

                        this.optionStatus = this.form.optionStatus;

                        switch(index){
                            case 0:{
                                 let M_STORY =[];
                                for (const k in  res.data) {
                                    let name = null,
                                        i = null;

                                    k=='allnums' && (name="新增店铺",i=0);
                                    k=='authcount' && (name="新增已授权店铺",i=1);
                                    k=='validcount' && (name="新增有效店铺",i=2);

                                    M_STORY.push({
                                        value:res.data[k],
                                        name,
                                        i
                                    })
                                };

                                M_STORY.sort(function(a,b){return a.i-b.i});

                                this.M_STORY = M_STORY;
                            }break;
                            case 1:{
                                 let M_AllSTORY =[];
                                for (const k in  res.data) {
                                    let name = null,
                                        i = null;

                                    k=='allNum' && (name="总店铺数",i=0);
                                    k=='authorizeNum' && (name="已授权店铺",i=1);
                                    k=='validNum' && (name="有效店铺",i=2);

                                    M_AllSTORY.push({
                                        value:res.data[k],
                                        name,
                                        i
                                    })
                                };

                                M_AllSTORY.sort(function(a,b){return a.i-b.i});

                                this.M_AllSTORY = M_AllSTORY;
                            }break;
                        }
                        
                       
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            });
        },
        queryStoreStatistics(){
             let params = Object.assign({},this.form,this.addForm);
                params.pageNum -= 1;
            queryStoreStatistics(params).then(res=>{
                if(res.code==0){
                    this.optionStatus = this.form.optionStatus;

                    this.addTable = res.data.list;
                    this.addForm.totalSize = res.data.totalSize;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        queryLossStore(){
             let params = Object.assign({},this.form,this.lossForm);
                params.pageNum -= 1;
            queryLossStore(params).then(res=>{
                if(res.code==0){
                    this.optionStatus = this.form.optionStatus;

                    this.lossTable = res.data.list;
                    this.lossForm.totalSize = res.data.totalSize;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindToSubmit(){
            this.addForm.pageNum = 1;
            this.lossForm.pageNum = 1;
            this.loadingQuery();
        },
        reset(){
            let D = new Date();

            let y = D.getFullYear(),
                m = D.getMonth()+1,
                d = D.getDate(),
                YY = y,
                MM = m < 10 ? '0'+m : m,
                DD = d < 10 ? '0'+d : d;

            this.form.startDate = `${YY}-${MM}-01`;
            this.form.endDate = `${YY}-${MM}-${DD}`;
            this.form.optionStatus = "0";
        },
        pageChange_add(n,pageSize){
            this.addForm.pageNum = n;
            this.addForm.pageSize = pageSize;
            this.loadingQuery();
        },
        pageChange_loss(n,pageSize){
            this.lossForm.pageNum = n;
            this.lossForm.pageSize = pageSize;
            this.loadingQuery();
        },
        bindToStoreDE(storeId){
            this.$router.push({
                name:"storeDetails",
                params:{
                    storeId
                }
            })
        }
    }
}
</script>


<style lang="scss" scoped>
  .table-container{
        &:last-child{
            margin-bottom: 0px;
        }
        .el-form-item{
            margin-bottom: 0px;
        }
        &.index-db{
            display:block;
            width: 49.5%;
            float: left;
            margin-right: 10px;
            margin-bottom: 0px;
        }
        .map{
            height: 420px;
        }
    }
</style>

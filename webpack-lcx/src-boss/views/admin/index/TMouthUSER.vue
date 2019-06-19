<template>
    <div class="fadeIn clearfix">
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
                    <el-select v-model="optionStatus" placeholder="请选择统计标准">
                      <el-option label="全部" value="0"></el-option>
                      <el-option label="用户转化率统计" value="1"></el-option>
                      <el-option label="新增用户详情统计" value="2"></el-option>
                      <el-option label="流失客户详情统计" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
       </div>
        <!-- 表盘统计 -->
        <div v-show="form.optionStatus==1 || form.optionStatus==0" class="clearfix" style="margin-bottom:10px;">
            <div  class="table-container index-db">
                <div class="admin-tab-title">新增用户统计</div>
                <div class="map">
                    <Funnel :data="M_USER" TID="M_USER"></Funnel>
                </div>
            </div>

            <div  style="margin-right:0px;" class="table-container index-db">
                <div class="admin-tab-title">总用户统计</div>
                <div class="map">
                    <Funnel :data="M_ALLUSER" TID="M_ALLUSER"></Funnel>
                </div>
            </div>
        </div>
        <!-- 数据表格 -->
       <div class="table-container" v-if="form.optionStatus==2 || form.optionStatus==0">
           <div class="admin-tab-title" >新增客户详情统计</div>
          
            <!-- 查询结果 -->
            <el-table :data="addTable" border>
                <el-table-column label="序号">
                    <template slot-scope="scoped">
                        <span>{{scoped.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="customerNo" label="客户ID"></el-table-column>
                <el-table-column prop="customerName" label="客户名称（KYC主体名称）"></el-table-column>
                <el-table-column prop="isValid" label="是否有效"></el-table-column>
                <el-table-column prop="source" label="用户来源"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scoped">
                        <a class="primary" @click="bindToDet(scoped.row.customerNo)" href="javascript:;">查看详情</a>
                    </template>
                </el-table-column>
            </el-table>

              <Pagination 
                :page="addForm.pageNum"
                :pageSize="addForm.pageSize"
                :count="addForm.totalSize"
                :chosefallback="pageChange_add"
            ></Pagination>
       </div>

       <div class="table-container" v-if="form.optionStatus==3 || form.optionStatus==0">
            <div class="admin-tab-title" >流失客户详情统计</div>
            <!-- 查询结果 -->
            <el-table :data="lossTable" border>
                <el-table-column label="序号">
                    <template slot-scope="scoped">
                        <span>{{scoped.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="customerNo" label="客户ID"></el-table-column>
                <el-table-column prop="customerName" label="客户名称（KYC主体名称）"></el-table-column>
                <el-table-column prop="isValid" label="流失类型"></el-table-column>
                <el-table-column prop="source" label="用户来源"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scoped">
                        <a class="primary" @click="bindToDet(scoped.row.customerNo)" href="javascript:;">查看详情</a>
                    </template>
                </el-table-column>
            </el-table>

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
        queryUserDailiesByTimeFrame,
        qeruyUserDailiesNum,
        queryCustomerStatistics,//新增客户详情
        queryLossCustomer,//流失用户详情统计
    } from '../../../utils/axios/api.js';

    import Funnel from './../DashBoard/Funnel.vue';

    export default{
        data(){
            return{
                form:{
                    startDate:'',
                    endDate:'',
                    optionStatus:'1',

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
                optionStatus:"0",
                M_USER:[],
                M_ALLUSER:[],
                addTable:[],
                lossTable:[]
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
                switch(Number(this.optionStatus)){
                    case 0:{
                        this.queryAll();
                        this.queryCustomerStatistics();
                        this.queryLossCustomer();
                    }break;
                    case 1:{
                         this.queryAll();
                    }break;
                    case 2:
                    {   //新增客户详情
                        this.queryCustomerStatistics();
                    }
                    break;
                    case 3:
                    {   //流失用户详情统计
                        this.queryLossCustomer();
                    }
                    break;
                }
                
            },
            queryAll(){
                let params = Object.assign({},this.form);

                Promise.all([
                    queryUserDailiesByTimeFrame(params),
                    qeruyUserDailiesNum(params),
                ]).then(resp=>{
                    this.form.optionStatus = this.optionStatus;//显示的试图组件
                    resp.map((res,index)=>{
                                if(res.code==0){
                                    switch(index){
                                        case 0:
                                        {
                                            let M_USER =[];
                                        for (const k in  res.data) {
                                            let name = null,
                                                i = null;
                                            k=='applicantcount' && (name="新增实名认证客户",i=1);
                                            k=='registercount' && (name="新注册用户用户",i=0);
                                            k=='validcount' && (name="新增有效用户",i=2);

                                            M_USER.push({
                                                value:res.data[k],
                                                name,
                                                i
                                            })
                                        };

                                            M_USER.sort(function(a,b){return a.i-b.i});

                                            this.M_USER = M_USER;
                                        }
                                        break;
                                        case 1:
                                        {
                                            let M_ALLUSER = [];
                                        for (const k in  res.data) {
                                            let name = null,
                                                i = null;
                                            k=='applicantUser' && (name="已实名认证客户",i = 1);
                                            k=='newUser' && (name="注册用户",i = 0);
                                            k=='validUser' && (name="有效客户",i = 2);

                                            M_ALLUSER.push({
                                                // value:Math.random()*10,
                                                value:res.data[k],
                                                name,
                                                i
                                            });
                                        };
                                        // 顺序排列
                                            M_ALLUSER.sort(function(a,b){return a.i-b.i});

                                            this.M_ALLUSER = M_ALLUSER;
                                        }
                                        break;
                                    }
                                }else{
                                    this.$message.error(res.msg);
                                }
                    })
                });
            },
            queryCustomerStatistics(){
                let params = Object.assign({},this.form,this.addForm);
                params.pageNum -= 1;
                queryCustomerStatistics(params).then(res=>{
                     if(res.code==0){
                        this.form.optionStatus = this.optionStatus;//显示的试图组件
                        this.addTable = res.data.list;
                        this.addForm.totalSize = res.data.totalSize;
                     }else{
                          this.$message.error(res.msg);
                     }
                 });
            },
            queryLossCustomer(){
                 let params = Object.assign({},this.form,this.lossForm);
                params.pageNum -= 1;
                queryLossCustomer(params).then(res=>{
                    if(res.code==0){
                       this.form.optionStatus = this.optionStatus;//显示的试图组件
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
                this.loadingQuery(this.form);
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
                this.optionStatus = "0";
            },
            pageChange_add(n,pageSize){
                this.addForm.pageNum = n;
                this.addForm.pageSize = pageSize;
                this.loadingQuery(this.form);
            },
            pageChange_loss(n,pageSize){
                this.lossForm.pageNum = n;
                this.lossForm.pageSize = pageSize;
                this.loadingQuery(this.form);
            },
            bindToDet(customerNo){
                this.$router.push({
                    name:"customerDetails",
                    params:{
                        customerNo
                    }
                })
            }
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
        }
        .map{
            height: 420px;
        }
    }
</style>

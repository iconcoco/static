<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form class="admin-form-inline subAccount-form" :inline="true" :model="form">

                 <el-form-item label="客户ID：">
                    <el-input v-model="form.customerNo" placeholder="请输入客户ID"></el-input>
                </el-form-item>

                 <el-form-item label="客户名称：">
                    <el-input v-model="form.name" placeholder="请输入客户名称"></el-input>
                </el-form-item>

                 <el-form-item label="客户类型：">
                    <el-select v-model="form.type" placeholder="请选择客户类型">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="1" label="个人客户"></el-option>
                        <el-option value="2" label="企业客户"></el-option>
                    </el-select>
                </el-form-item>

                  <el-form-item label="注册手机：" >
                    <el-input  v-model="form.phoneNo" placeholder="请输入手册手机号"></el-input>
                </el-form-item>

                <el-form-item label="客户状态：">
                    <el-select v-model="form.status" placeholder="请选择客户状态">
                        <el-option v-for="(item,index) in customerStatus" :key="index"
                            :label="item.name"
                            :value="item.status"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="客户所属销售：" v-if="roleCode != 'sales'" class="customer_sale_item" >
                    <el-select v-model="form.salers" placeholder="请选择客户所属销售">
                        <el-option value="" label="全部"></el-option>
                        <el-option 
                            v-for="(item,index) in sales" 
                            :key="index"
                            :label="item.userName"
                            :value="item.source"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
        </div>

        <div class="table-container">
            <div class="admin-tab-title">客户信息管理</div>

            <el-table :data="table" border >
                <el-table-column width="175" prop="customerNo" label="客户ID"></el-table-column>
                <el-table-column  label="客户类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==1">个人客户</span>
                        <span v-if="scope.row.type==2">企业客户</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="客户名称"></el-table-column>
                <el-table-column prop="realName" label="真实名字">
                    <template slot-scope="scope">
                        <el-input style="width:90%" :value="scope.row.realName || scope.row.name" @blur="(e)=>{ return bindChangeCustomerName(scope.row.customerNo,e) }"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="客户状态">
                     <template slot-scope="scope">
                         {{customerStatusName(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column prop="phoneNo" label="注册手机"></el-table-column>
                <el-table-column prop="stores" label="绑定店铺数"></el-table-column>
                <el-table-column prop="cashAmount" label="免费提现额度"></el-table-column>
                <el-table-column width="175" prop="createdTime" label="注册时间"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <a @click="bindToCustomerDe(scope.row.customerNo)" class="primary" href="javascript:;">查看详情</a>   
                    </template>
                </el-table-column>
            </el-table>

              <Pagination 
                :page="form.pageNum"
                :pageSize="form.pageSize"
                :count="form.totalSize"
                :chosefallback="pageChange"
            ></Pagination>
        </div>
    </div>
</template>

<script>
    
    import { queryAllSalesData,custemerStatus } from '../../../ext/localBase.js'

    import {
        customerInfo,
        updateCustomerName
    } from '../../../utils/axios/api.js';

    import mixin from '../../../ext/mixin.js';

    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                    customerNo:'',
                    type:'',
                    name:'',
                    phoneNo:'',
                    status:'',
                    salers:'',
                    level:'',

                    pageNum:'1',
                    pageSize:'10',
                    totalSize:'1'
                },
                table:[],
                sales:[],
                customerStatus:custemerStatus,
                roleCode:this.$store.state.baseData.USERINFO.roleCode,
            }
        },
        created(){
            this.$route.name == 'AllcustomerInfo' ? (this.form.level = "1") : (this.form.level = "");
        },  
        methods:{
            __LOADING(){
                this.loadingQuery(this.form),
                queryAllSalesData().then(res=>{
                    this.sales = res;
                });
            },
            loadingQuery(params){
                customerInfo(params).then(res=>{
                    if(res.code==0){
                        this.table = res.data;
                        this.form.totalSize = res.page.total;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            bindToSubmit(){
                 this.form.pageNum = 1;
                 this.loadingQuery(this.form);
            },
            reset(){
                let n = ['pageNum','pageSize','totalSize','level'];
                for (const key in this.form) {
                    if(n.indexOf(key)<0){
                        this.form[key] = "";
                    }
                }
            },
            bindToCustomerDe(customerNo){

                this.$router.push({
                    name:'customerDetails',
                    params:{
                        customerNo,
                        level:this.form.level
                    }
                });

            },
            bindChangeCustomerName(customerNo,e){

                updateCustomerName({
                    name:e.target.value,
                    customerNo
                }).then(res=>{
                    if(res.code==0){
                        this.$message.success('修改成功！');
                    }else{
                        this.$message.error(res.msg);
                        this.table.forEach(item=>{
                            if(item.customerNo==customerNo){
                                e.target.value = item.realName
                            };
                        });
                    }
                })
            },
             //页码选择的时候
            pageChange(n,pageSize){
                this.form.pageNum = n;
                this.form.pageSize = pageSize;
                this.loadingQuery(this.form);
            },
            customerStatusName(code){
                let str=null
                this.customerStatus.forEach(item=>{
                    if(item.status==code) str = item.name;
                });

                return str;
            }
        }
    }
</script>


<style lang="scss">
    .admin-form-inline.subAccount-form{
        .customer_sale_item{
             .el-form-item__label{
                 width: 110px;
            }
        }
    }
</style>


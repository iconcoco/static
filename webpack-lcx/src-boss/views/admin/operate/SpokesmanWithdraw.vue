<template>
 <transition name="fade">
    <div>
       <div class="table-container KYC-index">
            <el-form class="admin-form-inline subAccount-form" :inline="true" :model="form">

                <el-form-item label="账户类型：">
                    <el-select v-model="form.type" placeholder="">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="支付宝" value="1"></el-option>
                      <el-option label="银行卡" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="提现时间：">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.createTime"
                        type="date"
                        placeholder="提现时间">
                    </el-date-picker>
                </el-form-item>

                 <el-form-item label="客户姓名：">
                        <el-input v-model="form.name" placeholder="客户姓名"></el-input>
                </el-form-item>

                <template>
                    <el-form-item label="支付宝：">
                        <el-input v-model="form.accountZfb" placeholder="请输入支付宝账号"></el-input>
                    </el-form-item>
                </template>

                <template>
                    <el-form-item label="开户人：">
                        <el-input v-model="form.accountName" placeholder="请输入开户人姓名"></el-input>
                    </el-form-item>

                    <el-form-item label="银行卡号：">
                        <el-input v-model="form.accountYh" placeholder="请输入银行卡号"></el-input>
                    </el-form-item>
                </template>

                <el-form-item label="提现状态：">
                    <el-select v-model="form.status" placeholder="请选择提现状态">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="待处理" value="1"></el-option>
                      <el-option label="已完成" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
        </div>
        
        <div  class="table-container">
            <div class="admin-tab-title">代言人活动提现记录表</div>

            <el-table :data="table" border>
                <el-table-column prop="name" label="客户姓名"></el-table-column>
                <el-table-column prop="phoneNo" label="注册手机号"></el-table-column>
                <el-table-column prop="accountZfb" label="支付宝账号"></el-table-column>
                <el-table-column prop="accountYh" label="银行卡号"></el-table-column>
                <el-table-column prop="amountYcl" label="累计已处理提现金额"></el-table-column>
                <el-table-column prop="amountDcl" label="待处理提现金额"></el-table-column>
                <el-table-column prop="createTime" width="150" label="申请提现时间"></el-table-column>
                <el-table-column prop="updateTime" width="150" label="处理提现时间"></el-table-column>
                <el-table-column label="提现状态">
                    <template slot-scope="scope">
                        <span class="ing" v-if="scope.row.status==1">待处理</span>
                        <span class="yes" v-if="scope.row.status==2">已完成</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button  @click="bindGoToDetails(scope.row.id)" type="primary">查看详情</el-button>
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
 </transition>
</template>

<script>
import { spokmanWithdraw } from '../../../utils/axios/api.js';
import mixin from '../../../ext/mixin.js';
    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                    type:'',
                    createTime:'',
                    name:'',
                    accountZfb:'',
                    accountName:'',
                    accountYh:'',
                    status:'',

                    pageNum:'1',
                    pageSize:'10',
                    totalSize:'1',
                },
                table:[],
            }
        },
        methods:{
            __LOADING(){
                this.loadingQuery(this.form);
            },
            loadingQuery(params){
                spokmanWithdraw(params).then(res=>{
                    if(res.code==0){
                        this.form.totalSize = res.page.totalSize;
                        this.table = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            reset(){
                this.form = {
                    type:'',
                    createTime:'',
                    name:'',
                    accountZfb:'',
                    accountName:'',
                    accountYh:'',
                    status:'',

                    pageNum:this.form.pageNum,
                    pageSize:'10',
                    totalSize:this.form.totalSize,
                };
            },
            bindFormSubmit(){
                this.form.pageNum = 1;
                this.loadingQuery(this.form);
            },
            pageChange(n,pageSize){
                this.form.pageNum = n;
                this.form.pageSize = pageSize;
                this.loadingQuery(this.form);
            },
            //查看详情
            bindGoToDetails(id){
                let data = null;
                this.table.forEach((item,index)=>{
                    if(item.id == id) data = item;
                });

                this.$router.push({
                    name: 'spokesmanWithdrawDetails',
                    params: { 
                        data
                    }
                })
            },
        }
    }
</script>

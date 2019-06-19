<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form :model="form" class="admin-form-inline subAccount-form" :inline="true">
               <el-form-item label="客户ID：">
                    <el-input v-model="form.customerNo" placeholder="请输入客户ID"></el-input>
                </el-form-item>

                 <el-form-item label="客户名称：">
                    <el-input v-model="form.customerName" placeholder="请输入客户名称"></el-input>
                </el-form-item>

                  <el-form-item label="客户类型：">
                    <el-select v-model="form.customerType" placeholder="请选择客户类型">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="1" label="个人客户"></el-option>
                        <el-option value="2" label="企业客户"></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="注册手机：" >
                    <el-input  v-model="form.phoneNo" placeholder="请输入手册手机号"></el-input>
                </el-form-item>

                  <el-form-item label="费率区间：">
                    <el-select v-model="form.rate" placeholder="请选择费率区间">
                        <el-option value="" label="全部"></el-option>
                        <el-option v-for="(item,index) in rateZoom" :key="index"
                            :value="item.rateCode"
                            :label="item.rateCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
                <el-button @click="bindToShowModal" type="success">新增费率区间</el-button>
            </el-form>
        </div>

        <div class="table-container">
            <div class="admin-tab-title">客户费率配置</div>
            <el-table :data="table" border>
              <el-table-column prop="customerNo" label="客户ID"></el-table-column>
              <el-table-column prop="customerType" label="客户类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.customerType==1">个人客户</span>
                        <span v-if="scope.row.customerType==2">企业客户</span>
                    </template>
              </el-table-column>
              <el-table-column prop="bmrate" label="Amazon北美站费率"></el-table-column>
              <el-table-column prop="eurate" label="Amazon欧洲站费率"></el-table-column>
              <el-table-column prop="ydrate" label="Amazon印度站费率"></el-table-column>
              <el-table-column prop="ebayrate" label="Ebay费率"></el-table-column>
              <el-table-column prop="wishrate" label="Wish费率"></el-table-column>
              <el-table-column prop="aerate" label="AliExpress费率"></el-table-column>
              <el-table-column label="费率设置">
                    <template slot-scope="scope">
                        <a @click="bindToSetRate(scope.row.customerNo)" class="primary" href="javascript:;">设置费率</a>
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

        <AdminModel
            title="新增费率区间"
            confirmTxt="确认"
            v-model="isShow" 
            :confirm="saleModalConfirm"
            class="customer-details-adminModal"
        >

            <el-form :inline="true" :model="tableForm">
                <el-form-item label="平台：">
                    <el-select v-model="tableForm.platformCode" placeholder="请选择平台">
                       <el-option v-for="(item,index) in PLAT_ARR" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                       ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="费率：">
                    <el-input type="number" v-model="tableForm.rate" placeholder="请输入需要添加的费率"></el-input>
                </el-form-item>
            </el-form>

        </AdminModel>
    </div>
</template>

<script>

import { queryRateZoom,queryPlatform } from '../../../ext/localBase.js'

import AdminModel from '../../../components/adminModal.vue';

import {
    findCustomerRateList,
    addRateConfig
} from '../../../utils/axios/api.js';

import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return{
            form:{
                customerNo:'',
                customerName:'',
                customerType:'',
                phoneNo:'',
                rate:'',

                pageNum:'1',
                pageSize:'10',
                totalSize:'1'
            },
            table:[],
            rateZoom:[],
            isShow:false,
            tableForm:{
                platformCode:"",
                rate:"",
            },

             PLAT_ARR:[],
        }
    },
    components:{
        AdminModel
    },
    methods:{
        __LOADING(){
            this.loadingQuery(this.form),
            queryRateZoom().then(res=>{
               
                this.rateZoom = res;
            }),
            queryPlatform().then(res=>{ this.PLAT_ARR = res }) 
        },
        loadingQuery(params){
            findCustomerRateList(params).then(res=>{
                 if(res.code==0){
                        this.table = res.data;
                        this.form.totalSize = res.page.total;
                    }else{
                        this.$message.error(res.msg);
                    }
            })
        },
         //页码选择的时候
        pageChange(n,pageSize){
            this.form.pageNum = n;
            this.form.pageSize = pageSize;
            this.loadingQuery(this.form);
        },
        bindToSubmit(){
            this.form.pageNum = 1;
            this.loadingQuery(this.form);
        },
        reset(){
            let n = ['pageNum','pageSize','totalSize'];
            for (const key in this.form) {
                if(n.indexOf(key)<0){
                    this.form[key] = "";
                }
            }
        },
        bindToShowModal(){
            this.isShow = true;
        },
        bindToSetRate(customerNo){
            this.$router.push({
                name:'customerSetRate',
                params:{
                    customerNo
                }
            })
        },
        //新增费率空间确定按钮
        saleModalConfirm(){

            if(!this.tableForm.platformCode) return this.$message.warning('请选择平台');
            if(!this.tableForm.rate) return this.$message.warning('请输入需要添加的费率');
            if(this.rateZoom.indexOf(Number(this.tableForm.rate))>-1) return this.$message.warning(`已有改费率区间`);

            addRateConfig({
                platformCode:this.tableForm.platformCode,
                rate:this.tableForm.rate
            }).then(res=>{
                 if(res.code==0){
                    this.$message.success('修改成功！');
                    sessionStorage.removeItem('rateZoom');
                    this.isShow = false;
                    //重新载入汇率区间
                    queryRateZoom().then(res=>{
                        this.rateZoom = res;
                    });
                    // this.customerInfo.salers = this.tableForm.source;
                }else{
                    this.$message.error(res.msg);
                }
            });

        }
    }
}
</script>


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

                <el-form-item label="客户状态：">
                    <el-select v-model="form.status" placeholder="请选择客户状态">
                        <el-option value="7" label="全部"></el-option>
                        <el-option value="5" label="部分流失"></el-option>
                        <el-option value="6" label="全部流失"></el-option>
                    </el-select>
                </el-form-item>

                    <el-form-item class="data" label="起始时间：">
                    <el-date-picker
                         value-format="yyyy-MM-dd"
                        v-model="form.startTime"
                        type="date"
                        placeholder="请选择起始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item class="data" label="结束时间：">
                    <el-date-picker
                         value-format="yyyy-MM-dd"
                        v-model="form.endTime"
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>

                <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
        </div>

        <div class="table-container">
            <div class="admin-tab-title">客户流失统计</div>
            <el-table :data="table" border >
              <el-table-column prop="customerNo" label="客户ID"></el-table-column>
              <el-table-column prop="customerType" label="客户类型">
                  <template slot-scope="scope">
                        <span v-if="scope.row.customerType==1">个人客户</span>
                        <span v-if="scope.row.customerType==2">企业客户</span>
                    </template>
              </el-table-column>
              <el-table-column prop="customerName" label="客户名称"></el-table-column>
              <el-table-column prop="phoneNo" label="手机号码"></el-table-column>
              <el-table-column prop="status" label="客户状态">
                    <template slot-scope="scope">
                        {{status(scope.row.status)}}
                    </template>
              </el-table-column>
              <el-table-column prop="loseTime" label="流失日期"></el-table-column>
              <el-table-column label="操作">
                   <template slot-scope="scope">
                        <a class="primary" @click="bindToDE(scope.row.customerNo)" href="javascript:;">查看详情</a>
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
import { custemerStatus } from '../../../ext/localBase.js'

import {
    findCustomerLoseList,
} from '../../../utils/axios/api.js';

import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return{
            form:{
                customerNo:'',
                customerType:'',
                customerName:'',
                phoneNo:'',
                status:'',
                startTime:'',
                endTime:'',

                pageNum:'1',
                pageSize:'10',
                totalSize:'1'
            },
            custemerStatus:custemerStatus,
            table:[],
        }
    },
    methods:{
        __LOADING(){
            this.reset(),
            this.loadingQuery(this.form) 
        },
        loadingQuery(params){
            findCustomerLoseList(params).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                    this.form.totalSize = res.page.total;
                }else{
                    this.$message.error(res.msg);
                }
            });
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
            //全部
            this.form.status = "7";
        },
        //查看详情页面
         bindToDE(customerNo){
            this.$router.push({
                name:'customerDetails',
                params:{
                    customerNo
                }
            });
        },

        status(code){
            let name = null;
            custemerStatus.map(item=>{
                if(item.status==code) name = item.name;
            });

            return name;
        }
    }
}
</script>


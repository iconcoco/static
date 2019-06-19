<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form :model="form" class="admin-form-inline" :inline="true">

                <ElFormItem label="客户ID">
                    <el-input v-model="form.customerNo" placeholder="请输入客户ID"></el-input>
                </ElFormItem>

                <ElFormItem label="店铺ID">
                    <el-input v-model="form.storeId" placeholder="请输入店铺ID"></el-input>
                </ElFormItem>

                <ElFormItem label="店铺名称">
                    <el-input v-model="form.storeName" placeholder="请输入店铺名称"></el-input>
                </ElFormItem>

                <ElFormItem label="状态" class="widthAuto">
                    <ElSelect 
                    v-model="form.andStatus" 
                    multiple
                    collapse-tags 
                    placeholder="请选择状态">
                      <ElOption v-for="(item,index) in formStatus" :key="index"
                        :label="item.status"
                        :value="item.code"
                      ></ElOption>
                    </ElSelect>
                </ElFormItem>

                <el-form-item label="提现方式">
                    <el-select v-model="form.withdrawType" placeholder="提现方式">
                        <el-option label="自动提现" value="1"></el-option>
                        <el-option label="手动提现" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="申请时间"  class="widthAuto">
                    <el-date-picker
                        type="daterange"
                        v-model="reportTime"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        >
                    </el-date-picker>
                </el-form-item>

                <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>

            </el-form>
        </div>

         <Block title="闪提宝店铺列表">
            <el-table :data="table" border>
                <ElTableColumn prop="customerNo" label="客户ID"></ElTableColumn>
                <ElTableColumn prop="storeId" label="店铺ID"></ElTableColumn>
                <ElTableColumn prop="storeName" label="店铺名称"></ElTableColumn>
                <ElTableColumn prop="platformCode" label="平台">
                    <template slot-scope="scope">
                        {{platformName(scope.row.platformCode)}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="withdrawType" label="提现方式">
                    <template slot-scope="scope">
                        <span class="yes" v-if="scope.row.withdrawType==1">自动提现</span>
                        <span class="ING" v-if="scope.row.withdrawType==0">手动提现</span>
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="createdTime" label="申请时间">
                    <template slot-scope="scope">
                        {{scope.row.createdTime | formatDate}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="finishTime" label="失效时间">
                    <template slot-scope="scope">
                        {{scope.row.finishTime | formatDate}}
                    </template>
                </ElTableColumn>
                <ElTableColumn label="状态">
                    <template slot-scope="scope">
                        {{statusName(scope.row.status)}}
                    </template>
                </ElTableColumn>
            </el-table>

             <Pagination 
                :page="form.pageNum"
                :pageSize="form.pageSize"
                :count="form.totalSize"
                :chosefallback="pageChange"
            ></Pagination>
        </Block>
    </div>
</template>

<script>
import {
    getFlashwithdraw
} from '../../../utils/axios/api.js';

import {queryPlatform} from '../../../ext/localBase.js';

import mixin from '../../../ext/mixin.js';
import { formatTimer } from '../../../utils/common.js';

export default {
    mixins:[mixin()],
    data(){
        return{
            form:{
                customerNo:'',
                storeId:'',
                customerName:'',
                withdrawType:'',
                startTime:'',
                endTime:'',
                storeName:'',
                andStatus:[],

                pageNum:'1',
                pageSize:'10',
                totalSize:'2',
            },
            reportTime:[],
            table:[],

            Platform:[],

            formStatus:[
                {code:1,status:'免费试用'},
                {code:2,status:'付费使用'},
                {code:3,status:'免费到期'},
                {code:4,status:'付费取消'},
                {code:5,status:'免费转付费'},
            ]
        }
    },
    methods:{ 
        __LOADING(){
            this.loadingQuery(this.form);
             queryPlatform().then(res=>{
                this.Platform = res;
            });
        },
        loadingQuery(params){
            let forData = Object.assign({},params);
            params.andStatus instanceof Array && (forData.andStatus = params.andStatus.join());
            getFlashwithdraw(forData).then(res=>{
                 if(res.code==0){
                    this.table = res.data;
                    this.form.totalSize = res.page.total;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindToSubmit(){
            this.form.pageNum = 1;

            this.reportTime.length && (this.form.startTime = `${this.reportTime[0]} 00:00:00`);
            this.reportTime.length && (this.form.endTime = `${this.reportTime[1]} 23:59:59`);

            this.loadingQuery(this.form);
        },
        reset(){
            let n = ['pageNum','pageSize','totalSize','andStatus'];
            for (const key in this.form) {
                if(n.indexOf(key)<0){
                    this.form[key] = ""
                }
            };

            this.form.andStatus = [];

            this.reportTime = [];
        },

        pageChange(n,size){
            this.form.pageNum = n;
            this.form.pageSize = size;
            this.loadingQuery(this.form);
        },

        platformName(code){
            let str = null;
            this.Platform.forEach(item=>{
                if(item.platformCode==code){ str = item.platformName }
            }) ;
            return str;
        },
        statusName(code){
            let str = null;
            this.formStatus.forEach(item=>{
                if(item.code==code){ str = item.status }
            }) ;
            return str;
        }
    },
    filters:{
        formatDate(value){
            return formatTimer(value)
        }
    }
}
</script>

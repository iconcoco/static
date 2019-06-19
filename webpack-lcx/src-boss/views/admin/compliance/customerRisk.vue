<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form :model="form" :inline="true" class="admin-form-inline" >
                <el-form-item label="客户名称：">
                    <el-input v-model="form.customerName" placeholder="请输入客户名称"></el-input>
                </el-form-item>

                <el-form-item label="客户ID：">
                    <el-input v-model="form.customerNo" placeholder="请输入客户ID"></el-input>
                </el-form-item>

                <el-form-item label="公司名称：">
                    <el-input v-model="form.enterpriseName" placeholder="请输入公司名称"></el-input>
                </el-form-item>

                 <el-form-item label="注册时间：" class="widthAuto">
                    <el-date-picker
                        type="daterange"
                        v-model="registTime"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="客户类型：">
                    <el-select v-model="form.type" placeholder="请选择客户类型">
                        <el-option label="个人" value="0"></el-option>
                        <el-option label="企业" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
        </div>
        
        <Block title="客户风险及监控">
            <el-table :data="table" border>
                <el-table-column width="175" prop="customerNo" label="客户ID"></el-table-column>
                <el-table-column prop="customerName" label="客户名称"></el-table-column>
                <el-table-column prop="enterpriseName" label="公司名称">
                    <template slot-scope="scope">
                        {{scope.row.enterpriseName || 'N/A'}}
                    </template>
                </el-table-column>
                <el-table-column width="150" prop="relTime" label="关系建立日期">
                    <template slot-scope="scope">
                        {{formatDate(scope.row.relTime) || 'N/A'}}
                    </template>
                </el-table-column>
                <el-table-column prop="customerType" label="客户类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.customerType==1">个人</span>
                        <span v-else>企业</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pep" label="PEP">
                    <template slot-scope="scope">
                        <span v-if="scope.row.pep==2">否</span>
                        <span v-if="scope.row.pep==1">是</span>
                    </template>
                </el-table-column>
                <el-table-column prop="badNews" label="负面新闻">
                     <template slot-scope="scope">
                        <span v-if="scope.row.badNews==2">否</span>
                        <span v-if="scope.row.badNews==1">是</span>
                    </template>
                </el-table-column>
                <el-table-column prop="score" label="风险评分"></el-table-column>
                <el-table-column label="详情">
                    <template slot-scope="scope">
                        <a href="javascript:;" class="primary" @click="bindToDetail(scope.row.customerNo,scope.row.customerType)">查看详情</a>
                    </template>
                </el-table-column>
            </el-table>

            <Pagination 
            :page="form.pageNumber"
            :pageSize="form.pageSize"
            :count="form.totalSize"
            :chosefallback="pageChange"
            ></Pagination>
        </Block>
    </div>
</template>

<script>

import mixin from './../../../ext/mixin.js'
import { formatTimer } from '../../../utils/common.js';

import { 
    queryEnterprisePage,
    queryIndividualPage
} from './../../../utils/axios/api.js';

export default {
    mixins:[mixin()],
    data(){
        return {
            form:{
                type:"0",
                customerNo:'',
                customerName:'',
                enterpriseName:'',
                registerStartTime:'',
                registerEndTime:'',

                pageNumber:1,
                pageSize:10,
                totalSize:1,
            },
            registTime:[],
            table:[],
        }
    },
    methods:{
        __LOADING(){
            this.bindToSubmit();
        },
        bindToSubmit(){
            this.pageNumber = 1;

            this.registTime.length && (this.form.registerStartTime = this.registTime[0],this.form.registerEndTime = this.registTime[1]);

            this.loadingQuery(this.form);
        },
        loadingQuery(params){
            let queryAPI = params.type==1 ? queryEnterprisePage : queryIndividualPage;
            queryAPI(params).then(res=>{
                if(res.code==0){
                    this.table = res.data.content;
                    this.form.totalSize = res.data.totalPages;
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        reset(){
            let n = ['pageNumber','pageSize','totalSize','type'];
            for (const key in this.form) {
                if(!n.includes(key)){
                    this.form[key] = ""
                }
            };

            this.form.type = '0';
            this.registTime = [];
        },
        pageChange(n,per){
            this.form.pageNumber = n;
            this.form.pageSize = per;
            this.loadingQuery(this.form);
        },
        bindToDetail(customerNo,customerType){

            let target = customerType==1 ? 'customerRiskPersonal' : 'customerRiskCompany';
            //跳转到详情页面
            this.$router.push({
                name:target,
                params:{
                    customerNo
                }
            });
        },
        formatDate(value){
            return formatTimer(value)
        }
    },
}
</script>


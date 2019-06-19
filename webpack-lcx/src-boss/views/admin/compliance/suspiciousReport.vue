<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form :model="form" class="admin-form-inline" :inline="true">
               
                <ElFormItem label="客户 ID:">
                    <el-input v-model="form.customerNo" placeholder="请输入客户ID"></el-input>
                </ElFormItem>

                <ElFormItem label="Case ID:">
                    <el-input v-model="form.caseNo" placeholder="请输入CaseID"></el-input>
                </ElFormItem>

                <ElFormItem label="案例状态:">
                    <el-select v-model="form.status" placeholder="选择案例状态">
                        <ElOption value="1" label="Pending"></ElOption>
                        <ElOption value="2" label="Escalated"></ElOption>
                        <ElOption value="3" label="SAR"></ElOption>
                        <ElOption value="4" label="Closed"></ElOption>
                    </el-select>
                </ElFormItem>
               

                <el-form-item label="创建时间：" class="widthAuto">
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

                <ElFormItem label="店铺 ID:">
                    <el-input v-model="form.storeId" placeholder="请输入店铺ID"></el-input>
                </ElFormItem>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>

            </el-form>
        </div>

        <Block title="可疑报告列表">
            <el-button type="primary" @click="bindToShowModel(true)">创建案例</el-button>

            <ElTable :data="table" border >
              <ElTableColumn prop="caseNo" label="Case ID"></ElTableColumn>
              <ElTableColumn prop="customerNo" label="客户ID"></ElTableColumn>
              <ElTableColumn prop="storeId" label="店铺ID"></ElTableColumn>
              <ElTableColumn prop="createTime" label="创建时间">
                  <template slot-scope="scope">
                      {{formatDate(scope.row.createTime)}}
                  </template>
              </ElTableColumn>
              <ElTableColumn prop="reason" label="触发原因"></ElTableColumn>
              <ElTableColumn prop="status" label="案例状态">
                  <template slot-scope="scope">
                        <span v-if="scope.row.status==1"><i class="point ING"></i> Pending</span>
                        <span v-if="scope.row.status==2"><i class="point warning"></i> Escalated</span>
                        <span v-if="scope.row.status==3"><i class="point no"></i> SAR</span>
                        <span v-if="scope.row.status==4"><i class="point yes"></i> Closed</span>
                  </template>
              </ElTableColumn>
              <ElTableColumn label="详情">
                    <template slot-scope="scope">
                        <a 
                        href="javascript:;" 
                        @click="bindToDetail(scope.row.id)"
                        class="primary">查看详情</a>
                    </template>
              </ElTableColumn>
            </ElTable>

            <Pagination 
                :page="form.pageNumber"
                :pageSize="form.pageSize"
                :count="form.totalPages"
                :chosefallback="pageChange"
            ></Pagination>
        </Block>

        <AdminModel 
            title="创建案例"
            v-model="createModel"
            :confirm="bindModelConfirm"
        >

            <ElForm :model="modelForm" :inline="true" class="suspicious-form">
                <ElFormItem label="客户ID">
                    <ElInput v-model="modelForm.customerNo" placeholder="请输入客户ID"></ElInput>
                </ElFormItem>
                <ElFormItem label="店铺ID">
                    <ElInput v-model="modelForm.storeId" placeholder="请输入店铺ID"></ElInput>
                </ElFormItem>
                <ElFormItem label="触发原因">
                    <ElInput v-model="modelForm.reason" placeholder="请输入触发原因"></ElInput>
                </ElFormItem>
            </ElForm>

        </AdminModel>
    </div>
</template>


<script>

import AdminModel from './../../../components/adminModal.vue';
import mixin from './../../../ext/mixin.js';

import { formatTimer } from '../../../utils/common.js';

import {
    querySuspectMangeDto,
    createSuspectMange,
} from '../../../utils/axios/api.js';

export default {
    mixins:[mixin()],
    data(){
        return {
            form:{
                customerNo:'',
                caseNo:'',
                status:'',
                startDate:'',
                endDate:'',
                storeId:'',

                pageNumber:1,
                pageSize:10,
                totalPages:1,
            },
            modelForm:{
                customerNo:'',
                storeId:'',
                reason:'',
            },
            table:[],
            reportTime:[],

            createModel:false
        }
    },
    methods:{
        __LOADING(){
            this.loadingQuery(this.form);
        },
        loadingQuery(params){
            querySuspectMangeDto(params).then(res=>{
                if(res.code==0){
                    this.table = res.data.content;
                    this.form.totalPages = res.data.totalPages;
                }else{
                    this.$message.error(res.msg);
                }
            })
        },

        bindFormSubmit(){
            this.form.pageNumber = 1;

            this.reportTime.length && (this.form.startDate = this.reportTime[0]);
            this.reportTime.length && (this.form.endDate = this.reportTime[1]);

            this.loadingQuery(this.form);
        },
        reset(){
            let n = ['pageNumber','pageSize','totalSize'];
            for (const key in this.form) {
                if(!n.includes(key)){
                    this.form[key] = ""
                }
            };

            this.reportTime=[];
        },

        pageChange(n,per){
            this.form.pageNumber = n;
            this.form.pageSize = per;

            this.loadingQuery(this.form);
        },
        bindModelConfirm(){
            for (const key in this.modelForm) {
                if(!this.modelForm[key]){   
                    let msg = null;

                    switch(key){
                        case 'customerNo': msg='请输入客户ID';break
                        case 'storeId': msg='请输入店铺ID';break
                        case 'reason': msg='请输入触发原因';break
                    };

                    return this.$message.warning(msg);
                }
            };

            createSuspectMange(this.modelForm).then(res=>{
                if(res.code==0){
                    this.$message.success(`创建成功`);
                    this.bindToShowModel(false);
                    //刷新列表
                    this.bindFormSubmit()
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindToDetail(id){
            this.$router.push({name:'suspiciousReportDetail',params:{
                id
            }})
        },
        bindToShowModel(bol){
            this.createModel = bol;
        },
         formatDate(value){
            return formatTimer(value)
        }
    },
    components:{
        AdminModel
    }
}
</script>

<style lang="scss">
.suspicious-form{
    padding-top: 20px;
    text-align: center;
    .el-form-item__label{
        width: 80px;
        text-align: right;
    }
}
</style>

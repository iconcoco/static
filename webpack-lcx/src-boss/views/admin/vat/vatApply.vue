<template>
    <div class="fadeIn">
        <div class="table-container">
            <ul class="tab-ul">
                <li
                    :class="{active:form.attachStatus<0}"
                    @click="()=>{
                        if(form.status<0) return;
                        form.attachStatus = -1;
                        bindFormSubmit();
                    }"
                >全部 <span>{{totalCount}}</span></li>
                <li v-for="(item,index) in statusList" 
                    :key="index"
                    :class="{active:item.status===form.attachStatus}"
                    @click="()=>{
                        if(!item.count) return;
                        form.attachStatus = item.status;
                        bindFormSubmit();
                    }"
                    >{{fineValName(item.status,vatApplyStatus,'name','status')}} <span>{{item.count}}</span></li>
            </ul>
        </div>

        <div class="table-container">
            <el-form :model="form" class="admin-form-inline" :inline="true">

                <!-- <ElFormItem label="公司名称：">
                    <ElInput v-model="form.x" placeholder="请输入公司名称"></ElInput>
                </ElFormItem> -->

                <ElFormItem label="客户ID：">
                    <ElInput v-model="form.customerNo" placeholder="请输入客户ID"></ElInput>
                </ElFormItem>
                
                <ElFormItem label="联系人电话：">
                    <ElInput v-model="form.phone" placeholder="请输入联系人电话"></ElInput>
                </ElFormItem>

                <ElFormItem label="服务类型：">
                    <!-- <ElInput v-model="form.type" placeholder="请选择服务类型"></ElInput> -->
                    <ElSelect v-model="form.type" placeholder="请选择服务类型">
                      <ElOption value="1" label="注册+首年申报"></ElOption>
                      <ElOption value="0" label="单次注册"></ElOption>
                    </ElSelect>
                </ElFormItem>

                <ElFormItem label="VAT号码：">
                    <ElInput v-model="form.dutyServiceNumber" placeholder="请输入VAT号码"></ElInput>
                </ElFormItem>

                <ElFormItem label="EORI号码：">
                    <ElInput v-model="form.dutyEoriNumber" placeholder="请输入EORI号码"></ElInput>
                </ElFormItem>

                <el-form-item label="申请时间：" class="widthAuto">
                    <el-date-picker
                        type="datetimerange"
                        v-model="reportTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="起始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        >
                    </el-date-picker>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>

            </el-form>
        </div>

        <Block
            title="VAT客户注册列表"
        >
            <el-table :data="table" border >
                <ElTableColumn prop="customerNo" label="客户ID"></ElTableColumn>
                <ElTableColumn prop="" label="公司名称"></ElTableColumn>
                <ElTableColumn prop="phone" label="联系人电话"></ElTableColumn>
                <ElTableColumn prop="email" label="联系人邮箱"></ElTableColumn>
                <ElTableColumn prop="type" label="服务类型">
                     <template slot-scope="scope">
                         {{scope.row.type==1 ? '注册+首年申报' : '单次注册'}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="declaredCountry" label="申报国家">
                    <template slot-scope="scope">
                         {{fineValName(scope.row.declaredCountry,AllNationCode,'nation','code')}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="createdTime" label="申请时间" width="155">
                     <template slot-scope="scope">
                         {{formatTimer(scope.row.createdTime)}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="dutyServiceNumber" label="增值税号"></ElTableColumn>
                <ElTableColumn prop="attachStatus" label="状态">
                     <template slot-scope="scope">
                         <span v-if="[0,6,7,9].includes(scope.row.attachStatus)" class="waiting">{{fineValName(scope.row.attachStatus,vatApplyStatus,'name','status')}}</span>
                         <span v-if="[1].includes(scope.row.attachStatus)" class="yes">{{fineValName(scope.row.attachStatus,vatApplyStatus,'name','status')}}</span>
                         <span v-if="[2,5].includes(scope.row.attachStatus)" class="no">{{fineValName(scope.row.attachStatus,vatApplyStatus,'name','status')}}</span>
                         <span v-if="[3,4,8].includes(scope.row.attachStatus)" class="ing">{{fineValName(scope.row.attachStatus,vatApplyStatus,'name','status')}}</span>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="操作">
                    <template slot-scope="scope">
                        <a class="primary" href="javascript:;" @click="jumper('vatApplyDetail',{id:scope.row.id})">查看详情</a>
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
     vatApplyStatus,
     AllNationCode
} from '../../../ext/localBase.js';

import { formatTimer } from '../../../utils/common.js';

import { 
    vatrecordGetList,
    vatrecordGetStatusCount
} from './../../../utils/axios/api.js';

import mixin from '../../../ext/mixin.js';
export default {
    mixins:[mixin()],
    data(){
        return {
            form:{
                customerNo:'',
                dutyServiceNumber:'',
                dutyEoriNumber:'',
                phone:'',
                type:'',
                startTime:'',
                endTime:'',
                attachStatus:'',

                pageNum:1,
                pageSize:10,
                totalSize:5,
            },
            totalCount:0,
            reportTime:null,
            table:[],
            statusList:[],

            exportData:[],
            vatApplyStatus:vatApplyStatus,
            AllNationCode:AllNationCode
        }
    },
    methods:{
        __LOADING(){
            this.loadingQuery();
        },
        loadingQuery(){

            vatrecordGetList(this.form).then(res=>{
                if(res.code==0){
                    this.table = res.data;

                    this.form.totalSize = res.page.total;
                }else{
                    this.$message.error(res.msg);
                }
            });

            vatrecordGetStatusCount().then(res=>{
                if(res.code==0){
                    this.statusList = res.data;
                    let totalCount = 0;
                    res.data.forEach(item=>{ 
                        totalCount += item.count
                    });

                    this.totalCount = totalCount;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindFormSubmit(){
            (this.form.startTime =this.reportTime ? this.reportTime[0] : ''),
            (this.form.endTime = this.reportTime ? this.reportTime[1] : '');

             this.loadingQuery();
        },
        reset(){

            let n = ['pageNum','pageSize','totalSize'];
            for (const key in this.form) {
                if(n.indexOf(key)<0){
                    this.form[key] = ""
                }
            };

            this.reportTime = null;
        },
        pageChange(per,size){
            this.form.pageNum = per;
            this.form.pageSize = size;

            this.loadingQuery();
        },
        jumper(name,params){
            this.$router.push({name,params});
        },
        formatTimer(code){
            return formatTimer(code);
        },
        fineValName(code,LIST,NAME,itemCode){
            let I = LIST.find(item=>{
                return item[itemCode]==code;
            });
            if(I){
                return I[NAME];
            }
        },
    }
}
</script>

<style lang="scss" scoped>
@import './../../../css/element-variables.scss';
.tab-ul{
    li{
        display: inline-block;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        padding: 0 15px;
        border-radius: 16px;
        margin-right: 10px;
        border: 1px solid #EBEBEB;
        cursor: pointer;
        transition: all .2s;
        span{
            color:$--color-danger;
        }
        &:hover{
            color: $--color-primary;
        } 
        &.active{
            border-color: $--color-primary;
            color: $--color-primary;
        }
    }
}
</style>

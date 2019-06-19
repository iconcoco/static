<template>
    <div class="fadeIn">
        <div class="table-container">
            <p class="tab-ul">
                <span class="active">全部 <i>100</i></span>
                <span v-for="(item,index) in STATUS" :key="index"
                    v-if="item.customerStatus"
                     :class="{active:form.queryStatus==item.customerStatus.toString()}"
                     @click="statusTab(item.customerStatus.toString())"
                >{{item.name}} <i>100</i></span>
            </p>
        </div>

        <div class="table-container">
            <ElForm :model="form" class="admin-form-inline" :inline="true">

                <ElFormItem label="公司名称：">
                    <ElInput v-model="form.companyName" placeholder="请输入公司名称"></ElInput>
                </ElFormItem>

                <ElFormItem label="客户ID：">
                    <ElInput v-model="form.customerNo" placeholder="请输入客户ID"></ElInput>
                </ElFormItem>

                <ElFormItem label="VAT号码：">
                    <ElInput v-model="form.taxNo" placeholder="请输入VAT号码"></ElInput>
                </ElFormItem>

                <el-form-item label="缴税申请时间：" class="widthAuto">
                    <el-date-picker
                        type="daterange"
                        v-model="reportTime"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="起始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        >
                    </el-date-picker>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>

            </ElForm>
        </div>

        <Block title="待分配客户列表">
            <ElTable :data="table" border >
              <ElTableColumn prop="customerNo" label="客户ID"></ElTableColumn>
              <ElTableColumn prop="countryCode" label="申报国家">
                   <template slot-scope="scope">
                        {{fineValName(scope.row.countryCode,AllNationCode,'nation','code')}}
                    </template>
              </ElTableColumn>
              <ElTableColumn prop="taxBureauName" label="税号公司名称"></ElTableColumn>
              <ElTableColumn prop="taxNo" label="增值税号"></ElTableColumn>
              <ElTableColumn prop="createTime" label="申请时间">
                  <template slot-scope="scoped">
                      {{formatTimer(scoped.row.createTime)}}
                  </template>
              </ElTableColumn>
              <ElTableColumn prop="endTime" label="缴税截止时间">
                  <template slot-scope="scoped">
                      {{formatTimer(scoped.row.endTime)}}
                  </template>
              </ElTableColumn>
              <ElTableColumn prop="status" label="缴税状态">
                   <template slot-scope="scoped">
                      {{fineValName(scoped.row.status,STATUS,'name','status')}}
                  </template>
              </ElTableColumn>
              <ElTableColumn prop="amount" label="代缴金额"></ElTableColumn>
              <ElTableColumn prop="currency" label="币种"></ElTableColumn>
              <ElTableColumn label="操作">
                  <template slot-scope="scope">
                      <a href="javascript:;" class="primary" @click="jumper('vatPayTaxDetail',{
                          id:scope.row.id
                      })">查看详情</a>
                  </template>
              </ElTableColumn>
            </ElTable>

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
import {PAY_STATUS} from './var.js';
import { 
    queryPaytaxList,
    findStatusCount
} from './../../../utils/axios/api.js';

import { 
    AllNationCode
} from '../../../ext/localBase.js';
import { formatTimer } from '../../../utils/common.js';

import mixin from '../../../ext/mixin.js';
export default {
     mixins:[mixin()],
    data(){
        return{
            form:{
                pageNum:1,
                pageSize:10,
                totalSize:1,

                queryStatus:'',
                applyStartTime:'',
                applyEndTime:'',
            },
            reportTime:null,

            table:[],
            STATUS:PAY_STATUS,
            AllNationCode:AllNationCode,
        }
    },
    methods:{
         __LOADING(){
            this.loadingQuery();
        },
        loadingQuery(){
            this.form.applyStartTime = this.reportTime? this.reportTime[0]: '';
            this.form.applyEndTime = this.reportTime? this.reportTime[1]: '';

            queryPaytaxList(this.form).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                    this.form.totalSize = res.page.total;
                }else{
                    this.$Message.error(res.msg);
                }
            });

            findStatusCount().then(res=>{

            });
        },

        statusTab(status){
            this.form.queryStatus = status;
            this.bindFormSubmit();
        },
        bindFormSubmit(){
            this.form.pageNum = 1;
            this.loadingQuery();
        },
        reset(){
            let noChange = ['pageNum','pageSize','totalSize'];
            for (const key in this.form) {
                if(!noChange.includes(key)){
                    this.form[key] = "";
                }
            };

            this.reportTime = null;
        },
        pageChange(){
            this.form.pageNum = size;
            this.form.pageSize = per;

            this.bindFormSubmit();
        },

        jumper(name,params){
            this.$router.push({name,params})
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
    span{
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
        margin-bottom: 10px;
        i{
            color:$--color-danger;
        }

        &.active{
            border-color: $--color-primary;
            color: $--color-primary;
        }  
        &:hover{
            color: $--color-primary;
        } 
    }
}
</style>
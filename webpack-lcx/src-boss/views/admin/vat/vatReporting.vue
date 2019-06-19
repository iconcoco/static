<template>
    <div class="fadeIn">
        <div class="table-container">
            <p class="tab-ul">
                <span v-for="(item,index) in AllNationCode" :key="index" 
                    v-if="item.platformCode=='EU'"
                    :class="{active:form.countryCode==item.code}"
                    @click="()=>{ form.countryCode = item.code }"
                >{{item.nation}}</span>
            </p>
        </div>

        <div class="table-container">
            <p class="tab-ul">
                <!-- <span class="active">全部 <i>100</i></span> -->
                <span v-for="(item,index) in STATUS" :key="index"
                    @click="changeFormStatus(item.status,item.count)"
                    :class="{active:form.status===item.status}"
                >
                    {{item.name}}  <i>{{item.count || 0}}</i>
                </span>
            </p>
        </div>

        <div class="table-container">
            <el-form :model="form" class="admin-form-inline" :inline="true">
               <ElFormItem label="客户ID：">
                    <ElInput v-model="form.customerNo" placeholder="请输入客户ID"></ElInput>
                </ElFormItem>

               <ElFormItem label="公司名称：">
                    <ElInput v-model="form.companyName" placeholder="请输入公司名称"></ElInput>
                </ElFormItem>

                <ElFormItem label="VAT号码：">
                    <ElInput v-model="form.dutyServiceNumber" placeholder="请输入VAT号码"></ElInput>
                </ElFormItem>

                <ElFormItem label="EORI号码：">
                    <ElInput v-model="form.dutyEoriNumber" placeholder="请输入EORI号码"></ElInput>
                </ElFormItem>

                <el-form-item label="申报时间：" class="widthAuto">
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

                <el-form-item label="申报截止时间：" class="widthAuto">
                    <el-date-picker
                        type="daterange"
                        v-model="EndTime"
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
                <el-button  type="success" @click="jumper('vatReportingAdd')">新增待申报</el-button>
            </el-form>
        </div>

        <Block title="VAT申报列表">
            <ElTable :data="table" border >
                <ElTableColumn prop="customerNo" label="客户ID"></ElTableColumn>
                <ElTableColumn prop="companyName" label="公司名称"></ElTableColumn>
                <ElTableColumn prop="countryCode" label="申报国家">
                    <template slot-scope="scope">
                        {{fineValName(scope.row.countryCode,AllNationCode,'nation','code')}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="dutyServiceNumber" label="增值税号"></ElTableColumn>
                <ElTableColumn prop="useDeclaraCount" label="已申报次数"></ElTableColumn>
                <ElTableColumn prop="declaraCount" label="剩余申报次数">
                    <template slot-scope="scope">
                        {{scope.row.declaraCount - scope.row.useDeclaraCount}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="" label="申报月份">
                    <template slot-scope="scope">
                        {{scope.row.months.join('、')}}
                        <!-- {{formatMonth(scope.row.startTime)}}
                        ~
                        {{formatMonth(scope.row.endTime)}} -->
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="deadlineTime" label="申报截止时间">
                    <template slot-scope="scope">
                        {{formatTimer(scope.row.deadlineTime)}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="status" label="申报状态">
                    <template slot-scope="scope">
                        {{fineValName(scope.row.status,STATUS,'name','status')}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="" label="操作">
                    <template slot-scope="scope">
                        <a href="javascript:;" class="primary" @click="jumper('vatReportDetail',{id:scope.row.id})">查看详情</a>
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
import { findDeclarationModelList,vatFindStatusCount } from './../../../utils/axios/api.js';
import { STATUS_REPORT_PART1,STATUS_REPORT_PART2 } from './var.js';
import { formatTimer } from '../../../utils/common.js';
import { 
    AllNationCode
} from '../../../ext/localBase.js';

import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return{
            form:{
                countryCode:'',
                customerNo:'',
                companyName:'',
                dutyServiceNumber:'',
                dutyEoriNumber:'',
                applyStartTime:'',
                applyEndTime:'',

                startTime:'',
                endTime:'',

                status:'',

                pageNum:1,
                pageSize:10,
                totalSize:1,
            },
            reportTime:null,
            EndTime:null,

            table:[],
            STATUS:[],

            AllNationCode:AllNationCode
        }
    },
    methods:{
        __LOADING(){
            this.form.countryCode = 'GB';
        },
        loadingQuery(){

            this.form.applyStartTime = this.EndTime ? this.EndTime[0]: '';
            this.form.applyEndTime = this.EndTime ? this.EndTime[1]: '';

            this.form.startTime = this.reportTime ? this.reportTime[0]: '';
            this.form.endTime = this.reportTime ? this.reportTime[1]: '';

            findDeclarationModelList(this.form).then(res=>{
                if(res.code){
                    this.table = res.data.list;

                    this.form.totalSize = res.data.total;
                }else{
                    this.$message.error(res.mg);
                }
            });

            vatFindStatusCount({countryCode:this.form.countryCode}).then(res=>{
                if(res.code==0){
                    this.STATUS.forEach(item=>{
                        item['count'] = res.data[item.status] || 0;
                    });
                }else{
                    this.$message.error(res.mg);
                }
            });
        },
        bindFormSubmit(){
             this.form.pageNum = 1;
             this.loadingQuery();
        },
        changeFormStatus(status,count){
            if(!count) return;
            this.form.status = status;

            this.bindFormSubmit();
        },
        reset(){
            this.reportTime = null;
            this.EndTime = null;

            let noChange = ['countryCode','pageNum','pageSize','totalSize'];
            for (const key in this.form) {
                if(!noChange.includes(key)){
                    this.form[key] = "";
                }
            };
        },
        pageChange(size,per){
            this.form.pageNum = size;
            this.form.pageSize = per;

            this.bindFormSubmit();
        },
        jumper(name,params){
            this.$router.push({name,params})
        },
        fineValName(code,LIST,NAME,itemCode){
            let I = LIST.find(item=>{
                return item[itemCode]==code;
            });
            if(I){
                return I[NAME];
            }
        },
        formatTimer(code,bol){
            return formatTimer(code,bol);
        },
    },
    watch:{
        'form.countryCode'(code){
            this.form.status = "";
            ['FR','IT','ES'].includes(code) ? (
                this.STATUS = STATUS_REPORT_PART2
            ):(
                this.STATUS = STATUS_REPORT_PART1
            );
            //请求数据
            this.bindFormSubmit();
        }
    },
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

<template>
    <div class="fadeIn">
        <div class="table-container">
            <p class="tabSpan">
                <span @click="()=>{ activeTab=1;form.status=''; bindFormSubmit();}" :class="{active:activeTab==1}">VAT服务费</span>
                <span @click="()=>{ activeTab=2;form.status=''; bindFormSubmit();}" :class="{active:activeTab==2}">VAT代缴税费</span>
            </p>
        </div>

        <div class="table-container">
            <el-form :model="form" class="admin-form-inline" :inline="true">
                <ElFormItem label="客户ID：">
                    <ElInput v-model="form.customerNo" placeholder="请填写客户ID"></ElInput>
                </ElFormItem>

                <ElFormItem label="客户名称：">
                    <ElInput v-model="form.customerName" placeholder="请填写客户名称"></ElInput>
                </ElFormItem>

                <ElFormItem label="状态" v-if="activeTab==1">
                    <ElSelect v-model="form.status" placeholder="">
                        <ElOption label="全部" value=""></ElOption>
                        <ElOption v-for="(item,index) in STATUS" :key="index"
                            :label="item.status"
                            :value="item.code"
                        ></ElOption>
                    </ElSelect>
                </ElFormItem>

                 <el-form-item label="入账时间：" class="widthAuto" v-if="activeTab==1">
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

                 <el-form-item label="出账时间：" class="widthAuto" v-else>
                    <el-date-picker
                        type="datetimerange"
                        v-model="outTime"
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

        <Block :title="activeTab==1 ? 'VAT服务费入账列表':'VAT代缴税入账列表'">
            <el-table :data="table" border >
                <ElTableColumn prop="customerNo" label="客户ID"></ElTableColumn>
                <ElTableColumn prop="customerName" label="客户名称"></ElTableColumn>
                <ElTableColumn prop="orderType" label="入账类型">
                    <template slot-scope="scoped">
                        {{activeTab==1 ? 'VAT服务费':'VAT代缴税费'}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="amount" label="入账金额">
                    <template slot-scope="scoped">
                        {{scoped.row.amount/100}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="completeTime" label="入账时间" v-if="activeTab==1">
                     <template slot-scope="scoped">
                        {{formatTimer(scoped.row.completeTime)}}
                    </template>
                </ElTableColumn>

                <ElTableColumn prop="taxPayUpdateTime" label="入账时间" v-if="activeTab==2">
                     <template slot-scope="scoped">
                        {{formatTimer(scoped.row.taxPayUpdateTime)}}
                    </template>
                </ElTableColumn>

                <ElTableColumn prop="bankAccount" label="打款银行账号" v-if="activeTab==1"></ElTableColumn>
                <ElTableColumn prop="bankHolder" label="打款银行户名" v-if="activeTab==1"></ElTableColumn>
                <ElTableColumn prop="status" label="状态" v-if="activeTab==1">
                    <template slot-scope="scoped">
                        {{fineValName(scoped.row.status,STATUS,'status','code')}}
                    </template>
                </ElTableColumn>

                <ElTableColumn label="操作">
                    <template slot-scope="scoped">
                        <a href="javascript:;" class="primary" @click="jumper(scoped.row.id)">查看详情</a>
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
import {vatrecordGetOrderPage,vatrecordGetTaxPage} from './../../../utils/axios/api.js';
import mixin from '../../../ext/mixin.js';
import { formatTimer } from '../../../utils/common.js';
export default {
    mixins:[mixin()],
    data(){
        return{
            activeTab:1,
            form:{
                status:'',
                customerNo:'',
                customerName:'',
                pageNum:1,
                pageSize:10,
                totalSize:1,
            },
            reportTime:null,  //入账时间
            outTime:null,     //出账时间

            table:[],

            STATUS:[
                {code:1,status:'待审核'},
                {code:2,status:'审核成功'},
                {code:3,status:'审核失败'},
                // {code:4,status:'取消'},
                // {code:5,status:'退款'},
                // {code:6,status:'已退款'},
            ]
        }
    },
    methods:{
        __LOADING(){
            this.bindFormSubmit();
        },

        queryVatOrderPage(){
            let formData = Object.assign({
                startTime:this.reportTime? this.reportTime[0] : '',
                endTime:this.reportTime? this.reportTime[1] : '',
            },this.form);

            vatrecordGetOrderPage(formData).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                    this.form.totalSize=res.page.total;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        queryVatTaxPage(){
             let formData = Object.assign({
                outStartTime:this.outTime? this.outTime[0] : '',
                outEndTime:this.outTime? this.outTime[1] : '',
            },this.form);

            vatrecordGetTaxPage(formData).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                    this.form.totalSize=res.page.total;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindFormSubmit(){
            this.form.pageNum = 1;

            this.activeTab==1 ? this.queryVatOrderPage() : this.queryVatTaxPage();
        },
        reset(){
            let n = ['pageNum','pageSize','totalSize'];
            for (const key in this.form) {
                if(!n.includes(key)){
                    this.form[key] = ""
                }
            };

            this.reportTime=null;
            this.outTime=null;
        },

        formatTimer(code){
            return formatTimer(code);
        },

        pageChange(size,per){
            this.form.pageNum = size;
            this.form.pageSize = per;

            this.activeTab==1 ? this.queryVatOrderPage() : this.queryVatTaxPage();
        },
        jumper(id){
            let name =  this.activeTab==1 ? 'vatBalanceDetail' : 'vatBalanceTaxDetails';

            let params = this.table.find(item=>{
                return item.id == id;
            });

            this.$router.push({name,params});
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
.tabSpan{
    span{
        display: inline-block;
        padding: 0 10px;
        height: 36px;
        line-height: 36px;
        cursor: pointer;
        border-bottom: 2px solid #fff;

        &.active{
            color: $--color-primary;
            border-color: $--color-primary;
        }
    }
}
</style>

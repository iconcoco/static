<template>
    <div class="fadeIn">
         <div class="table-container">
            <p class="tab-ul">
                <!-- <span class="active">全部 <i>100</i></span> -->
                <span v-for="(item,index) in STATUS" :key="index" :class="{active:form.status==item.code}"
                    @click="statusClick(item.code)"
                >
                    {{item.status}} <i>{{item.count}}</i>
                </span>
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

                <el-form-item label="入账时间：" class="widthAuto">
                    <el-date-picker
                        v-model="reportTime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="起始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="出账时间：" class="widthAuto">
                    <el-date-picker
                        v-model="bilingTime"
                        type="datetimerange"
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

        <Block title="VAT代缴税入账列表">
            <ElTable :data="table" border >
              <ElTableColumn prop="customerNo" label="客户ID"></ElTableColumn>
              <ElTableColumn prop="customerName" label="客户名称"></ElTableColumn>
              <ElTableColumn prop="" label="出账类型"></ElTableColumn>
              <ElTableColumn prop="realAmount" label="净入账金额">
                  <template slot-scope="scoped">
                      {{scoped.row.realAmount/100}}
                  </template>
              </ElTableColumn>
              <ElTableColumn prop="completeTime" label="入账时间">
                  <template slot-scope="scoped">
                      {{formatTimer(scoped.row.completeTime)}}
                  </template>
              </ElTableColumn>
              <ElTableColumn prop="amount" label="应出账金额">
                   <template slot-scope="scoped">
                      {{scoped.row.amount/100}}
                  </template>
              </ElTableColumn>
              <ElTableColumn prop="realAmount" label="净出账金额">
                   <template slot-scope="scoped">
                      {{Math.abs( (scoped.row.realAmount - scoped.row.amount)/100)}}
                  </template>
              </ElTableColumn>
              <ElTableColumn prop="chargeFee" label="出账手续费"></ElTableColumn>
              <ElTableColumn prop="currency" label="出账币种"></ElTableColumn>
              <ElTableColumn prop="taxPayUpdateTime" label="出账时间">
                  <template slot-scope="scoped">
                      {{formatTimer(scoped.row.taxPayUpdateTime)}}
                  </template>
              </ElTableColumn>
              <ElTableColumn prop="taxPayReceipt" label="出账回执">
                    <template slot-scope="scoped">
                        <a class="primary" 
                        v-if="scoped.row.taxPayReceipt" target="_blank" 
                        :href="`${download}?fileId=${scoped.row.taxPayReceipt}`">
                            <i class="fa fa-cloud-download"></i> 下载回执单
                        </a>
                    </template>
              </ElTableColumn>
              <ElTableColumn prop="status" label="状态">
                  <template slot-scope="scoped">
                      {{fineValName(scoped.row.status,STATUS,'status','code')}}
                  </template>
              </ElTableColumn>
              <ElTableColumn prop="" label="操作">
                  <template slot-scope="scoped">
                      <a href="javascript:;" class="primary" @click="jumper(scoped.row.id)">查看详情</a>
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
import {vatrecordGetTaxPage,vatrecordGetTaxStatistics,
download} from './../../../utils/axios/api.js';
import mixin from '../../../ext/mixin.js';
import { formatTimer } from '../../../utils/common.js';
export default {
    mixins:[mixin()],
    data(){
        return{
            download:download,
            form:{
               status:'',
                customerNo:'',
                customerName:'',
                pageNum:1,
                pageSize:10,
                totalSize:1,
            },
            reportTime:null,
            bilingTime:null,

            table:[],
            STATUS:[
                {code:4,status:'支付中'},
                {code:5,status:'缴税成功'},
                {code:6,status:'缴税失败'},
                {code:7,status:'财务付款中'},
            ]
        }
    },
    methods:{
         __LOADING(){
            this.bindFormSubmit();
        },
        statusClick(status){
            if(status==0) return;
            this.form.status = status;

            this.bindFormSubmit();
        },
        loadingQuery(){
             let formData = Object.assign({
                startTime:this.reportTime? this.reportTime[0] : '',
                endTime:this.reportTime? this.reportTime[1] : '',
                outStartTime:this.bilingTime? this.bilingTime[0] : '',
                outEndTime:this.bilingTime? this.bilingTime[1] : '',
            },this.form);

            vatrecordGetTaxPage(formData).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                    this.form.totalSize=res.page.total;
                }else{
                    this.$message.error(res.msg);
                }
            });

            vatrecordGetTaxStatistics().then(res=>{
                if(res.code==0){
                    this.STATUS.forEach(item=>{
                        let obj = res.data.find(innerItem=>{
                            return innerItem.status == item.code
                        });

                        item.count = obj.count
                    });
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindFormSubmit(){
            this.form.pageNum = 1;
            this.loadingQuery();
        },
        reset(){
             let n = ['pageNum','pageSize','totalSize'];
            for (const key in this.form) {
                if(!n.includes(key)){
                    this.form[key] = ""
                }
            };

            this.reportTime=null;
            this.bilingTime=null;
        },
        pageChange(size,per){
            this.form.pageNum = size;
            this.form.pageSize = per;
            this.loadingQuery();
        },
        jumper(id){
            let name = 'vatBillingDetail';
            let params = this.table.find(item=>{
                return item.id == id;
            })
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

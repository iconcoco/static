<template>
    <div class="fadeIn">
        <div class="table-container ">
            <div class="block">
                <h5>缴税信息</h5>
                <ul class="item-container">
                    <li><span>客户ID：</span>{{PAGEDATA.customerNo}}</li>
                    <li><span>申报国家：</span>{{PAGEDATA.countryCode}}</li>
                    <li><span>报税金额：</span>{{PAGEDATA.amount}}</li>
                    <li><span>申报截止日：</span></li>
                    <li><span>状态：</span>{{fineValName(PAGEDATA.status,STATUS,'name','status')}}</li>
                </ul>
            </div>

            <div class="block" v-if="
                [2,6].includes(PAGEDATA.status)
            ">
                <h5>{{fineValName(PAGEDATA.status,STATUS,'name','status')}}原因</h5>
                <ul class="failReason">
                    <li>{{PAGEDATA.failReason}}</li>
                </ul>
            </div>

            <div class="block">
                <h5>税局信息</h5>
                <ul class="item-container">
                    <li><span>税局机构：</span>{{PAGEDATA.taxBureauName}}</li>
                    <li><span>收款账号 Account Number：</span>{{PAGEDATA.taxBureauAccount}}</li>
                    <li><span>银行识别码 BIC：</span>{{PAGEDATA.taxBureauBic}}</li>
                    <li><span>银行名称 Bank Name：</span>{{PAGEDATA.taxBureauBankName}}</li>
                    <li><span>路由号码 Sort Code：</span>{{PAGEDATA.taxBureauRouting}}</li>
                    <li><span>账户名称 Account Name：</span>{{PAGEDATA.taxBureauAccountName}}</li>
                </ul>
            </div>
            <!-- {{PAGEDATA.status}}
    {{[1,3].includes(PAGEDATA.status)}} -->
            <div class="block">
                <h5>缴税审核信息</h5>
                <table>
                    <thead>
                        <tr>
                            <th v-if="[1,3].includes(PAGEDATA.status)">操作</th>
                            <th>税务支付信息文件</th>
                            <th>Reference/参考号</th>
                            <th>支付信息上传时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td v-if="[1,3].includes(PAGEDATA.status)">
                                 <template v-if="PAGEDATA.status==1">
                                    <ElButton type="primary" @click="toPass('请确认支付信息审核通过！',5)">支付信息审核通过</ElButton>
                                    <ElButton type="danger"  @click="changeModel(true,'FailModel')">支付信息审核失败</ElButton>
                                 </template>
                                 <template v-if="PAGEDATA.status==3">
                                     <ElButton type="primary" @click="toPass('请确认发起付款！',3)">发起付款</ElButton>
                                 </template>
                            </td>
                            <td>
                                <a class="primary" v-if="PAGEDATA.taxPayFile" target="_blank" :href="`${download}?fileId=${PAGEDATA.taxPayFile}`"><span class="fa fa-cloud-download"></span> 下载税务支付信息文件</a>
                            </td>
                            <td>{{PAGEDATA.referenceNo}}</td>
                            <td>{{formatTimer(PAGEDATA.taxPayFileTime)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="block">
                <h5>缴税记录</h5>
                <ElTable :data="payRecord" border >
                    <ElTableColumn prop="countryCode" label="申报国家">
                        <template slot-scope="scope">
                            {{fineValName(scope.row.countryCode,AllNationCode,'nation','code')}}
                        </template>
                    </ElTableColumn>
                    <ElTableColumn prop="taxPayFile" label="支付信息">
                        <template slot-scope="scope">
                            <a class="primary" v-if="scope.row.taxPayFile" target="_blank" :href="`${download}?fileId=${scope.row.taxPayFile}`"><span class="fa fa-cloud-download"></span> 下载支付信息</a>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn prop="amount" label="缴税金额"></ElTableColumn>
                    <ElTableColumn prop="taxPayReceipt" label="支付回执">
                        <template slot-scope="scope">
                            <a class="primary" v-if="scope.row.taxPayReceipt" target="_blank" :href="`${download}?fileId=${scope.row.taxPayReceipt}`"><span class="fa fa-cloud-download"></span> 下载支付回执</a>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn prop="createTime" label="申请代缴税时间">
                        <template slot-scope="scope">
                            {{formatTimer(scope.row.createTime)}}
                        </template>
                    </ElTableColumn>
                    <ElTableColumn prop="taxPayUpdateTime" label="代缴税完成时间">
                         <template slot-scope="scope">
                            {{formatTimer(scope.row.taxPayUpdateTime)}}
                        </template>
                    </ElTableColumn>
                </ElTable>
            </div>

            <div class="block">
                <h5>备注</h5>
                <p  class="fr" style="margin-top: -18px;"><el-button type="primary" @click="changeModel(true,'RemarkModel')">新增备注</el-button></p>
                 <ul class="remark">
                     <li v-for="(item,index) in remarkList" :key="index">
                        <p>#{{index+1}} <i>{{item.operatorName}}</i> 于 {{formatTimer(item.createdTime)}}</p>
                        <p class="content">{{item.remark}}</p>
                    </li>
                </ul>
            </div>

        </div>

        <AdminModel title="备注" 
                v-model="RemarkModel.flag"
                :confirm="modelConfirm"
            >
            <el-input
                class="textarea"
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="RemarkModel.value">
            </el-input>
        </AdminModel>

        <AdminModel title="审核失败原因" 
                v-model="FailModel.flag"
                :confirm="FailModelConfirm"
            >
            <el-input
                class="textarea"
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="FailModel.value">
            </el-input>
        </AdminModel>
    </div>
</template>

<script>
import AdminModel from './../../../components/adminModal.vue';
import { queryPaytaxList,
    download,
    vatPaytaxSubmit,
    vatPaytaxSubmitPay,
    vatrecordSaveRemark,
    vatrecordGetRemark
} from './../../../utils/axios/api.js';

import { formatTimer } from '../../../utils/common.js';
import {PAY_STATUS} from './var.js';
import { 
    AllNationCode
} from '../../../ext/localBase.js';

export default {
    data(){
        return{

            PAGEDATA:{},
            payRecord:[],
            remarkList:[],

            RemarkModel:{
                flag:false,
                value:'',
            },

            FailModel:{
                flag:false,
                value:'',
            },
            download:download,
            AllNationCode:AllNationCode,
            STATUS:PAY_STATUS
        }
    },
    created(){
        let id = this.$route.params.id;
        if(!id) return this.$router.push({name:'vatReporting'});
        this.loadingQuery({id});
    },
    methods:{
        loadingQuery(params,bol){
           let fd = Object.assign({ 
                pageNum:1,
                pageSize:10},params)

            queryPaytaxList(fd).then(res=>{
                if(res.code==0){
                   !bol && (this.PAGEDATA = res.data[0]);
                    !bol && this.loadingQuery({customerNo:this.PAGEDATA.customerNo},true);
                    bol && (this.payRecord = res.data);
                }else{
                    this.$message.error(res.msg);
                }
            });

            !bol && this.queryRemarkList(params.id);
        },
        changeModel(bol,target){
            this[target].flag = bol;
        },
        queryRemarkList(id){
            vatrecordGetRemark({
                type:'3',
                id
            }).then(res=>{
                if(res.code==0){
                    this.remarkList = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        modelConfirm(){
            if(!this.RemarkModel.value) return this.$message.warning(`请输入备注内容！`);
            
            vatrecordSaveRemark({
                type:'3',
                id:this.PAGEDATA.id,
                remark:this.RemarkModel.value
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`添加备注成功！`);
                    this.changeModel(false,'RemarkModel');
                    this.RemarkModel.value="";

                    this.queryRemarkList(this.PAGEDATA.id);
                }else{
                    this.$message.error(res.msg);
                }
            });

        },
        //审核通过或失败
        changeStatus(bol,failReason){
            vatPaytaxSubmit({
                id:this.PAGEDATA.id,
                flag:bol,
                failReason
            }).then(res=>{
                if(res.code==0){
                      //修改成功
                    this.$message.success(`修改成功！`);
                    this.loadingQuery({id:this.PAGEDATA.id});
                    this.changeModel(false,'FailModel');
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        toPass(msg,status){
            this.$confirm(msg,'提示').then(()=>{
                status==5 &&  this.changeStatus(true);
                status==3 &&  vatPaytaxSubmitPay({id:this.PAGEDATA.id}).then(res=>{
                     if(res.code==0){
                        this.$message.success(`修改成功！`);
                        this.loadingQuery({id:this.PAGEDATA.id});
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            })
            .catch(()=>{})
        },
        //
        FailModelConfirm(){
            if(!this.FailModel.value) return this.$message.warning(`请输入异常原因`);
            this.changeStatus(false,this.FailModel.value);
        },
        formatTimer(code){
            return formatTimer(code)
        },
         fineValName(code,LIST,NAME,itemCode){
            let I = LIST.find(item=>{
                return item[itemCode]==code;
            });
            if(I){
                return I[NAME];
            }
        },
    },
    components:{
        AdminModel
    }
}
</script>


<style lang="scss" scoped>
@import './../../../css/element-variables.scss';
.block{
    padding-top: 10px;
    border-bottom: 1px solid #e5e5e5;
}
  h5{
        font-size: 14px;
        color: #333;
    }

.item-container{
    padding: 20px 0;
    li{
        display: inline-block;
        margin-right: 40px;
        color: #666;
        min-width: 20%;
        // max-width: 20%;
        line-height: 30px;
        span{
            color: #333;
        }
    }  
}

.textarea{
    margin: 20px 0;
}

.remark{
    padding: 15px 0;
    li{
        font-size: 14px;   
        p{
            color: #666;
            padding: 5px 0;
        }
        .content{
            color: #333;
        }
        i{
            color: $--color-primary;
        }
    }
}

.failReason{
    background-color: #f1f1f1;
    margin: 10px 0;
    li{
        margin: 5px 0;
        color: $--color-danger;
    }
}
</style>

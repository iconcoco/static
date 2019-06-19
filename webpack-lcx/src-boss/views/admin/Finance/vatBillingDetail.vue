<template>
    <div class="fadeIn">
        <div class="table-container ">
            <h5>状态：<span class="primary">{{fineValName(PAGEDATA.status,STATUS,'status','code')}}</span> </h5>
            <div class="block" v-if="[6].includes(PAGEDATA.status)">
                <h5>{{fineValName(PAGEDATA.status,STATUS,'status','code')}}原因</h5>
                <ul class="failReason">
                    <li> <i class="point no"></i> {{PAGEDATA.failReason}}</li>
                </ul>
            </div>
            <div class="block">
                <h5>入账信息</h5>
                <ul class="item-container">
                    <li><span>客户ID：</span>{{PAGEDATA.customerNo}}</li>
                    <li><span>净入账金额：</span>{{PAGEDATA.realAmount/100}}</li>
                    <li><span>入账币种：</span>{{PAGEDATA.currency}}</li>
                    <li><span>入账时间：</span>{{PAGEDATA.customerPayTime}}</li>
                </ul>
            </div>

            <div class="block">
                <h5>出账信息</h5>
                <ul class="item-container">
                    <li><span>应出账金额：</span>{{PAGEDATA.amount}}</li>
                    <li><span>净出账金额：</span>{{PAGEDATA.realAmount/100}}</li>
                    <li><span>出账手续费：</span>{{Math.abs( (PAGEDATA.realAmount - PAGEDATA.amount)/100)}}</li>
                    <li><span>出账币种：</span>{{PAGEDATA.currency}}</li>
                    <li><span>出账时间：</span>{{PAGEDATA.taxPayTime}}</li>
                    <li><span>出账成功时间：</span>{{PAGEDATA.taxPayUpdateTime}}</li>
                    <li><span>支付回执：</span>
                        <a class="primary" v-if="PAGEDATA.taxPayReceipt" target="_blank" :href="`${download}?fileId=${PAGEDATA.taxPayReceipt}`"><i class="fa fa-cloud-download"></i> 下载支付回执</a>
                         <el-upload
                            :show-file-list='false'
                            name='upFile'   
                            :action="actionsUpload"
                            :on-success="bindUploadSuccess"
                            :on-error="bindUploadError"
                            style="display:inline-block;"
                            >
                            <el-button type="primary">重新上传支付回执</el-button>
                        </el-upload>
                    </li>
                </ul>
            </div>

            <div class="block">
                <h5>付款账户信息</h5>
                <ul class="item-container">
                    <li><span>税局机构：</span>{{PAGEDATA.taxBureauName}}</li>
                    <li><span>收款账号 Account Number：</span>{{PAGEDATA.taxBureauAccount}}</li>
                    <li><span>银行识别码 BIC：</span>{{PAGEDATA.taxBureauBic}}</li>
                    <li><span>路由号码 Sort Code：</span>{{PAGEDATA.taxBureauRouting}}</li>
                    <li><span>银行名称 Bank Name：</span>{{PAGEDATA.taxBureauBankName}}</li>
                    <li><span>账户名称 Account Name：</span>{{PAGEDATA.taxBureauAccountName}}</li>
                    <li><span>支付信息：</span>
                    <a class="primary" v-if="PAGEDATA.taxPayFile" target="_blank" :href="`${download}?fileId=${PAGEDATA.taxPayFile}`"><i class="fa fa-cloud-download"></i> 下载支付信息</a>
                    </li>
                    <li><span>Reference/参考号：</span>{{PAGEDATA.referenceNo}}</li>
                </ul>
            </div>

            <div class="block" v-if="PAGEDATA.status != 5">
                <h5>操作</h5>
                <p style="margin-bottom:10px;">
                    <el-button type="primary" v-if="PAGEDATA.status==4" @click="changeModel(true,'payInfoModel')">确认已付款至税局</el-button>
                    <template v-if="[6,7].includes(PAGEDATA.status)">
                        <ElButton type="primary" @click="changeApplyStatus">付款成功</ElButton>
                        <ElButton type="primary" @click="changeModel(true,'unNormalModel')" plain>付款失败</ElButton>
                    </template>
                </p>
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

         <AdminModel title="异常原因" 
            v-model="unNormalModel.flag"
            :confirm="unNormalModelConfirm"
        >
            <el-input
                class="textarea"
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="unNormalModel.value">
            </el-input>
        </AdminModel>

         <AdminModel title="确认已经提交至税局" 
            v-model="payInfoModel.flag"
            :confirm="payInfoModelConfirm"
            class="vat-upload-model"
        >
            <el-form :model="payInfoModel" :inline="true">
                <ElFormItem label="净出账金额">
                    <ElInput v-model="payInfoModel.amount" placeholder="请输入经出账金额"></ElInput>
                </ElFormItem>

                <ElFormItem label="支付回执">
                    <el-upload
                        :show-file-list="false"
                        name='upFile'   
                        :action="actionsUpload"
                        :on-success="(res, file)=>{ return bindUploadSuccess(res,file,'taxPayReceipt') }"
                        :on-error="bindUploadError"
                        style="display:inline-block;"
                        >
                         <el-button type="primary">上传支付回执</el-button>
                    </el-upload>
                     <span  v-if="payInfoModel.taxPayReceipt_name">{{payInfoModel.taxPayReceipt_name}}</span>
                </ElFormItem>
            </el-form>
        </AdminModel>
    </div>
</template>

<script>
import AdminModel from './../../../components/adminModal.vue';
import {
    upload,
    download,
    vatrecordGetRemark,
    vatrecordSaveRemark,
    vatrecordConfirmToTax,
    vatrecordUpdateStatus,
    vatrecordUpdateTax,
    vatrecordGetTaxById
} from './../../../utils/axios/api.js';
import { formatTimer } from '../../../utils/common.js';

export default {
    data(){
        return{
            PAGEDATA:{},
            actionsUpload:upload,
            download:download,
            remarkList:[],

            RemarkModel:{
                flag:false,
                value:'',
            },

            payInfoModel:{
                flag:false,
                taxPayReceipt:'',
                taxPayReceipt_name:'',
                amount:'',
            },

            unNormalModel:{
                flag:false,
                value:'',
            },

            STATUS:[
                {code:4,status:'支付中'},
                {code:5,status:'缴税成功'},
                {code:6,status:'缴税失败'},
                {code:7,status:'财务付款中'},
            ]

        }
    },
    created(){
        let OBJ = this.$route.params;
        let m = this.$store.state.Memory.vatBillingDetail;

        if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"vatBilling"});
        
        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
             let ID = OBJ.id;
            this.loadingQuery(ID);
        };

    },
    methods:{
        loadingQuery(id){
            vatrecordGetTaxById({id}).then(res=>{
                if(res.code==0){
                    this.PAGEDATA = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });

            this.queryRemarkList(id)
        },
        queryRemarkList(id){
            vatrecordGetRemark({
                type:'4',
                id
            }).then(res=>{
                if(res.code==0){
                    this.remarkList = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        changeModel(bol,target){
            this[target].flag = bol;
        },
        modelConfirm(){
            if(!this.RemarkModel.value) return this.$message.warning(`请输入备注内容！`);
            
            vatrecordSaveRemark({
                type:'4',
                id:this.PAGEDATA.id,
                remark:this.RemarkModel.value
            }).then(res=>{
                if(res.code==0){
                    this.changeModel(false,'RemarkModel');
                    this.queryRemarkList(this.PAGEDATA.id);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        unNormalModelConfirm(){
            if(!this.unNormalModel.value) return this.$message.warning(`请输入异常原因！`);
            this.vatrecordUpdateStatus({
                id:this.PAGEDATA.id,
                status:6,
                remark:this.unNormalModel.value
            });
        },
        payInfoModelConfirm(){
            if(!this.payInfoModel.amount) return this.$message.error(`请输入金额！`);
            if(!this.payInfoModel.taxPayReceipt) return this.$message.error(`请上传支付回执！`);

            vatrecordConfirmToTax({
                id:this.PAGEDATA.id,
                amount:this.payInfoModel.amount,
                taxPayReceipt:this.payInfoModel.taxPayReceipt,
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`上传成功！`);

                    this.changeModel(false,"payInfoModel");

                    this.loadingQuery(this.PAGEDATA.id);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        vatrecordUpdateStatus(params){
            vatrecordUpdateStatus(params).then(res=>{
                if(res.code==0){
                    this.$message.success(`上传成功！`);
                    this.loadingQuery(this.PAGEDATA.id);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        changeApplyStatus(){
             this.$confirm('请确认已成功付款至税局！','提示').then(()=>{
                 this.vatrecordUpdateStatus({
                     id:this.PAGEDATA.id,
                     status:5,
                 })
            })
            .catch(()=>{})
        },
        vatrecordUpdateTax(taxPayReceipt){
            vatrecordUpdateTax({
                id:this.PAGEDATA.id
                ,taxPayReceipt
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`上传成功！`);
                    this.loadingQuery(this.PAGEDATA.id);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindUploadSuccess(res,file){
            if(res.code==0){
                if(this.PAGEDATA.status == 4){
                    this.payInfoModel.taxPayReceipt = res.data.uuid;
                    this.payInfoModel.taxPayReceipt_name = file.name;
                }else{
                    this.vatrecordUpdateTax(res.data.uuid)
                }
            }else{
                this.$message.error(res.msg);
                this.payInfoModel.taxPayReceipt_name = "";
            }
        },
        bindUploadError(){
            this.$message.error(`上传失败，请重新上传！`);
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
    },
    components:{
        AdminModel
    },
    destroyed(){
        let tabArr = this.$store.state.TabList;
        tabArr.forEach(item=>{
            if(item.name=='vatBillingDetail'){
                return  this.$store.commit('setModelRecordData',{
                     key:'vatBillingDetail',
                     data:this._data
                 });
            }
        });
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

form{
    padding-top: 20px;
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

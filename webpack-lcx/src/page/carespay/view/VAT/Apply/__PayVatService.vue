<template>
    <div class="payVatService fadeIn">
       <div v-show="!toPay" class="fadeIn">
            <h2 class="banner-module-title">确认VAT申请信息</h2>
            <CTable>
                <table>
                    <thead>
                        <tr>
                            <th>申报国家</th>
                            <th>服务类型</th>
                            <th>公司名称</th>
                            <th>法人名称</th>
                            <th>申请人联系电话</th>
                            <th>申请人邮箱</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{fineValName(DATA.data.declaredCountry,AllNationCode,'nation','code')}}</td>
                            <td>{{DATA.data.type==1 ? '注册+首年申报' :'单次注册'}}</td>
                            <td>{{DATA.data.dutyCompany}}</td>
                            <td>{{DATA.data.dutyLegalPerson}}</td>
                            <td>{{DATA.data.phone}}</td>
                            <td>{{DATA.data.email}}</td>
                        </tr>
                    </tbody>
                </table>
            </CTable>
            <p>
                费用：<span class="cares-color">{{DATA.data.price/100}}CNY</span>
            </p>

            <span class="cares-button-primary" @click="changePayPage(true)">确认付款</span>
            <span class="cares-button-primary pain" @click="jumpPage">返回上级页面</span>
       </div>

       <div v-show="toPay"  class="Apply-vat-form fadeIn">
            <h2 class="banner-module-title">我的收银台</h2>
            <el-form :model="form" >
                <h3>收款账号信息<span class="cares-color">（请将对应VAT服务费汇款至CaresPYA对公账户）</span></h3>
                <div class="form-item">
                    <span>公司名称</span>
                    <div class="item">凯蓝仕金融服务（深圳）有限公司</div>
                </div>

                <div class="form-item">
                    <span>开户行</span>
                    <div class="item">招商银行股份有限公司深圳高新园支行</div>
                </div>

                <div class="form-item line">
                    <span>银行账号</span>
                    <div class="item">755934580810902</div>
                </div>
                <h3>汇款信息<span class="cares-color">（付款成功后，请将您的汇款信息填写至下发表单，此信息为您的支付凭证，请如实填写）</span></h3>
                <ElFormItem label="银行账号" name="BANKNUMBER">
                    <ElInput v-model="form.bankAccount" name="BANKNUMBER" @blur="bindIptBlur('BANKNUMBER')" placeholder="请输入银行账号"></ElInput>
                </ElFormItem>

                <ElFormItem label="银行户名" name="ACCOUNTNAME">
                    <ElInput v-model="form.bankHolder" name="ACCOUNTNAME" @blur="bindIptBlur('ACCOUNTNAME')" placeholder="请输入银行户名"></ElInput>
                </ElFormItem>

                <div class="form-item line lineTop">
                    <span>应付金额</span>
                    <div class="item">
                        <span class="cares-color fontSize">￥{{DATA.data.price/100}}</span>
                    </div>
                </div>

                <span class="cares-button-primary" @click="submitPayInfo">提交付款信息</span>
                <span class="cares-button-primary pain" @click="jumpPage">返回上级页面</span>
            </el-form>
       </div>
    </div>
</template>

<script>
import CTable from './../../../../../components/CTable.vue';
import {AllNationCode} from './../../../utils/localbase.js';
import verification from './../../../../../js/verification.js';
import { vatrecordConfirmPay } from './../../../../../js/api.js';

export default {
    data(){
        return {
            toPay:false,
            AllNationCode:AllNationCode,
            form:{
                bankAccount:'',
                bankHolder:'',
            },

            ING:false,
        }
    },
    props:["DATA"],
    created(){
    },
    methods:{
        jumpPage(){
             this.$emit('jumpPage',{
                page:'applyList'
            });
        },
        fineValName(code,LIST,NAME,itemCode){
            let I = LIST.find(item=>{
                return item[itemCode]==code;
            });
            if(I){
                return I[NAME];
            }
        },
        submitPayInfo(){
            let must = ['BANKNUMBER','ACCOUNTNAME'];
            let flag = true;

            must.forEach(key =>{
               if(!this.bindIptBlur(key)) flag = false;
            });

            if(!flag) return;

            if(this.ING) return;
            this.ING = true;

            let { bankAccount,bankHolder } = this.form;

            vatrecordConfirmPay({
                id:this.DATA.data.id
                ,bankAccount,bankHolder
            }).then(res=>{
                this.ING = false
                if(res.code==0){
                    this.$router.push({
                        name:'AuthenticationDone',
                        params:{
                            source:'VATServicePrice'
                        }
                    })
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        changePayPage(bol){
            this.toPay = bol
        },
        bindIptBlur(name){
            let attr
            switch(name){
                case 'BANKNUMBER':{ attr = 'bankAccount' }break;
                case 'ACCOUNTNAME':{ attr = 'bankHolder' }break;
            }
           let value =  this.form[attr];
           return verification(name,value);
        },
    },
    components:{
        CTable
    }
    
}
</script>

<style lang="scss" scoped>
.payVatService{
    padding-bottom: 20px;
}
p{
    padding: 20px 0;
    border-bottom: 1px solid #f1f1f1;
    margin-bottom: 20px;
    span{
        font-size: 18px;
        font-weight: bold;
    }
}

.fontSize{
    font-size: 18px;
    font-weight: bold;
}

.cares-button-primary{
    margin-right: 15px;
}

form{
    h3{
        font-size: 16px;
        font-weight: normal;
        line-height: 80px;
        color: #333;
        span{
            font-size: 14px;
        }
    }
    .el-input{
            width: 300px;
        }
    .form-item{
        margin-bottom: 20px;
        &.line{
            padding-bottom: 20px;
            margin-bottom: 0;
        }

        &.lineTop{
            border-top: 1px solid #f1f1f1;
            margin-bottom: 20px;
            padding-top: 20px;
        }
    }
}
</style>

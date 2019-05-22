<template>
    <div>
        <h2 class="banner-module-title">
            VAT缴税
            <p>
                （当前支持英、德、法、意、西、捷克、波兰VAT缴费。请根据您需缴费的税务局当地的税单及法定货币选择缴费金额和币种。）
                <a href="javascript:;" class="cares-color">其他常见问题</a>
            </p>
        </h2>
        <el-form :model="form" class="Apply-vat-form">
            <el-form-item label="税局机构" name="countryCode">
                <el-select 
                @blur="bindIptBlur('countryCode')"
                v-model="form.countryCode" placeholder="请选择税务机构" name="countryCode">
                    <el-option v-for="(item,index) in taxBureau" :key="index"
                        :label="item.name"
                        :value="item.countryCode"
                    ></el-option>
                </el-select>
            </el-form-item>
            
             <el-form-item name="taxBureauAccount" :label="form.countryCode=='GB' ? '收款账号 Account Number':'国际银行账号 IBAN'">
                 <el-input 
                @blur="bindIptBlur('taxBureauAccount')"
                 name="taxBureauAccount" v-model="form.taxBureauAccount" 
                 
                 :placeholder="form.countryCode=='GB' ? '请填写收款账号':'请填写税务局国际银行IBAN号'"></el-input>
             </el-form-item>
                 <!-- 英国 -->
            <template v-if="form.countryCode=='GB'">
                <el-form-item name="taxBureauRouting" label="路由号码 Sort Code">
                    <el-input name="taxBureauRouting" 
                     @blur="bindIptBlur('taxBureauRouting')"
                    v-model="form.taxBureauRouting" placeholder="请填写路由号"></el-input>
                </el-form-item>
             </template>

            <el-form-item name="taxBureauBic" label="银行识别码 BIC">
                <el-input name="taxBureauBic" 
                @blur="bindIptBlur('taxBureauBic')"
                v-model="form.taxBureauBic" placeholder="请填写银行BIC号"></el-input>
            </el-form-item>

            <el-form-item name="taxBureauBankName" label="银行名称 Bank Name">
                <el-input name="taxBureauBankName" 
                @blur="bindIptBlur('taxBureauBankName')"
                v-model="form.taxBureauBankName " placeholder="请填写英文银行账户名称"></el-input>
            </el-form-item>

            <el-form-item name="taxBureauAccountName" label="账户名称 Account Name">
                <el-input name="taxBureauAccountName" 
                 @blur="bindIptBlur('taxBureauAccountName')"
                v-model="form.taxBureauAccountName" placeholder="请填写英文账户名称"></el-input>
            </el-form-item>

            <div class="btn">
                <span class="cares-button-primary" @click="nextTo">下一步</span>
                <span class="cares-button-primary pain" @click="returnBack">返回</span>
            </div>
            <p class="ING fs12">（请准确填写并确认税局信息，避免影响缴税进度）</p>
        </el-form>
    </div>
</template>

<script>
import {AllNationCode} from './../../../utils/localbase.js';
import verification from './../../../../../js/verification.js';

   import {
        removeClass
    } from '../../../../../js/common.js';

import { 
    vatPaytaxApply,
    queryTaxBureauList
} from './../../../../../js/api.js';
export default {
    props:['Data'],
    data(){
        return {
            form:{

                declarationId:'',
                taxPayFile:'',
            //     taxNo  税号
            //     frontAmount 缴税金额
            //     referenceNo  参考号
                currency:'',
                countryCode:'',
                taxBureauName:'',       //税局名称
                taxBureauAccount :'',       //税局账号
                taxBureauBic:'',            //BIC识别码

                taxBureauRouting:'',        //路油号
                taxBureauBankName:'',       //银行名称
                taxBureauAccountName:'',       //账号名称
            },
            AllNationCode:AllNationCode,
            taxBureau:[],       //税局列表
        }
    },
    created(){
        this.form.declarationId = this.Data.declarationId || '';
        this.form.taxPayFile = this.Data.taxPayFile || '';
        
        this.queryTaxBureauList();
    },
    methods:{
        //查询税局列表
        queryTaxBureauList(){
            queryTaxBureauList().then(res=>{
                if(res.code==0){
                    this.taxBureau = res.data;

                     //给一个默认值
                    this.form.countryCode = 'GB';
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        nextTo(){
            let must = ['countryCode','taxBureauAccount','taxBureauBic','taxBureauBankName','taxBureauAccountName'];
            if(this.form.countryCode=='GB')  must.push('taxBureauRouting');

            let flag = true;
            must.forEach(key=>{
                if(!this.bindIptBlur(key)) flag = false;
            });
            
            if(flag){
                this.$emit('jumpTo',{
                    step:'2',
                    params:this.form
                });
            };

        },
        returnBack(){
            this.$router.push({
                name:"Reflesh",
                params:{
                    name:"VATpay"
                }
            });
        },
        bindIptBlur(name){
            let value;
            value = this.form[name];
           return verification(name,value);
        },
    },
    watch:{
        "form.countryCode"(code){
            let {
                name,bic,accountNumber,routingNo,bankName,accountName,currency
            } = this.taxBureau.find(item=>{
                return item.countryCode == code;
            });

            this.form.taxBureauName = name || '';
            this.form.taxBureauBic = bic || '';
            this.form.taxBureauAccount = accountNumber || '';
            this.form.taxBureauRouting = routingNo || '';
            this.form.taxBureauBankName = bankName || '';
            this.form.taxBureauAccountName = accountName || '';


            this.form.currency = currency;

                let nodes = document.querySelectorAll('.is-error');
                for(let i=0;i<nodes.length;i++){
                     removeClass(nodes[i],'is-error');
                     nodes[i].querySelector('.el-form-item__error').remove();
                }

        }
    }
}
</script>


<style lang="scss" scoped>
.banner-module-title{
    height: auto;
    line-height: normal;
    font-weight:bold;
    padding: 20px 0;
    font-size: 18px;
    p{
        margin-top: 5px;
        font-size: 12px;
        font-weight: normal;
    }
}

form{
    padding-top: 20px;
    .fs12{
        margin-top: 10px;
    }

    .btn{
        padding-top: 40px;
        border-top: 1px solid #f1f1f1;
        .cares-button-primary{
            // height: 28px;
            // line-height: 28px;
            // border-radius: 14px;
            min-width: 80px;;
            margin-right: 10px;
        }
    }
}

.fs12{
    font-size: 12px;
}

.Apply-vat-form{
    .el-select,
    .el-input{
        width: 240px;
    }
}
</style>

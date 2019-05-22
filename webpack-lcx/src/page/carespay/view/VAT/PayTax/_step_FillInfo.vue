<template>
    <div class="fadeIn">
         <h2 class="banner-module-title">
            VAT缴税
            <p><span>出款账户：</span>{{Data.currency=='EUR'? '欧元' :'英镑'}}账户GBP</p>
            <p><span>出款币种：</span>{{Data.currency}}</p>
        </h2>
        <el-form :model="form" class="Apply-vat-form">
            <el-form-item label="缴税金额" name="frontAmount" :class="(enableMoney==0 || form.frontAmount > enableMoney)? ' is-error':''">
                <ElInput name="frontAmount" 
                 @blur="bindIptBlur('frontAmount')"
                v-model="form.frontAmount" :placeholder="`可用余额：${enableMoney}`"></ElInput>
                <div class="el-form-item__error"
                    v-if="enableMoney==0 || form.frontAmount > enableMoney"
                >账户资金不足，无法代理缴费，请预留足额店铺资金后，再申请代缴费</div>
            </el-form-item>

            <el-form-item label="增值税注册号" name="taxNo" v-if="Data.countryCode=='GB'">
                <ElInput name="taxNo" 
                 @blur="bindIptBlur('taxNo')"
                v-model="form.taxNo" placeholder="请输入增值税注册号"></ElInput>
                <p>请准确填写增值税注册号。HMRC分配给您的独一无二的9位数号码（例如：123456789）
                <br/> 您可以在增值税申报单或者HMRC网站上找到这个号码，或者咨询您的代理/会计师。</p>
            </el-form-item>

            <el-form-item label="Reference/参考号" name="referenceNo">
                <ElInput name="referenceNo" 
                 @blur="bindIptBlur('referenceNo')"
                v-model="form.referenceNo" placeholder="请输入参考号"></ElInput>
                <p>请准确填写{{fineValName(Data.countryCode,AllNationCode,'nation','code')}}税局或您的代理/会计师提供的参考号

                </p>
            </el-form-item>

            <div class="form-item" v-if="!Data.taxPayFile">
                <span>税务支付信息</span>
                <div class="item">
                    <p>为保证准确，成功缴纳VAT，请正确上传相关税务单据，支持格式JPG、JPEG、PNG、PDF</p>
                    <ul class="clearfix uploadBox">
                        <li>
                            <el-upload
                                name='upFile'   
                                :show-file-list='false'
                                :action="uploadefile"
                                :on-success="uploadFileSucess"
                                :on-error="bindUploadError"
                                :before-upload="(file)=>{ return BeforeUpload(file,'txt')}" 
                                >
                                    <label class="uploadButton">
                                        <img  v-if="form.taxPayFile" :src="`/general/download?fileId=`+form.taxPayFile" alt=""/>
                                        <i v-else class="el-icon-plus"></i>
                                    </label>
                            </el-upload>
                        </li>
                        <!-- <li class="details-example">
                            <a href="javascript:;" class="cares-color">
                                <i class="el-icon-search"></i>查看示例
                            </a>
                        </li> -->
                    </ul>
                   
                </div>
            </div>

             <div class="btn">
                <span class="cares-button-primary" @click="nextTo">下一步</span>
                <span class="cares-button-primary pain" @click="returnBack">返回</span>
            </div>
        </el-form>
    </div>
</template>

<script>
import {AllNationCode} from './../../../utils/localbase.js';
import verification from './../../../../../js/verification.js';
import { 
    uploadefile,
    vatPaytaxApply,
    customerAmountByCurrency
} from './../../../../../js/api.js';

export default {
    data(){
        return{
            form:{
                declarationId:'',
                taxPayFile:'',
                
                taxNo:'',
                frontAmount:'',
                referenceNo:'',
            },
            uploadefile:uploadefile,
            enableMoney:0,

            AllNationCode:AllNationCode,
            ING:false
        }
    },
    props:['Data'],
    created(){
        this.queryMoney(this.Data.currency);
        this.form.declarationId = this.Data.declarationId;
        this.form.taxPayFile = this.Data.taxPayFile;
    },
    methods:{
        queryMoney(currency){
            customerAmountByCurrency({currency}).then(res=>{
                if(res.code==0){
                    this.enableMoney = res.data || 0;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        uploadFileSucess(res){
            if(res.code==0){
                this.form.taxPayFile = res.data.uuid
            }else{
                this.$Message.error(res.msg);
            }
        },
        bindUploadError(){
            this.$Message.error(`上传失败，请重新上传！`);
        },
        BeforeUpload(){},
        nextTo(){
            let must = ['frontAmount','referenceNo'];
            if(this.Data.countryCode=='GB')  must.push('taxNo');

            let flag = true;
            must.forEach(key=>{
                if(!this.bindIptBlur(key)) flag = false;
            });

            if(!this.form.taxPayFile) return this.$Message.warning(`请上传税务支付信息！`),flag = false;;

            if(flag){
                if(this.ING) return;
                this.ING = true;

                let FD = Object.assign(this.Data,this.form);
                vatPaytaxApply(FD).then(res=>{
                    this.ING = false;
                    if(res.code==0){
                         this.$emit('jumpTo',{
                            step:'3',
                            params:{
                                amount:FD.frontAmount*100,
                                taxNo:FD.taxNo,
                                countryCode:FD.countryCode,
                                currency:FD.currency,
                                id:res.data
                            }
                        });
                    }else{
                        this.$Message.error(res.msg);
                    }
                })
               
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
            if(name=='frontAmount') return verification(name,value,this.enableMoney); 
           return verification(name,value);
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
.banner-module-title{
    height: auto;
    line-height: normal;
    font-weight:bold;
    padding: 20px 0;
    font-size: 18px;
    p{
        margin-top: 5px;
        font-weight: normal;
        font-size: 14px;
    }
}

form{
    padding-top: 20px;
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

    .form-item{
       margin-bottom: 20px;
        .item{
            vertical-align: top;
            p{
                line-height: 30px;
                font-size: 12px;
            }
        }
    }
}

.Apply-vat-form{
    .el-select,
    .el-input{
        width: 240px;
    }
}

.uploadBox{
    >li{
        display: inline-block;
        height: 148px;
        vertical-align: top;
        margin-right: 10px
    }
    .details-example{
        padding-top: 130px;
    }

    .uploadButton{
        display: inline-block;
        width: 148px;
        height: 148px;
        border: 1px dashed #e5e5e5;
        text-align: center;
        line-height: 148px;
        border-radius: 4px;
        font-size: 20px;
        color: #666;
       cursor: pointer; 
       img{
           vertical-align: top;
           width: 100%;
           height: 100%;
       }
    }
}

</style>

<template>
    <div  class="ebayPlat-container fadeIn">
        <!-- 未认证 -->
        <template v-if="ebayAuth==3">
            <a :href="URL" class="cares-button-primary pain">{{URL=='javascript:;' ? `正在生成...` : `前往eBay后台授权`}}</a>
            <span class="no authenNotice">温馨提示：请确保您在该店铺常用的IP环境进行操作，以免发生关联</span>
        </template>
        <!-- 认证失败 -->
        <template  v-if="ebayAuth==0" >
            <p style="font-size: 22px;color:#666;line-height:60px;"> <span class="ebay-no"></span> 授权失败，请尝试重新授权！ </p>
            <p style="margin-top:40px;"><span @click="bindToReAgree" class="cares-button-primary">重新授权</span></p>
        </template>
        <!-- 认证成功 -->
        <template v-if="ebayAuth==1">
            <div class="ebay-auth-success">
                <p class="success-fadeIn"> <span class="ebay-yes"></span> 您已成功授权！ </p>
            </div>

             <div v-if="RefuseReason.length" class="refuse-reason">
                <p>因为以下原因，您的店铺资料审核未通过：</p>
                <ul>
                    <li class="no" v-for="(item,index) in RefuseReason" :key="index">
                        <i class="point no"></i> {{item.remark}}
                    </li>
                </ul>
            </div>

             <div class="form-item" style="min-height:auto;margin-top:10px;"> <span class="bold" style="width:auto;">店铺信息</span></div>

            <el-form-item class="ebay-form-item" label="店铺名称" name="storeName">
                <el-input :disabled="(isEdit && ReturnAuditStatus('storeName'))" type="text" name="storeName" @blur="bindIptBlur('storeName')" v-model="form.storeName" placeholder="请输入您的店铺名称"></el-input>
            </el-form-item>

            <el-form-item class="ebay-form-item" label="eBay注册邮箱" name="ebayEmail">
                <el-input :disabled="(isEdit && ReturnAuditStatus('ebayEmail'))" type="text" name="ebayEmail" @blur="bindIptBlur('ebayEmail')" v-model="form.ebayEmail" placeholder="请输入您的eBay注册邮箱"></el-input>
            </el-form-item>

            <el-form-item class="ebay-form-item" label="店铺链接" name="ebayStoreLink">
                <el-input :disabled="(isEdit && ReturnAuditStatus('ebayStoreLink'))" type="text" name="ebayStoreLink" @blur="bindIptBlur('ebayStoreLink')" v-model="form.ebayStoreLink" placeholder="http://www.ebay.com/str/123"></el-input>
            </el-form-item>

            <el-form-item class="ebay-form-item" label="绑定的PayPal邮箱" name="paypalEmail">
                <el-input :disabled="(isEdit &&   ReturnAuditStatus('paypalEmail'))" type="text" name="paypalEmail" @blur="bindIptBlur('paypalEmail')" v-model="form.paypalEmail" placeholder="请输入您店铺绑定的PayPal账户邮箱"></el-input>
            </el-form-item>

            <el-form-item class="ebay-form-item" label="PayPal前3个月账单">
                            <!-- disabled:false -->
                <a class="cares-color" 
                style="text-decoration:underline;"
                v-if="isEdit && editPaypalBill" target="_blank" download="PayPal前3个月账单" :href="`${downloadfile}${editPaypalBill}`">点击下载账单</a>

                <el-upload
                :show-file-list='true'
                name='upFile'   
                :action="fileActive"
                :beforeUpload="beforeAvatarUpload"
                :on-success="bindUploadRulesSuccess"
                :on-error="bindUploadError"
                :on-remove="bindRemoveUploadFile"
                :on-exceed="bindUploadExceed"
                :limit="1"
                class="upload-container"
                :disabled="isEdit && (STORE_STATUS!=3)"
                >
                    <span class="cares-button-primary pain"><i class="el-icon-upload2"></i> 点击上传</span>
                </el-upload>
                <el-checkbox v-model="uploadPaypal">稍后上传</el-checkbox>
                <span v-if="uploadPaypal" class="no authenNotice">温馨提示：若不上传账单则只能收取自店铺绑定之日起的店铺收入</span>
            </el-form-item>

            <p class="getkey" style="font-size:12px;margin-bottom:10px;"><a class="cares-color" target="_blank" href="https://www.carespay.com/PayPal.html">为什么需要PayPal账单？如何获取？</a></p>

            <!-- 店铺信息 -->
            <div class="shop-information">
                <p>eBay店铺信息</p>

                <el-form-item label="销售类目" name="productCategories">
                    <el-select v-model="form.productCategories" 
                    :disabled="(isEdit && ReturnAuditStatus('productCategories'))"
                    name="productCategories" 
                    placeholder="请选择销售类目">
                        <el-option 
                        v-for="(item,index) in saleType" 
                        :key="index"
                        :label="item.productName"
                        :value="item.productCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="预计年销量" name="expectedSale">
                    <el-select v-model="form.expectedSale" 
                    :disabled="(isEdit && ReturnAuditStatus('expectedSale'))" 
                    name="expectedSale" placeholder="请选择年销量">
                        <el-option 
                        v-for="(item,index) in saleCount" 
                        :key="index"
                        :label="`${item.saleName}美金`"
                        :value="item.saleCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>

             <!-- 提现账号与币种 -->
             <div class="form-item channel"><span class="bold">提现方式</span>
                <!-- <i class="small">（可选择提现人民币到国内银行账户、提现外币至香港银行账户）</i> -->
             </div>
            <el-form-item label="提现币种与账号" name="channelCode" class="channelCode">
                <el-select :disabled="(isEdit && STORE_STATUS !=3)" v-model="form.channelCode" name="channelCode" placeholder="请选择提现账号与币种">
                    <el-option label="人民币至国内银行账户" value="A"></el-option>
                    <el-option label="外币至香港银行账户" value="C"></el-option>
                </el-select>
                <el-tooltip effect="dark" content="如有其它提现需求，请及时联系CaresPAY客服团队 400-887-0201" placement="top-end">
                    <i style="color:#666;" class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>

            <div class="line">
               <el-checkbox v-model="isAgree">我已阅读并同意</el-checkbox>
                <a class="cares-color" @click="bindShowAppointment" href="javascript:;">《eBay店铺使用条款》</a>
            </div>

            <span  v-if="!isEdit" @click="__bindAddShopNext"  :class="isAgree?'cares-button-primary':'cares-button-info'">{{(['EU','YD'].indexOf(form.platformCode)>-1) ? "下一步":"绑定店铺"}}</span>
            <span v-if="isEdit && (STORE_STATUS==3)" @click="__bindAddShopNext" :class="isAgree?'cares-button-primary':'cares-button-info'">重新绑定</span>


        </template>

         <!-- 条款弹框 -->
        <div class="appointment-content">
            <el-popover placement="top-end" v-model="showAppiont">
                <h2>eBay店铺使用条款</h2>
                <p>
                    点击“绑定店铺”按钮，即意味着您确认当前申请店铺的经营权和所有权（包括店铺相关存货、资金等资产)属于您所有，并负责管理。您承诺不出售假冒产品或侵犯知识产权的产品，不进行其它违反CaresPAY用户协议条款及当地法律法规的行为。一切因您的不合规或不合法操作产生的责任由您承担，与CaresPAY及其关联企业无关。
                </p>
                <div class="btn">
                    <span @click="bindAppiontRes(false)" class="cares-button-danger pain">不同意</span>
                    <span  @click="bindAppiontRes(true)" class="cares-button-primary">同意</span>
                </div>
            </el-popover>
        </div>
        
    </div>
</template>

<script>
import VERIFICATION from '../../../../js/verification.js';
 import {
     getEbayAuthUrl,            //请求ebay认证的跳转链接
     downloadfile,              //下载文件的接口
     uploadefile,               //上传文件的接口
     addStoreDetail,
     updateStoreDetail,
 } from '../../../../js/api.js';
 import {
    querySaleTypeList,                              //销售类目
    querySaleVolumeList,                            //年销量
} from '../../utils/localbase.js';

export default {
    data(){
        return{
            downloadfile:downloadfile,
            fileActive:uploadefile,
            URL:'javascript:;',
            STORE_STATUS:1,
            editPaypalBill:'',          //编辑页面  ebay订单下载查看
            uploadPaypal:false,         //是否稍后上传ebay订单  
            isAgree:false,  
            showAppiont:false,

            form:{
                platformCode:'EBAY',  //平台
                nation:'US',          //国家
                storeType:2,
                storeName:'',
                ebayEmail:'',
                ebayStoreLink:'',
                paypalEmail:'',
                paypalBill:'',

                productCategories:'',
                expectedSale:'',
                channelCode:'',
                id:'',                  //店铺ID
            },

            saleType:[],
            saleCount:[],
            ING:false,

            RefuseReason:[],//店铺审核失败原因

            AuditStatus:{
                storeName:0,
                ebayEmail:0,
                ebayStoreLink:0,
                paypalEmail:0,
                paypalBill:0,
                productCategories:0,
                expectedSale:0,
            }
        }
    },
    props:["isEdit","data","ebayAuth","STORESTATUS","eBayAuthLink",'AfterJumpFn'],
    //ebayAuth ebay店铺认证的结果  3.未认证 1. 成功； 0 认证失败；
    created(){

        this.STORE_STATUS = this.STORESTATUS;
         Promise.all([
            querySaleTypeList(),
            querySaleVolumeList(),
        ]).then(res=>{
            let [a,b] = res;
            this.saleType = a
            this.saleCount = b
        });

        if(!this.isEdit){   //如果不是编辑页面
            //当前还没有认证 请求链接地址
           this.ebayAuth == 3 && this.__queryEbayAuthUrl();
        }else{
            //编辑页面           
            for (const key in this.form) {
                this.form[key] = (this.data[key] || "");
            };
            this.editPaypalBill = this.data.paypalBill;
            //如果之前勾选的是暂时不上传可以后面再上传
            !this.data.paypalBill && (this.uploadPaypal = true);
            //2019-1-22   对应每一项的审核状态
            this.data['auditInfoVoList'] && this.data['auditInfoVoList'].forEach(item=>{
                //店铺审核失败原因
                if(item.auditStatus==3) this.RefuseReason.push(item);

                if( this.AuditStatus.hasOwnProperty(item.auditField)){ 
                    this.AuditStatus[item.auditField]=item.auditStatus;
                 };
            });
             
        }
    },
    watch:{
        STORESTATUS(status){
           this.STORE_STATUS = status;
        },
        uploadPaypal(bol){
            bol && (this.form.paypalBill="");
        }
    },
    methods:{
         //重置
        __DOAJ(){
            if(this.ING) return;
                this.ING = true;
            this.$emit('transparams',{name:'fillDone',value:true});
                  //4.1 编辑店铺
            this.isEdit && updateStoreDetail(this.form).then(res=>{
                 this.ING = false;
                if(res.code==0){
                    this.$Message.success('修改成功！');
                     //2019-3-1 跳转到成功提示页面
                    this.AfterJumpFn();

                }else{
                    this.$Message.error(res.msg);
                }
             });
             //4.2 添加店铺
           !this.isEdit && addStoreDetail(this.form).then(res=>{
               this.ING = false;
                if(res.code==0){
                    this.$Message.success('添加成功！');
                    //2019-3-1 跳转到成功提示页面
                    this.AfterJumpFn();
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        __bindAddShopNext(){
            //1. 必填字段
            let must = [];
                    
            must = ['storeName','ebayEmail','ebayStoreLink','paypalEmail','productCategories','expectedSale','channelCode'];
            !this.uploadPaypal  && must.push('paypalBill');//如果没有勾选稍后上传账单验证必填

            //2. 验证必填结果
            let flag = true;

            for(let i =0; i<must.length;i++){
                if(!this.bindIptBlur(must[i])) flag = false;
            }
            if(!flag) return;

            //3. 判断是否阅读条款
            if(!this.isAgree) return  this.showAppiont = true;

            //4.进行ajax请求
            this.__DOAJ();

        },
        //请求ebay认证链接
        __queryEbayAuthUrl(){

            this.eBayAuthLink ? (
                this.URL = this.eBayAuthLink
            ):(
                getEbayAuthUrl({pageSource:"carespay"}).then(res=>{
                    if(res.code==0){
                        this.URL = res.data;
                        this.$emit('transparams',{
                            name:'ebayLink',
                            value:res.data
                        })
                    }else{
                        this.$Message.error(res.msg);
                    }
                })
            );
        },
        bindToReAgree(){
            //重新授权
            this.$router.push({
                    name:"Reflesh",
                    params:{
                        name:"AddShop"
                    }
            });
        },
         //失去焦点验证必填
        bindIptBlur(name){
           return VERIFICATION(name,this.form[name]);
        },

        bindShowAppointment(){
             this.showAppiont = true;
        },
        bindAppiontRes(bol){
            this.showAppiont = false;
             this.isAgree = bol;
        },

        //上传palpay账单
        beforeAvatarUpload(file){
            let fileType = file.name.substring(file.name.lastIndexOf('.')+1).toUpperCase();
            if(fileType=='XLS'||fileType=='XLSX'||fileType=='CSV'){
                return true;
            }else{
                this.$Message.error(`只能上传xls、xlsx、csv格式的文件!`);
                return false;
            }
        },
        
        bindUploadRulesSuccess(res,file){
             if(res.code==0){
                  this.$Message.success(`上传成功！`);
                  this.form.paypalBill = res.data.uuid;
              }else{
                  this.$Message.error(res.msg);
              }
        },
        bindUploadError(){ this.$Message.error(`上传失败，请重新上传！`); },
        bindRemoveUploadFile(){  
            this.form.paypalBill = ``;//paypal账单置空 
        },
        bindUploadExceed(){ this.$Message.error(`账单只允许上传一份`); },
        ReturnAuditStatus(code){
            if(this.STORE_STATUS!=3) return true;   //如果不可以编辑提交 都不能编辑
            //销售类目
            return [0,3].indexOf(this.AuditStatus[code]) < 0;
        },
    }
}
</script>

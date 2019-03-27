<template>
    <div class="fadeIn">
        <!-- 完善店铺信息 -->
        <div v-if="!AE_ENDSTORE">
            <div class="form-item" style="margin-bottom:0px;">
                    <span class="bold" style="width:auto;">店铺信息</span>
                    <!-- <div class="item">
                        <span>（请如实填写以下信息，完善您的店铺资料）</span>
                    </div> -->
            </div>
            <el-form-item class="ebay-form-item" label="店铺名称" name="storeName">
                <el-input :disabled="(isEdit && ReturnAuditStatus('storeName'))" type="text" name="storeName" @blur="bindIptBlur('storeName')" v-model="form.storeName" placeholder="店铺名称"></el-input>
            </el-form-item>

            <el-form-item class="ebay-form-item" label="店铺链接" name="ebayStoreLink">
                <el-input :disabled="(isEdit && ReturnAuditStatus('storeLink'))" type="text" name="ebayStoreLink" @blur="bindIptBlur('ebayStoreLink')" v-model="form.ebayStoreLink" placeholder="店铺链接"></el-input>
            </el-form-item>

            <!-- 提现账号与币种 -->
            <div class="form-item channel"><span class="bold">提现方式</span>
                <!-- <i class="small">（可选择提现人民币到国内银行账户、提现外币至香港银行账户）</i> -->
            </div>
            <el-form-item label="提现币种与账号" name="channelCode">
                <el-select :disabled="(isEdit && STORE_STATUS !=3)" v-model="form.channelCode" name="channelCode" placeholder="请选择提现账号与币种">
                    <el-option label="人民币至国内银行账户" value="A"></el-option>
                    <!-- <el-option label="外币至香港银行账户" value="C"></el-option> -->
                </el-select>
                <el-tooltip effect="dark" content="如有其它提现需求，请及时联系CaresPAY客服团队 400-887-0201" placement="top-end">
                    <i style="color:#666;" class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>


            <div class="line">
                    请阅读条款
                <a class="cares-color" @click="bindShowAppointment" href="javascript:;">《AliExpress店铺使用条款》</a>
            </div>

            <span  v-if="!isEdit" @click="__bindAddShopNext"  :class="isAgree?'cares-button-primary':'cares-button-info'">{{(['EU','YD'].indexOf(form.platformCode)>-1) ? "下一步":"绑定店铺"}}</span>
            <span v-if="isEdit && (STORE_STATUS==3)" @click="__bindAddShopNext" :class="isAgree?'cares-button-primary':'cares-button-info'">重新绑定</span>

        </div>
        <!-- 完善店铺企业信息 -->
        <div v-else>
            <h4 class="cares-color">*请补充注册AliExpress店铺时填写的企业信息</h4>
            <div style="padding-top:20px;" v-if="!AE_ENDENTERINFO_SELECT">
                <el-radio v-model="AE_ENTERINFO_TYPE" label="1">完善注册店铺企业信息</el-radio> 
                <el-radio v-if="PersonInfo.type==2" v-model="AE_ENTERINFO_TYPE" label="2">与实名认证填写的信息一致</el-radio> 
                <el-radio v-if="AE_STORE.length" v-model="AE_ENTERINFO_TYPE" label="3">与之前绑定店铺企业信息一致</el-radio>

                <!-- 1. 选择注册店铺企业信息类型 -->
                <div v-if="AE_ENTERINFO_TYPE==1" class="complate-account">
                    <div class="complate-account-item clearfix">
                        <label class="fl" style="font-weight:bold;">公司所在地：</label>
                        <div class="fl">
                            <p style="margin-bottom:20px;">
                                <label for="shenfenzheng" :class="{active:EU_IDCARD=='1'}">中国大陆</label>
                                <input type="radio" value="1" id="shenfenzheng" v-model="EU_IDCARD"/>

                                <label for="hongkong" :class="{active:EU_IDCARD=='2'}">中国-香港</label>
                                <input type="radio" value="2" id="hongkong" v-model="EU_IDCARD"/>
                            </p>

                            <p v-if="EU_IDCARD==1" class="notice">对公人民币账户需在外汇局做过名录登记，为了保障后期的正常收款，请确认贵司相关账号登记情况。</p>
                            <p v-if="EU_IDCARD==1" class="notice">需要提供企业营业执照、法定代表人身份证。人民币账户起提金额为50美金。</p>
                            <p v-if="EU_IDCARD==2" class="notice">香港企业：可提现至香港企业对公账户或者董事的个人账户</p>
                        </div>
                    </div>
                </div> 

                 <!-- 3. 与之前绑定店铺企业信息一致 -->
                <div v-if="AE_ENTERINFO_TYPE==3" style="margin-top:20px;">
                    <el-form-item class="aliexpress-store-item" label="选择对应店铺的企业信息">
                        <el-select v-model="AE_STORE_ENTERPRISE_ID" placeholder="请选择您要绑定店铺的企业信息">
                            <el-option v-for="(item,index) in AE_STORE" :key="index" 
                                :value="item.storeId" 
                                :label="item.storeName"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <!-- 选择类型之后下一步 -->
                <p style="margin-top:40px;">
                     <span 
                     @click="__bindAEEnterprinNext"
                     :class="AE_ENTERINFO_TYPE==3 ? 
                         (
                             AE_STORE_ENTERPRISE_ID?'cares-button-primary':'cares-button-info'
                         ):
                         ('cares-button-primary')"
                     >
                         <template v-if="['1','3'].indexOf(AE_ENTERINFO_TYPE)>-1">继续完成</template>
                         <template v-if="AE_ENTERINFO_TYPE==2">确认</template>
                     </span>
                </p>
            </div>
            <div v-else>
                <!-- <component
                    :is="which_component_show"
                    :id="AE_STORE_ID"
                    :data="AE_ENTERPRISE_INFO"
                    INCOM="ADD_AE"
                    :edit="AE_ENTERPRISE_EDIT"
                    @transmission="bindGetChildParams"
                ></component> -->
            </div>
        </div>
       
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
     addStoreDetail,
     updateStoreDetail,
     storeInfo,
     enterpriseInfo 
 } from '../../../../js/api.js';

import {
     queryPersonInfo
 } from '../../utils/localbase.js';

 //2018-11-28  实名认证的组件
// import COMPLETEHK from './Complete_HK.vue';         //填写香港
// import COMPLETECN_DL from './Complete_Company.vue';  //填写中国大陆的

export default {
    data(){
        return{
            STORE_STATUS:1,
            form:{
                platformCode:'AE',  //平台
                nation:'US',          //国家
                storeType:2,
                id:'',

                storeName:'',
                ebayStoreLink:'',
                channelCode:'',
            },

            AE_ENTERINFO_TYPE:'1',           //店铺企业认证的信息选择类型，  1. 新增  2. 与实名信息一致  3. 与久店铺一致
            AE_ENDSTORE:false,               //是否完成店铺绑定
            EU_IDCARD:1,                      //选择实名认证证件的类型
            AE_STORE:[],
            AE_STORE_ENTERPRISE_ID:'',        //与之前店铺企业信息一致选择的店铺ID
            AE_ENDENTERINFO_SELECT:false,    //是否完成企业类型的选择

            AE_STORE_ID:'',                 //当前需要店铺的ID
            AE_ENTERPRISE_EDIT:false,       //当前的企业信息是否可以编辑
            AE_ENTERPRISE_INFO:{},
            which_component_show:'',
            AE_ENTERPRISE_STATUS:0,         //企业信息的审核状态 //1. 审核中  2. 审核通过  3. 审核失败


            PersonInfo:{},

            showAppiont:false,
            isAgree:false,
            ING:false,

            //店铺的审核项
            AuditStatus:{
                storeName:0,
                storeLink:0,
            }
        }
    },
    props:["isEdit","data","STORESTATUS","topTab",],
    created(){
        this.STORE_STATUS = this.STORESTATUS;

        if(this.isEdit)  {
        //
            this.AE_ENDSTORE = this.topTab==1 ? false : true;

            this.editTypeData(this.data),this.QueryEnterpriseInfo(this.data.storeId);
        }
    },
    watch:{
        AE_ENTERINFO_TYPE(){ this.AE_STORE_ENTERPRISE_ID='' },
        topTab(index){
            this.AE_ENDSTORE = index==1 ? false : true;
        },
        data(data){
            this.isEdit && this.editTypeData(this.data),this.QueryEnterpriseInfo(data.storeId);
        }
    },
    methods:{
        __reset(){
            let DF =['platformCode','storeType','nation'];//有默认输入的不清空

            for (const key in this.form) {

                if(DF.indexOf(key)<0){
                    this.form[key] = '';
                }
            };
        },
        __DOAJ(){
             if(this.ING) return;
                this.ING = true;

                this.$emit('transparams',{name:'fillDone',value:true});
                  //4.1 编辑店铺
            this.isEdit && updateStoreDetail(this.form).then(res=>{
                 this.ING = false;
                if(res.code==0){
                    this.$Message.success('修改成功！');
                    //2. 判断AliExpress的企业信息审核是否通过 3 或者未添加信息 0
                    [0,3].indexOf(this.AE_ENTERPRISE_STATUS) >-1 ? this.$emit('transparams',{name:'tab',value:2}) : (location.hash = "/storemanage");

                }else{
                    this.$Message.error(res.msg);
                }
             });
             //4.2 添加店铺
           !this.isEdit && addStoreDetail(this.form).then(res=>{
               this.ING = false;
                if(res.code==0){
                     this.__reset();
                     this.AE_STORE_ID = res.data;//返回添加成功之后的店铺ID
                     this.AE_ENDSTORE = true;   //完成店铺的添加
                     this.afterAddNewStore();
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        __bindAddShopNext(){
            //1. 必填字段
            let must = ['storeName','ebayStoreLink','channelCode'];

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


        
        //添加新店铺之后执行的方法
        afterAddNewStore(){
            //完成店铺的添加

            queryPersonInfo().then(res=>{
                if(res){
                    this.PersonInfo = res//实名认证的类型；1. 个人。2. 企业 
                }else{
                    console.log(`没有实名认证信息==未实名认证`);
                }
            }).then(()=>{
                 //获取aliexpress的店铺
                    storeInfo({platformCode:'AE'}).then(res=>{
                        if(res.code==0 ){
                            // res.data
                            let s = [];
                            res.data.forEach(item=>{
                                if(item.storeId != this.AE_STORE_ID){
                                   item.type !=3 && s.push(item);
                                }
                            });
                           this.AE_STORE = s;

                        }else{
                            this.$Message.error(res.msg);
                        } 
                    });
            });
        },
        //店铺企业类型选择信息选择
        __bindAEEnterprinNext(){
            // 1. 新增  2. 与实名信息一致  3. 与久店铺一致
            if(!this.AE_STORE_ID) return console.log('缺少店铺ID');

             this.AE_ENTERPRISE_EDIT = true;
            //先清空当前有的企业信息
            this.AE_ENTERPRISE_INFO = {};
            switch(Number(this.AE_ENTERINFO_TYPE)){
                  case 1:   //完成新的企业信息填写
                  { 
                       //选择的类型
                        this.EU_IDCARD==1?
                        (this.which_component_show = "COMPLETECN_DL"):
                        (this.which_component_show = "COMPLETEHK" );

                        //完成企业信息的选择
                        this.AE_ENDENTERINFO_SELECT = true;
                  }
                  break;
                  case 2:   //与实名信息一致
                  {
                        this.PersonInfo.nationality=="HKG" && (this.which_component_show = "COMPLETEHK");
                        this.PersonInfo.nationality=="CHN" && (this.which_component_show = "COMPLETECN_DL");

                        //让子组件显示的企业信息
                        this.AE_ENTERPRISE_INFO = this.PersonInfo;
                        //完成企业信息的选择
                        this.AE_ENDENTERINFO_SELECT = true;
                  }
                  break;
                  case 3:
                  {
                        if(!this.AE_STORE_ENTERPRISE_ID){ return this.$Message.warning('请选择您要绑定店铺的企业信息') };
                        //请求对应的企业信息
                        enterpriseInfo({storeId:this.AE_STORE_ENTERPRISE_ID}).then(res=>{
                            if(res.code == 0){

                                res.data.nationality=="HKG" && (this.which_component_show = "COMPLETEHK");
                                res.data.nationality=="CHN" && (this.which_component_show = "COMPLETECN_DL");

                                //让子组件显示的企业信息
                                this.AE_ENTERPRISE_INFO = res.data;
                            };

                             //完成企业信息的选择
                            this.AE_ENDENTERINFO_SELECT = true;
                        });
                  }
                  break;
             }
        },
        bindGetChildParams(params){
            this.AE_ENDENTERINFO_SELECT = params.value;
        },
        editTypeData(data){
            for (const key in this.form) {
                this.form[key] = (data[key] || "");
            };
            //当前店铺的ID
            this.AE_STORE_ID = data.storeId;

            this.afterAddNewStore();

            //2019-1-22  店铺的审核状态
            data['auditInfoVoList'] && data['auditInfoVoList'].forEach(item=>{
                if( this.AuditStatus.hasOwnProperty(item.auditField)){ 
                    this.AuditStatus[item.auditField]=item.auditStatus;
                 };
            });
        },
        QueryEnterpriseInfo(storeId){
            if(!storeId) return console.log(`缺少店铺ID`);
            enterpriseInfo({storeId}).then(res=>{
                 if(res.code==0){
                      console.log(`有`);
                       this.AE_ENDENTERINFO_SELECT = true;//未完成选择
                         //显示的组件
                        res.data.nationality=="HKG" && (this.which_component_show = "COMPLETEHK");
                        res.data.nationality=="CHN" && (this.which_component_show = "COMPLETECN_DL");
                        //当前企业信息默认不能编辑，最终决定为企业信息各自的审核状态
                        this.AE_ENTERPRISE_EDIT = false;

                         //对应的企业信息
                        this.AE_ENTERPRISE_INFO = res.data;
                        //对应企业信息的审核状态-- 用于判断编辑提交之后是否要重新编辑企业信息
                        this.AE_ENTERPRISE_STATUS = res.data.status;
                 }else{
                    console.log('没有');
                    this.AE_ENDENTERINFO_SELECT = false;//未完成选择
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
        ReturnAuditStatus(code){
            if(this.STORE_STATUS!=3) return true;   //如果不可以编辑提交 都不能编辑
            //销售类目
            return [0,3].indexOf(this.AuditStatus[code]) < 0;
        },
    },
    components:{
        // COMPLETEHK,
        // COMPLETECN_DL,
    }
}
</script>


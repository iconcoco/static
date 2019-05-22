<template>
 <transition name="fade">
        <div class="addBankAccount" :class="{isComplete:isComplete}">
            <h2 v-if="!id" class="banner-module-title">添加新的提现账户</h2>
            <h2 v-else class="banner-module-title">编辑提现账户</h2>
            <el-form v-show="LOADING" :model="form" class="addAccount-el-form">
                
                <div style="padding-top:20px;" class="form-item line">
                    <span>提现账户类型</span>
                    <div class="item">
                        <el-radio v-if="completeType==1" label="1" name="holderType" v-model="form.holderType">个人账户</el-radio>
                        <el-radio v-if="completeType==2" label="2" name="holderType" v-model="form.holderType">对公账户</el-radio>
                        <span class="no" v-if="completeType==1">（您的CaresPAY账号实名认证类型为“个人账号”，仅支持提现到个人银行卡）</span>
                        <span class="no" v-if="completeType==2">（您的CaresPAY账号实名认证类型为“企业账号”，仅支持提现到企业对公账户）</span>
                    </div>
                </div>

                <el-form-item label="开户地区" class="countType">
                     <el-select name="channelType"   v-model="form.channelType" placeholder="">
                         <el-option label="中国大陆" value="A"></el-option>
                         <el-option label="中国香港" value="C"></el-option>
                     </el-select>
                </el-form-item>

                 <!-- 个人账户选择出现 start-->
                <template v-if="form.holderType == 1">
                      <el-form-item style="margin-top:20px;" label="提现人姓名" name="accountName">
                          <el-input @blur="bindIptBlur('accountName')" name="accountName" v-model="form.accountName" placeholder="请输入（您）的姓名"></el-input>
                      </el-form-item>
                </template>
              <!-- 个人账户选择出现 end-->

                <!-- 对公账户选择出现 start-->
                <template v-if="form.holderType == 2">

                    <div v-if="form.channelType == 'A'" class="form-item line">
                        <span>请确认添加新账户已在外汇局登记</span>
                        <!-- <b>未登记的账户无法正常提现</b> -->
                        <div class="item">
                            <el-radio label="1" value="1">我已确认登记</el-radio>
                            <span class="no">（未登记的账户无法正常提现，<a class="cares-color" target="_blank" href="https://www.carespay.com/enregister.html">点此查看详情</a> ）</span>
                        </div>
                    </div>

                     <el-form-item name="accountName" label="提现人姓名">
                        <el-input  @blur="bindIptBlur('accountName')" name="accountName" v-model="form.accountName" placeholder="请与实名认证的企业名称保持一致"></el-input>
                    </el-form-item>
                </template>
                <!-- 对公账户选择出现 end-->

                 <el-form-item v-if="form.channelType==`C`" label="香港银行名称" class="bankBranch" name="bankName">
                     <el-input  @blur="bindIptBlur('bankName')" name="bankName" v-model="form.bankName" placeholder="请输入银行名称"></el-input>
                 </el-form-item >
                
                <el-form-item v-else label="银行名称" class="bankBranch" name="bankCode">
                        <el-select 
                        v-model="form.bankCode" 
                        name="bankCode"  
                        remote
                        @blur="bindIptBlur('bankCode')" 
                        filterable 
                        placeholder="请输入银行名称，支持智能检索">
                            <el-option
                            v-for="item in bankArr"
                            :key="item.value"
                            :label="item.bankName"
                            :value="item.bankCode">
                            </el-option>
                        </el-select>
                </el-form-item>

                <el-form-item label="银行卡号" name="bankNumber">
                    <el-input type="number" @blur="bindIptBlur('bankNumber')" name="bankNumber" v-model="form.bankNumber" placeholder="请输提现账户"></el-input>
                </el-form-item>

                <template v-if="form.channelType == 'A'">
                    <!-- 支行名称 企业账户才有支行名称-->
                    <el-form-item  v-if="isHasBranch && completeType==2"  label="支行名称" class="bankBranch" name="swiftCode" >
                        <el-select 
                        v-model="form.swiftCode" 
                        name="swiftCode" 
                        remote
                        reserve-keyword
                        filterable 
                        @blur="bindIptBlur('swiftCode')"
                        :remote-method="bindBranchNameChange"
                        placeholder="请输入开户支行名称">
                            <el-option
                            v-for="item in bankBranchArr"
                            :key="item.value"
                            :label="item.branchName"
                            :value="item.branchCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                <!-- 支行地址 -->
                    <div v-if="isHasBranch" class="bankAddress"  style="position:relative;">
                        <el-form-item label="开户支行地址" name="branchProvinceCode" >
                            <el-select  name="branchProvinceCode" v-model="form.branchProvinceCode" placeholder="请选择省份">
                            <el-option v-for="(item,index) in provincenArr" :key="index"
                                :label="item.provinceName"
                                :value="item.provinceCode"
                            ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item class="city-select" 
                        style="display:inline-block;width:145px;position:absolute;top:0;right:0;" 
                        name="branchCityCode">
                            <el-select  name="branchCityCode" v-model="form.branchCityCode" placeholder="请选择城市">
                            <el-option v-for="(item,index) in cityArr" :key="index"
                                :label="item.cityName"
                                :value="item.cityCode"
                            ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item name="branchAddr" v-if="completeType==2">
                            <el-input name="branchAddr" style="margin-left:100px;"  @blur="bindIptBlur('branchAddr')" v-model="form.branchAddr" placeholder="请输入开户支行地址"></el-input>
                        </el-form-item>
                    </div>

                    <!-- <el-form-item name="contactName" label="联系人">
                        <el-input maxlength="15" @blur="bindIptBlur('contactName')" name="contactName" v-model="form.contactName" placeholder="请输入填写人（您）的姓名"></el-input>
                    </el-form-item> -->
                   
                 </template>

                <el-form-item label="预留手机号"  name="phoneNo">
                    <el-input type="number" maxlength="11" @blur="bindIptBlur('reservedPhoneNo')"  name="phoneNo" v-model="form.reservedPhoneNo" placeholder="请输入银行预留的手机号码"></el-input>
                </el-form-item>

                <el-form-item label="绑定手机号码" >
                    <el-input v-model="form.tel"  disabled></el-input>
                </el-form-item>

                <el-form-item name="verifyCode" label="安全验证码" class="line">
                    <el-input type="number" maxlength="6" @blur="bindIptBlur('verifyCode')" name="verifyCode" v-model="form.verifyCode" placeholder="请输入验证码"></el-input>
                    <span :class="verifyCodeButton.buttonType"  @click="bindGetCode" class="getCode">{{verifyCodeButton.buttonText}}</span>
                </el-form-item>

                <span class="cares-button-primary confirm" @click="bindConfirmAddAccount" >确认{{id?'修改':'添加'}}账户</span>

            </el-form>

        </div>
 </transition>
</template>

<script>

    import { 
        sendUpdateAccountVerifycode,        //编辑验证码
        sendAddAccountVerifycode,           //请求验证码
        addAccount,                         //添加提现账户
        queryAllStroe,                         //添加提现账户
        queryBranch,                        //查询支行
        updateEnterpriseAccount,
        updatePersonalAccount,
        queryCustomerBindInfo,
    } from '../../../../js/api.js';
    import VERIFICAT from '../../../../js/verification.js';

     import {
        queryCurrencyList,                              //币种列表
        queryBankList,                                      //银行列表
        queryCustomerInfo,                              //客户信息
        queryProvinceList,                              //省份列表
        queryCityData,                                  //城市数据
        queryPersonInfo,                                //个人实名信息
        queryBankInfoDetail,
        queryAccountModleData,
    } from '../../utils/localbase.js';

    import {
        removeClass
    } from '../../../../js/common.js';



    export default {
        data(){
            return{
                verifyTimer:null,
                timer:null,
                isComplete:false,                          //是否是完成用户实名认证时候跳转过来的页面
                completeType:null,                          //实名认证选择是个人还是公司
               verifyCodeButton:{
                    buttonType:"cares-color",
                    buttonText:'获取验证码',
               },
                form:{
                    holderType:null,                         //公司还是个人
                    bankCode:'',                            //银行名称
                    bankName:'',                            //银行名称--香港
                    swiftCode:'',                          //支行名称 -- 对公
                    branchAddr:'',                          //支行地址 -- 对公
                    bankNumber:'',                          //提现账户=银行卡号
                    accountName:'',                         //提现账户名称||银行户名 -- 对公
                    //enterpriseName:'深圳市金福科技有限公司',  //企业名称名称 -- 对公
                    // organizationCode:'',                    //组织机构代码 -- 对公
                    branchProvinceCode:'',                  //支行地址省份 -- 对公
                    branchCityCode:'',                      //支行地址城市 -- 对公
                    // contactName:'',                         //联系人
                    reservedPhoneNo:'',                     //预留手机号码
                    verifyCode:'',                          //验证码
                    // certificateNumber:'',                   //身份证号码
                    currency:'',                           //账号币种 -- 对公
                    tel:'',                                 //用户注册的手机号码

                    channelType:"",                 // 中国大陆 A  channelType 中国香港   C
                },
                personInfo:{
                    nationality:"",                         //账户地区
                },
                currencyOpt:[],
                provincenArr:[],
                cityArr:[],
                bankArr:[],                                         //银行列表数据
                bankBranchArr:[],                                   //银行支行列表数据
                isHasBranch:true,
                AjaxIng:false,
                LOADING:false,

            }
        },
        props:['id'],
        created() {
            //1. 一些基本信息的请求
            Promise.all([
                queryCurrencyList(),
                queryBankList(),
                queryCustomerInfo(),
                queryProvinceList(),
                queryPersonInfo(),
            ]).then(res=>{
                let [currencyList,bank,customerInfo,province,personInfo] = res;

                this.currencyOpt = currencyList;                    //币种
                this.provincenArr = province;                   //省份列表
                this.bankArr = bank;                            //银行列表
                this.form.tel = customerInfo.phoneNo;           //注册绑定手的号码
                this.personInfo = personInfo;                   //个人账户地区

                 //2019-2-25 永富增加渠道字段 修改
                !this.id && personInfo.businessLocation=='HKG' ? 
                    (this.form.channelType = 'C') : 
                    (this.form.channelType = 'A');   //香港用户币种默认为C渠道


               !this.completeType && (this.completeType = String(personInfo.type)) ;
               !this.form.holderType &&  (this.form.holderType = String(personInfo.type));  

                //初始加载完成
               this.LOADING = true;
            })
           
            //2. 实名认证完成链接跳转过来的情况判断
            let type = this.$route.query.completeType;     //实名认证的类型 1. 认证个人    2. 认证公司
            !type ? (
                this.isComplete = false
            ):(
                //从实名认证跳转过来的
                this.isComplete = true,
                this.completeType = type,
                this.form.holderType = type
            );

            //3. 编辑页面
            // console.log(this.id);
            this.id && queryBankInfoDetail(this.id).then(bankInfo=>{
                // let iDef = ['tel','holderType'];
                let iDef = ['tel','channelType','holderType'];
                for (const key in this.form) {
                    if(iDef.indexOf(key)<0){
                        this.form[key] = bankInfo[key] || '';
                    }
                };
            });

        },
        watch:{
            //省份数据发生变化
            "form.branchProvinceCode"(n,o){
                 queryCityData(n).then(res=>{
                    this.cityArr = res;
                });

                 if(!o) return;
                this.form.branchCityCode = '';
            },
            //银行选择发生变化的时候
            "form.bankCode"(n,o){
                // this.bankBranchArr = [];
                queryBranch({
                     code:n,
                     name:""
                }).then(ires=>{
                    if(ires.code==0){
                        this.bankBranchArr = ires.data;
                        //2018-10-19 当支行数据不存在
                        if(ires.data.length){
                            this.isHasBranch = true;
                        }else{
                            this.isHasBranch = false;
                            let branchMust = [
                                'swiftCode',
                                'branchProvinceCode',
                                'branchCityCode',
                                'branchAddr',
                            ];
                            //清空非必须的选择
                            branchMust.forEach(name=>{
                                this.form[name] = "";
                            });

                        }
                    }else{
                       this.bankBranchArr = [];
                       this.$Message.error(ires.msg);
                    }
                });

                 if(!o) return;
                this.form.swiftCode='';     //支行选择清空
            },
            //账户类型发生变化的时候
            "form.holderType"(n){
                let nodes = document.querySelectorAll('.is-error');
                for(let i=0;i<nodes.length;i++){
                     removeClass(nodes[i],'is-error');
                     nodes[i].querySelector('.el-form-item__error').remove();
                }
            },
            //2019-2-25 永富增加渠道字段
            "form.channelType"(n,o){
                this.form.currency = n=='A' ?"CNY":"USD";

                let nodes = document.querySelectorAll('.is-error');
                for(let i=0;i<nodes.length;i++){
                     removeClass(nodes[i],'is-error');
                     nodes[i].querySelector('.el-form-item__error').remove();
                };

                //如果变成中国大陆有些字段就清空
                if(!o) return;
                
            }
        },
        methods:{
            reset(){
                //重置表单
                Object.assign(this.form,{
                    bankCode:'',                            //银行名称
                    swiftCode:'',                          //支行名称 -- 对公
                    branchAddr:'',                          //支行地址 -- 对公
                    bankNumber:'',                          //提现账户=银行卡号
                    accountName:'',                         //提现账户名称||银行户名 -- 对公
                    // organizationCode:'',                    //组织机构代码 -- 对公
                    branchProvinceCode:'',                  //支行地址省份 -- 对公
                    branchCityCode:'',                      //支行地址城市 -- 对公
                    // contactName:'',                         //联系人
                    reservedPhoneNo:'',                     //预留手机号码
                    verifyCode:'',                          //验证码
                    // certificateNumber:'',                   //身份证号码
                    currency:'CNY',                           //账号币种 -- 对公
                });
            },
            //支行列表查询
            bindBranchNameChange(name){

                if(!VERIFICAT('bankCode',this.form['bankCode'])) return;
                if(!name.trim()) return;

                clearTimeout(this.timer);
                this.timer = setTimeout(()=>{

                   queryBranch({
                       code:this.form.bankCode,
                       name:name
                   }).then(res=>{
                        if(res.code==0){

                           res.data.length ? (this.bankBranchArr = res.data) :(
                             queryBranch({code:this.form.bankCode,name:""}).then(ires=>{
                                 if(ires.code==0){
                                     this.bankBranchArr = ires.data
                                 }else{
                                    this.bankBranchArr = [];
                                    this.$Message.error(ires.msg);
                                 }
                             })
                           ) ;


                        }else{
                            this.bankBranchArr = [];
                            this.$Message.error(res.msg);
                        }
                    });

                },200);
            },
            //获取验证码
            bindGetCode(){
                
                if(this.verifyCodeButton.buttonType=='cares-color'){

                    !this.id && sendAddAccountVerifycode().then(res=>{
                        codeRes(res);
                    });

                    this.id &&sendUpdateAccountVerifycode().then(res=>{
                        codeRes(res);
                    })
                };

                let _this = this;
                function codeRes(res){
                    if(res.code==0){
                        _this.verifyCodeButton.buttonType='ING';
                        let time = 60;
                        //定时器倒计时
                        _this.verifyTimer = setInterval(()=>{
                            time--;
                            _this.verifyCodeButton.buttonText=`重新获取${time}s`;
                            if(time==0){

                                _this.verifyCodeButton={
                                    buttonType:'cares-color',
                                    buttonText:'获取验证码',
                                };

                                clearInterval(_this.verifyTimer);
                            };
                        },1000);

                    }else{
                        _this.$Message.error(res.msg)
                    }
                }
            },
            //输入框失去焦点
            bindIptBlur(name){
                if(name=='reservedPhoneNo'){
                    VERIFICAT('phoneNo',this.form[name]);
                }else{
                    VERIFICAT(name,this.form[name]);
                }
               
            },
            //确认添加一个提现账户
            bindConfirmAddAccount(){
                let must = [
                    'accountName',
                    'bankNumber', 
                    'verifyCode', 
                    'reservedPhoneNo', 
                ];
                //币种人民币验证的必填 2018-11-12 增加币种选择
                this.form.channelType=='C' ? ( must = must.concat(['bankName']) ) : (must = must.concat(['bankCode']));

                let branchMust = [
                    'swiftCode',
                    'branchProvinceCode',
                    'branchCityCode',
                    'branchAddr',
                ];

                //2018-11-12 增加币种选择  2019-3-6 清掉不必要的数据
                if(this.form.channelType=='A'){
                    //2019-3-7 个人账户没有支行名称和支行的详细地址
                    this.completeType==1 && (branchMust=['branchProvinceCode','branchCityCode']);

                    this.isHasBranch && (
                        must = must.concat(branchMust)
                    );
                }else{
                    //香港地区  清掉不必要的数据
                    
                    branchMust.forEach(key=>{
                        this.form[key]="";
                    });
                };

                let flag = true;
                for(let i =0; i<must.length;i++){
                    if(must[i]=='reservedPhoneNo'){
                        if(!VERIFICAT('phoneNo',this.form[must[i]])) flag = false;
                    }else{
                        if(!VERIFICAT(must[i],this.form[must[i]])) flag = false;
                    }
                }

                if(!flag) return;

                if(this.AjaxIng) return;
                this.AjaxIng = true;

                this.$emit('switchConponet',{
                    value:true,
                    switch:'FILLDONE'
                }); //是否已经完成添加

                //1. 请求;
                this.id ? ( 
                    //编辑提交
                    this.editUpdateFetch() 
                ): 
                // 添加提交
                addAccount(this.form).then(res=>{
                    this.AjaxIng = false;
                   res.code==0 ?
                   (
                       //添加账号成功
                      this.andThenJump()
                    ):
                   (this.$Message.error(res.msg))
                });

            },
            //编辑修改页面
            editUpdateFetch(){

                let subData = Object.assign({id:this.id},this.form);

                   //2.1 修改个人
                subData.holderType==1 && updatePersonalAccount(subData).then(res=>{
                    this.AjaxIng = false;
                   res.code==0 ?
                   (
                       this.andThenJump()
                    ):
                   (this.$Message.error(res.msg))
                });

                //2.2 修改对公
                subData.holderType==2 && updateEnterpriseAccount(subData).then(res=>{
                    this.AjaxIng = false;
                     res.code==0 ?
                    (
                        this.andThenJump()
                     ):
                    (this.$Message.error(res.msg))

                })

            },
            andThenJump(){
                queryCustomerBindInfo().then(iRes=>{
                    if(!(iRes.code == 0)) return this.$Message.error(res.msg);
                     //1. 假如没有添加店铺
                    if(!iRes.data['storeInfo']) return this.$router.push({name:'AddShop'});
                     //2.否者跳转到成功提示页
                     this.$router.push({
                         name:"AuthenticationDone",
                         params:{
                             source:'AddCashAccount',
                         }
                     });
                });
            },
           
        },
        
    }
</script>

<style lang="scss" scoped>
    @import './../../../../css/common/theme.scss';
    .el-input{
        width: 300px;
    }

    .bankBranch{
        .el-select{
            width: 300px;
        }
    }

    .addBankAccount{
        background-color: #fff;
    }
    .isComplete{
        padding: 0 30px;
    }


    //账户类型选择
    .countType{
        .el-select{
            width: 300px;
        }
    }
    //支行地址选择
    .bankAddress{
        width: 400px;
        .item{
            vertical-align: top;
        }
        .el-select{
            width: 145px;
        }
    }
    //获取验证码
    .getCode{
        position: absolute;
        left: 310px;
        margin-top: 2px;
        font-size: 14px;
        cursor: pointer;
    }
    //确认按钮
    .confirm{
        margin: 30px 0;
    }
    //
    .form-item,
    .el-form-item
    {
       // height: 60px;
        // line-height: 60px;
        &.line{
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
    }
</style>

<style lang="scss">
.addAccount-el-form{
    .el-form-item__label{
        width:100px;
        text-align:left;
    }
    .city-select .el-form-item__error{
        padding-left:0;
    }
    .el-form-item__error{
        padding-left:100px;
    }
}
</style>



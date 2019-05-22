<template>
 <transition name="fade">
    <div class="store-detaile-container">
        <div class="store-name">
            <h2>
                {{pageData.storeName}}
                <span>|</span>
                <span>对应店铺账号ID：{{pageData.actualStoreId}}</span>
            </h2>
            <p>备注名：{{pageData.alias}}<i v-show="!iptflag" @click="bindShowIpt" class="el-icon-edit-outline"></i>
                <el-input  v-show="iptflag"  v-model="form.remark" placeholder="修改备注名"></el-input>
                <a  v-show="iptflag"   @click="bindSendAjax"   href="javascript:;" class="cares-color">确认修改</a>
                <a  v-show="iptflag"   @click="bindIptBlur" class="ING" href="javascript:;" >取消</a>
             </p>
        </div>

        <!-- 北美与欧洲站 -->
        <template v-if="['BM','EU',].indexOf(pageData.platformCode)>-1">
             <!-- 账号信息 -->
            <div class="account-info" v-for="(item,key,index) in storeInfo.nation" :key="index">
                <h3 class="banner-module-title">
                {{nationName(key)}}站店铺收款账户信息
                </h3>

                <div class="account-item">
                    <label>
                        <span class="cn">银行所在地：</span>
                        <span class="en">Bank Location</span>
                    </label>
                    <p v-html="item.bankAddress"></p>
                </div>

                <div class="account-item">
                    <label>
                        <span class="cn">账号持有者姓名：</span>
                        <span class="en">Account holder's name</span>
                    </label>
                    <p v-html="item.holdName"></p>
                </div>

                <div class="account-item">
                     <label v-if="item.currency=='EUR'">
                        <span class="cn">BIC：</span>
                        <span class="en">Banking Identify Code</span>
                    </label>

                     <label v-else-if="item.currency=='GBP'">
                        <span class="cn">银行代码：</span>
                        <span class="en">Sort Code</span>
                    </label>

                    <label v-else>
                        <span class="cn">9位汇款线路号码：</span>
                        <span class="en">9-Digt Routing Number</span>
                    </label>

                    <p v-html="item.routingNo"></p>
                        <span v-if="item.copyStatus==2"  class="copy CopyElement" 
                            :data-clipboard-text="item.routingNo" 
                            @click="BindCopyEvent">
                                复制
                        <b class="yes"> <i class="el-icon-circle-check"></i> 复制成功</b>
                    </span>
                  
                </div>

                <div class="account-item">
                    <label>
                        <span class="cn">银行账号：</span>
                        <span class="en">Bank Account Number</span>
                    </label>
                    <div class="accountNo-box">
                        <p v-html="item.accountNo"></p>
                        <span v-if="item.copyStatus==2" class="copy CopyElement"
                            :data-clipboard-text="item.accountNo" 
                                @click="BindCopyEvent">
                                    复制
                                <b class="yes"> <i class="el-icon-circle-check"></i> 复制成功</b>
                        </span>
                        <template v-if="item.tipsInfo">
                            <br/>
                            <p class="authenNotice" v-html="item.tipsInfo"></p>
                        </template>
                    </div>
                    
                </div>

            </div>
            <!-- 添加未开通的站点 -->
            <div v-if="pageData.status ==2 " class="account-info add-new-account" v-for="(item,index) in storeInfo.unBindNaiton" :key="`${index}x`">
                <a href="javascript:;" class="cares-color" @click="bindToAddNewAccount(item)">添加{{nationName(item)}}站收款账户</a>
            </div>

            <!-- 店铺信息 -->
            <div class="account-info">
                <h3 class="banner-module-title">
                    店铺基本信息
                </h3>

               <template v-if="pageData.platformCode =='AE'">
                   <div class="account-item">
                        <label>
                            <span class="cn">店铺名称：</span>
                            <!-- <span class="en">Store Name</span> -->
                        </label>
                        <p v-html="pageData.storeName"></p>
                    </div>

                   <div class="account-item">
                        <label>
                            <span class="cn">店铺链接：</span>
                            <!-- <span class="en">Store Link</span> -->
                        </label>
                        <p v-html="pageData.ebayStoreLink"></p>
                    </div>
               </template>

               <template v-else>
                    <div class="account-item">
                        <label>
                            <span class="cn">卖家编号：</span>
                            <span class="en">Seller ID</span>
                        </label>
                        <p>{{pageData.sellerId}}</p>
                    </div>

                    <div class="account-item">
                        <label>
                            <span class="cn">MWS Auth Token：</span>
                            <span class="en">MWS Auth Token</span>
                        </label>
                        <p>{{pageData.authToken}}</p>
                    </div>
               </template>
            </div>

            <!-- 店铺企业账号 -->
            <div v-if="HasBindEnterprise" class="account-info">
                <h3 class="banner-module-title" style="margin-bottom:0px;">
                    绑定店铺企业信息
                </h3>

                 <component
                    :is="which_component_show"
                    :data="EU_ENTERPRISE_INFO"
                    INCOM="ADD_EU"
                    :hideIntro="true"
                ></component>
            </div>

        </template>

        <!-- 印度跟Aliexpress -->
        <template v-if="['YD','AE'].indexOf(pageData.platformCode)>-1">
            <!-- 账号信息 -->
            <div class="account-info">
                <h3 class="banner-module-title">
                    <template v-if="pageData.platformCode=='BM'">Amazon北美站店铺收款账户信息</template>
                    <template v-if="pageData.platformCode=='EU'">Amazon欧洲站店铺收款账户信息</template>
                    <template v-if="pageData.platformCode=='YD'">Amazon印度站店铺收款账户信息</template>
                    <template v-if="pageData.platformCode=='AE'">AliExpress店铺收款账户信息</template>
                </h3>

                <div class="account-item">
                    <label>
                        <span class="cn">银行所在地：</span>
                        <span class="en">Bank Location</span>
                    </label>
                    <!-- <p>{{pageData.nation}}</p> -->
                    <p v-html="pageData.bankAddress"></p>
                </div>

                <!-- aliexpress展示 -->
                <template v-if="pageData.platformCode =='AE'">
                    <div class="account-item">
                        <label>
                            <span class="cn">Swift Code：</span>
                            <span class="en">Swift Code</span>
                        </label>
                        <p>等待店铺审核后发放（写死了）</p>
                    </div>
                    <div class="account-item">
                        <label>
                            <span class="cn">账户名：</span>
                            <span class="en">Account Name</span>
                        </label>
                        <p>等待店铺审核后发放（写死了）</p>
                    </div>
                </template>

                <!-- 其他展示 -->
                <template v-else>
                        <div class="account-item">
                            <label>
                                <span class="cn">账号持有者姓名：</span>
                                <span class="en">Account holder's name</span>
                            </label>
                            <p v-html="pageData.holdName"></p>
                        </div>
                        
                        <div class="account-item">
                            <label>
                                <span class="cn">9位汇款线路号码：</span>
                                <span class="en">9-Digt Routing Number</span>
                            </label>
                            <!-- <p>{{pageData.routingNo}}</p> -->
                            <p v-html="pageData.routingNo"></p>
                             <span v-if="pageData.copyStatus==2" class="copy CopyElement"
                                :data-clipboard-text="pageData.routingNo" 
                                @click="BindCopyEvent">
                                复制
                                <b class="yes"> <i class="el-icon-circle-check"></i> 复制成功</b>
                            </span>
                        </div>
                </template>

                <div class="account-item">
                    <label>
                        <span class="cn">银行账号：</span>
                        <span class="en">Bank Account Number</span>
                    </label>
                    <div class="accountNo-box">
                        <p v-html="pageData.accountNo"></p>
                        <span v-if="pageData.copyStatus==2" class="copy CopyElement"
                            :data-clipboard-text="pageData.accountNo" 
                                @click="BindCopyEvent">
                                    复制
                                <b class="yes"> <i class="el-icon-circle-check"></i> 复制成功</b>
                        </span>
                         <template v-if="pageData.tipsInfo">
                            <br/>
                            <p class="authenNotice" v-html="pageData.tipsInfo"></p>
                        </template>
                    </div>
                </div>


            </div>
            
            <!-- 店铺信息 -->
            <div class="account-info">
                <h3 class="banner-module-title">
                    店铺基本信息
                </h3>

               <template v-if="pageData.platformCode =='AE'">
                   <div class="account-item">
                        <label>
                            <span class="cn">店铺名称：</span>
                            <!-- <span class="en">Store Name</span> -->
                        </label>
                        <p v-html="pageData.storeName"></p>
                    </div>

                   <div class="account-item">
                        <label>
                            <span class="cn">店铺链接：</span>
                            <!-- <span class="en">Store Link</span> -->
                        </label>
                        <p v-html="pageData.ebayStoreLink"></p>
                    </div>
               </template>

               <template v-else>
                    <div class="account-item">
                        <label>
                            <span class="cn">卖家编号：</span>
                            <span class="en">Seller ID</span>
                        </label>
                        <p>{{pageData.sellerId}}</p>
                    </div>

                    <div class="account-item">
                        <label>
                            <span class="cn">MWS Auth Token：</span>
                            <span class="en">MWS Auth Token</span>
                        </label>
                        <p>{{pageData.authToken}}</p>
                    </div>
               </template>
            </div>
            <!-- 店铺企业账号 -->
            <div v-if="HasBindEnterprise" class="account-info">
                <h3 class="banner-module-title" style="margin-bottom:0px;">
                    绑定店铺企业信息
                </h3>

                 <component
                    :is="which_component_show"
                    :data="EU_ENTERPRISE_INFO"
                    INCOM="ADD_EU"
                    :hideIntro="true"
                ></component>
            </div>
        </template>

        <template v-if="pageData.platformCode=='WISH'">
              <!-- 账号信息 -->
            <div class="account-info">
                <h3 class="banner-module-title">
                    WISH店铺收款账户信息
                </h3>

                <div class="account-item">
                    <label>
                        <span class="cn">银行所在国家/地区：</span>
                        <span class="en">Bank Location Country</span>
                    </label>
                    <p v-html="pageData.bankAddress"></p>
                </div>

                <div class="account-item">
                    <label>
                        <span class="cn">银行名称：</span>
                        <span class="en">Bank Name</span>
                    </label>
                    <p v-html="pageData.bankName"></p>
                </div>

                <div class="account-item">
                    <label>
                        <span class="cn">账户类型：</span>
                        <span class="en">Account Type</span>
                    </label>
                   <p>支票账户</p>
                </div>

                <div class="account-item">
                    <label>
                        <span class="cn">银行代号：</span>
                        <span class="en">Routing Number</span>
                    </label>
                    <p v-html="pageData.routingNo"></p>
                </div>

                <div class="account-item">
                    <label>
                        <span class="cn">银行账号：</span>
                        <span class="en">Account Number</span>
                    </label>

                    <div class="accountNo-box">
                        <p v-html="pageData.accountNo"></p>
                        <span v-if="pageData.copyStatus==2" class="copy CopyElement"
                            :data-clipboard-text="pageData.accountNo" 
                                @click="BindCopyEvent">
                                    复制
                                <b class="yes"> <i class="el-icon-circle-check"></i> 复制成功</b>
                        </span>
                         <template v-if="pageData.tipsInfo">
                            <br/>
                            <p class="authenNotice" v-html="pageData.tipsInfo"></p>
                        </template>
                    </div>
                </div>
            </div>

            <div class="account-info">
                <h3 class="banner-module-title">
                    店铺基本信息
                </h3>

                <div class="account-item">
                    <label>
                        <span class="cn">店铺名称：</span>
                        <!-- <span class="en"></span> -->
                    </label>
                    <p>{{pageData.storeName}}</p>
                </div>

                <div class="account-item">
                    <label>
                        <span class="cn">注册店铺邮箱：</span>
                        <!-- <span class="en"></span> -->
                    </label>
                    <p>{{pageData.ebayEmail}}</p>
                </div>

                <div class="account-item">
                    <label>
                        <span class="cn">店铺链接：</span>
                        <!-- <span class="en"></span> -->
                    </label>
                    <p>{{pageData.ebayStoreLink}}</p>
                </div>

                <div class="account-item">
                    <label>
                        <span class="cn">店铺绑定的PayPal账号：</span>
                        <!-- <span class="en"></span> -->
                    </label>
                    <p>{{pageData.paypalAccount}}</p>
                </div>

                <div class="account-item">
                    <label>
                        <span class="cn">PayPal账户姓名：</span>
                        <!-- <span class="en"></span> -->
                    </label>
                    <p>{{pageData.paypalName}}</p>
                </div>

            </div>

        </template>

        <template  v-if="pageData.platformCode=='EBAY'">
            <div class="account-info">
                <h3 class="banner-module-title">
                    eBay店铺收款账户信息
                </h3>
                <div class="account-item">
                    <label>
                        <span class="cn">银行所在国家/地区：</span>
                        <span class="en">Bank Location Country</span>
                    </label>
                    <p v-html="pageData.bankAddress"></p>
                </div>
                <div class="account-item">
                    <label>
                        <span class="cn">银行名称：</span>
                        <span class="en">Bank Name</span>
                    </label>
                    <p v-html="pageData.bankName"></p>
                    <!-- INTERNATIONAL BANK OF CHICAGO -->
                </div>
                <div class="account-item">
                    <label>
                        <span class="cn">账户类型：</span>
                        <span class="en">Account Type</span>
                    </label>
                    <p>支票账户</p>
                </div>
                <div class="account-item">
                    <label>
                        <span class="cn">银行代号：</span>
                        <span class="en">Routing Number</span>
                    </label>
                    <p v-html="pageData.routingNo"></p>
                    <!-- <p>071006651</p> -->
                </div>
                <div class="account-item">
                    <label>
                        <span class="cn">银行账号：</span>
                        <span class="en">Account Number</span>
                    </label>

                    <div class="accountNo-box">
                        <p v-html="pageData.accountNo"></p>
                        <span v-if="pageData.copyStatus==2" class="copy CopyElement"
                            :data-clipboard-text="pageData.accountNo" 
                                @click="BindCopyEvent">
                                    复制
                                <b class="yes"> <i class="el-icon-circle-check"></i> 复制成功</b>
                        </span>
                        <template v-if="pageData.tipsInfo">
                            <br/>
                            <p class="authenNotice" v-html="pageData.tipsInfo"></p>
                        </template>
                    </div>
                </div>
                
            </div>
        </template>

        <!-- 添加新的站点model -->
        <AdminModel v-model="addNewModel">
            <span class="cares-model-close" @click="bindCloseModel"></span>
            <h3>填写{{nationName(modleForm.nation)}}地区店铺信息 </h3>
            <p class="name">店铺：{{pageData.storeName}}</p>
            <el-form>
                <el-form-item label="销售类目：" name="productCategories">
                     <el-select v-model="modleForm.productCategories"  name="productCategories"  placeholder="请选择销售类目">
                        <el-option 
                        v-for="(item,index) in saleType" 
                        :key="index"
                        :label="item.productName"
                        :value="item.productCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="预计年销量：" name="expectedSale">
                    <el-select v-model="modleForm.expectedSale" name="expectedSale" placeholder="请选择年销量">
                        <el-option 
                        v-for="(item,index) in saleCount" 
                        :key="index"
                        :label="`${item.saleName}${saleUnitFn()}`"
                        :value="item.saleCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <p>
                <span class="cares-button-primary" @click="bindConfirmModel">确认添加</span><br/>
                <span class="ING" @click="bindCloseModel">取消添加</span>
            </p>
        </AdminModel>
    </div>
 </transition>
</template>

<script>

    import Clipboard from 'clipboard';

    import {
        queryStoreDetail,//获取店铺管理的详情
        updateStoreRemark,//修改店铺备注名
        enterpriseInfo,
        addMwsSite
    } from '../../../../js/api.js';

    import {
        querySaleTypeList,
        querySaleVolumeList,
        NationCode
    } from './../../utils/localbase.js';

    import AdminModel from './../../../../components/adminModel.vue';

    //2018-11-28  实名认证的组件
    import AuthenticationCompany from '../Authentication/AuthenticationCompany.vue';

    export default {
        data(){
            return{
                iptflag:false,
                form:{
                    remark:'',
                    id:''
                },
                pageData:{
                    storeName:'',
                    accessKey:'',
                    secretKey:'',
                    sellerId:'',
                    actualStoreId:'',             //店铺ID     2019-1-21 修改
                    nation:'',              //银行所在地
                    routingNo:'',           //汇款线路号码
                    bankNo:'',              //银行账号
                    accountName:'',         //持有者姓名
                    platformCode:'',
                    status:'',
                },
                storeInfo:{
                    nation:[],              //店铺所在国家  多个国家的时候有用到
                    unBindNaiton:[],
                },
                AjaxIng:false,
                //亚马逊欧洲站
                which_component_show:"AuthenticationCompany",
                EU_ENTERPRISE_INFO:{},
                HasBindEnterprise:false,

                //2019-1-17 详情页添加新的长点店铺
                addNewModel:false,
                modleForm:{
                    nation:'',
                    expectedSale:'',
                    productCategories:'',
                    id:'',
                },
                saleType:[],
                saleCount:[],
            }
        },
        created(){
            const id = this.$route.params.id;
            //存店铺ID
            this.form.id = id;
            this.modleForm.id = id;
            queryStoreDetail({id}).then(res=>{
                if(res.code==0){
                    Object.assign(this.pageData,res.data);
                    // this.pageData.platformCode = 'ebay';
                    this.form.remark = res.data.alias;
                    //2019-1-21 多个国家显示多个站点storeInfo
                    if(res.data.mwsDetail){
                        let md = JSON.parse(res.data.mwsDetail);
                        //1. 已开通国家
                        this.storeInfo.nation = md
                        //2. 过滤未开通的国家
                        NationCode.forEach(item=>{
                            if(item.platformCode == res.data.platformCode){
                                !(item.code in this.storeInfo.nation) && this.storeInfo.unBindNaiton.push(item.code);
                            };
                        });
                    };
                    //印度站或者欧洲站需要显示店铺企业信息
                    if(['EU','YD','AE'].indexOf(this.pageData.platformCode)>-1){this.bindQueryEnterpriseInfo();}

                }else{
                    this.$Message.error(res.msg);
                }
            });

             Promise.all([
                querySaleTypeList(),
                querySaleVolumeList(),
            ]).then(res=>{
                let [a,b] = res;
                this.saleType = a
                this.saleCount = b
            });
        },
        methods:{
            bindQueryEnterpriseInfo(){
                //如果是从待完善的店铺进入，店铺的企业信息隐藏
                enterpriseInfo({storeId:this.pageData.actualStoreId}).then(res=>{
                    if(res.code == 0){

                        this.EU_ENTERPRISE_INFO = res.data;
                        //对应的企业信息的审核状态
                        //审核失败不让显示
                        this.HasBindEnterprise =!( res.data.status == 3) ;

                    }else{
                            this.HasBindEnterprise = false;
                    }
                });
            },
            bindShowIpt(){
                this.iptflag = true;
            },
            bindIptBlur(){
                this.iptflag = false; 
            },
            bindToAddNewAccount(code){
                this.modleForm.nation = code;//国家code
                this.addNewModel = true;
            },
            bindCloseModel(){  this.addNewModel = false; },
            bindConfirmModel(){
                // console.log(this.modleForm);
                if(!this.modleForm.productCategories) return this.$Message.warning('请选择销售类目！');
                if(!this.modleForm.expectedSale) return this.$Message.warning('请选择预计年销量！');
                addMwsSite(this.modleForm).then(res=>{
                    if(res.code==0){
                        this.$Message.success(`添加成功！`);
                        this.addNewModel = false;
                        setTimeout(()=>{
                            window.location.reload();
                        },500);
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
            },
            bindSendAjax(){
                if(!this.form.remark) return this.$Message.error(`请输入备注名！`);
                if(this.form.remark == this.pageData.alias) return this.$Message.error(`请输入新的备注名！`);

                if(this.AjaxIng) return;
                this.AjaxIng = true;

                updateStoreRemark(this.form).then(res=>{
                    this.AjaxIng = false;
                    if(res.code==0){
                        this.$Message.success(`修改成功！`);
                        this.iptflag = false; 
                        this.pageData.alias = this.form.remark;
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
            },

            nationName(code){
                let n;
                NationCode.forEach(item=>{
                    if(item.code == code){ n = item.nation };
                });
                return n;
            },
            saleUnitFn(){
                let code = this.modleForm.nation;
                let plat = this.pageData.platformCode
                if(['BM','YD'].indexOf(plat)>-1){
                     let untis = '美元';
                     switch(code){
                         case 'MX':
                         case 'US':{ untis = '美元' } break;
                         case 'CA':{ untis = '加元' } break;
                     }
                     return untis
                 };

                if(['EU'].indexOf(plat)>-1){
                    return code === 'GB' ? "英镑" : "欧元";
                };
            },

            bindSubStr(str){
                if(/^GB/.test(str)){
                    return  str.substr(str.length-8);
                }else{
                    return str;
                }
            },
            BindCopyEvent(event){
                 let oClassName = event.target.className;
                 if(oClassName.indexOf('active')>-1) return;
                    
                let clipboard = new Clipboard('.CopyElement');
                    clipboard.on('success', e => {

                        clearTimeout(timeId);
                        event.target.className = oClassName+" active";
                        let timeId =  setTimeout(()=>{
                            event.target.className = oClassName;
                        },2000);

                      // 释放内存
                      clipboard.destroy()
                    });
                    clipboard.on('error', e => {
                      // 不支持复制
                        this.$Message.error('该浏览器不支持自动复制');
                      // 释放内存
                        clipboard.destroy()
                    });
            }
        },
        components:{
            AuthenticationCompany,
            AdminModel,
        }
    }
</script>

<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';
    .store-name{
        padding: 0 38px;
        margin-bottom: 10px;
        padding-bottom: 10px;
        h2{
            font-size: 24px;
            color: #333;
            font-weight: normal;
            line-height: 56px;
             span{
                font-size: 14px;
                margin-left: 20px;
                color: #aaa;
            }
        }
        p{
            line-height: 30px;
            color: #999;
            font-size: 14px;

            a,i,
            .el-input{
                margin-left: 10px;
            }
        }
    }

    .account-info{
        padding: 0 38px;
        margin-bottom: 10px;
        h3{
            margin-bottom: 27px;
        }
    }

    .add-new-account{
        padding: 20px 38px;
    }
    .cares-model-close{
        position: absolute;
        right: 5px;
        top: -25px;
    }

    .account-item{
        height: 73px;

        label{
            display: inline-block;
            width: 175px;
            vertical-align: middle;
            span{
                display: inline-block;
                width: 100%;
            }
            .cn{
                font-size: 14px;
                color: #666;
            }
            .en{
                font-size: 12px;
                color: #999;
            }
        }
        p{
            display: inline-block;
            vertical-align: middle;
            font-size: 14px;
            color: #666;
        }
    }

    .accountNo-box{
        display: inline-block;
        vertical-align: middle;
         .authenNotice{
            margin-left: 0px;
        }
    }

       .copy{
            display: inline-block;
            width: 44px;
            height: 20px;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
            border-radius: 10px;
            border: 1px solid #e5e5e5;
            margin-left: 20px;
            cursor: pointer;
            position: relative;
            &:hover{
                border-color: $--color-primary-two;
                color: $--color-primary-two;
            }

            .yes{
                position: absolute;
                width:200px;
                left: 100%;
                text-align: left;
                opacity: 0;
                transition: all .5s;
                z-index: -100;
                margin-left: 20px;
            }

            &.active{
                .yes{
                    opacity: 1;
                     z-index: 1;
                }
            }
        }
</style>

<style lang="scss">
// @import './../../../../css/common/theme.scss';

.store-detaile-container{
    .modal-container{
        width:400px;
        left:50%;
        margin-left:-200px;
        color: #333;
        form{
            margin-bottom:40px;
            padding-top:40px;
        }
        .el-form-item__label{
            width:130px;
        }
        .el-select{
            width:190px;
        }
        h3,p{
            text-align:center;
            margin-bottom:10px;
            font-weight:normal;
            span{
                width:50%;
                margin-bottom:10px;
                font-size:12px;
                cursor: pointer;
            }
        }
        h3{
            margin-top: 60px;
            font-weight:normal;
        }
        .name{
            font-size:14px;
            color:#999;
        }
    }
}
</style>

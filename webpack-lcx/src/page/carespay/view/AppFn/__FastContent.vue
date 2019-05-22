<template>
    <div class="fashArrivalContent fadeIn">
        <h2 class="banner-module-title">闪提宝</h2>
        <div class="auto-tab">
            <span @click="bindSlectTab(1)" :class="{active:activeTab==1}">已开通店铺</span>
            <span @click="bindSlectTab(0)" :class="{active:activeTab==0}">未开通店铺</span>
        </div>

        <!-- 已开通 -->
        <div v-if="!LOADING && HASSTORE && activeTab==1" class="fadeIn">

             <div class="fastArrivalBanner">
                <p class="fl">已累计提前账期：<span>{{statistical.periodCount}}天</span></p>
                <p class="fr">已累计为您节省费用：<span>￥{{statistical.periodProfit}}</span></p>
            </div>

            <div class="plat-form-item" v-for="(item,key) in STORES_" :key="key">
                <p class="logo-title" v-if="key=='BM'"> <span class="amazon-logo"></span>北美站 </p>
                <p class="logo-title" v-if="key=='EU'"> <span class="amazon-logo"></span>欧洲站 </p>
                <p class="logo-title" v-if="key=='YD'"> <span class="amazon-logo"></span>印度站 </p>
                <CTable>
                    <table>
                        <thead>
                            <tr>
                                <th> <el-checkbox :disabled="!item.length" v-model="platCheck[key]" @change="bindPlatCheckChange(key)"></el-checkbox> </th>
                                <th class="per30">店铺名</th>
                                <th class="per20">提现账户</th>
                                <th class="per20">提现方式</th>
                                <th class="per20">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(innerItem,index) in item" :key="index"> 
                                <td>  <el-checkbox :label="innerItem.actualStoreId"  v-model="slectBox"></el-checkbox> </td>
                                <td> {{innerItem.storeName}} 
                                    <el-tooltip :disabled="!innerItem.finishTime" class="item" effect="dark" :content="`免费享用闪提宝服务店铺，服务截止日期：${formatData(innerItem.finishTime)}`" placement="top-end">
                                        <span v-if="innerItem.isFlashWithdraw==1" title="闪提宝店铺"  class="flash-icon"></span> 
                                    </el-tooltip>
                                </td>
                                <td> {{innerItem.autoWithdrawAccountNumber}} </td>
                                <td>{{innerItem.isAutoWithdraw==1?'自动提现':'手动提现'}}</td>
                                <td> 
                                    <span class="cares-button-primary pain"  @click="bindToUpDataAutoPay(
                                            innerItem.actualStoreId,
                                            innerItem.autoWithdrawAccountId,
                                            key,
                                            innerItem.isAutoWithdraw,
                                            innerItem.channelType
                                        )">
                                        <i class="el-icon-edit-outline"></i>
                                    </span> 
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CTable>
            </div>


            <div class="handle-nav">
                <el-checkbox :disabled="!HASSTORE" v-model="slectAll" @change="bindSlectAllChange">全选</el-checkbox>
                <p>共 <span>{{slectBox.length}}</span> 个店铺</p>
                <a href="javascript:;" class="btn fr" @click="toCloseFlashWithdraw" :class="{disabled:!(slectBox.length)}">关闭闪提宝</a>
            </div>
           
        </div>
        
        <!-- 未开通 -->
        <div v-if="!LOADING && HASSTORE && activeTab==0" class="unOpening fadeIn">

            <div class="plat-form-item" v-for="(item,key) in STORES_" :key="key">
                <p class="logo-title" v-if="key=='BM'"> <span class="amazon-logo"></span>北美站 </p>
                <p class="logo-title" v-if="key=='EU'"> <span class="amazon-logo"></span>欧洲站 </p>
                <p class="logo-title" v-if="key=='YD'"> <span class="amazon-logo"></span>印度站 </p>
                <CTable>
                    <table>
                        <thead>
                            <tr>
                                <th class="per40"> <el-checkbox :disabled="!item.length" v-model="platCheck[key]" @change="bindPlatCheckChange(key)"></el-checkbox> </th>
                                <th>店铺名</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr  v-for="(innerItem,index) in item" :key="index"> 
                                <td>  <el-checkbox :label="innerItem.actualStoreId"  v-model="slectBox"></el-checkbox> </td>
                                <td> {{innerItem.storeName}} </td>
                            </tr>
                        </tbody>
                    </table>
                </CTable>
            </div>

             <div class="handle-nav">
                <el-checkbox :disabled="!HASSTORE" v-model="slectAll" @change="bindSlectAllChange">全选</el-checkbox>
                <p>共 <span>{{slectBox.length}}</span> 个店铺</p>
                <a href="javascript:;" class="btn fr" @click="bindToConfirm" :class="{disabled:!(slectBox.length)}">开通闪提宝</a>
            </div>
        </div>

         <!-- kong  -->
        <div v-if="!LOADING && !HASSTORE" class="empty fadeIn">
             <img src="../../../../images/carepay/empty.png" alt="暂无内容">
             <p v-if="activeTab==1">暂无已开通店铺...</p>
             <p v-if="activeTab==0">暂无未开通店铺...</p>
        </div>

        <!-- 开通确认 -->
        <AdminModel v-model="model.CF" class="__auto-content-admin-model">
             <div class="auto-content-model" style="padding-bottom:56px;">
                <h3>开通闪提宝</h3>
                <ul>
                    <li>
                        <label>所选店铺：</label>
                        <span class="cares-color" v-for="(item,index) in _STORE_NAME" :key="index">{{item}}</span>
                    </li>
                </ul>
                <div class="contract">
                    <el-checkbox v-model="isRead" label="我已阅读并同意" ></el-checkbox><a class="cares-color" href="javascript:;" @click="changeStatus('Contract',true)">《闪提宝服务条款》</a>
                </div>
                <p>
                    <span @click="changeStatus('CF',false)" class="cares-button-danger pain">取消</span>
                    <span @click="bindToCFconfirm" :class="isRead?'cares-button-primary':'cares-button-info'">确认</span>
                </p>
           </div>
        </AdminModel>
        <!-- 修改提现方式 -->
        <AdminModel v-model="model.Modify" class="__auto-content-admin-model __modify-withdraw-type">
            <div class="auto-content-model">
                <h3>修改提现方式</h3>
                <ul>
                    <li>
                        <label>平台：</label>
                        <span v-if="modifyForm.platformCode=='BM'">亚马逊北美站</span>
                        <span v-if="modifyForm.platformCode=='EU'">亚马逊欧洲站</span>
                        <span v-if="modifyForm.platformCode=='YD'">亚马逊印度站</span>
                    </li>
                    <li>
                        <label>店铺：</label>
                        <span  class="cares-color">{{findStoreName(modifyForm.storeId)}}</span>
                    </li>
                    <li>
                        <label>提现方式：</label>
                        <el-tooltip :disabled="modifyForm.storeType!='C'" content="该店铺不支持自动提现" placement="top">
                            <el-radio v-model="modifyForm.type" label="1" :disabled="modifyForm.storeType=='C'" name="withdrawsType">自动提现</el-radio>
                        </el-tooltip>
                        <el-radio v-model="modifyForm.type" label="0" name="withdrawsType">手动提现</el-radio>
                        <!-- <template v-if="modifyForm.storeType=='C'">
                            <br/><span style="margin-left:124px;" class="ING"></span>
                        </template> -->
                    </li>
                    <li v-if="modifyForm.type==1">
                        <label>提现账户：</label>
                        <el-select v-model="modifyForm.withdrawAccountId" placeholder="选择提现账户">
                              <el-option v-for="(listItem,index) in holdInfoList" :key="index"
                                :label="`${listItem.bankName}  ${farmatBankCode(listItem.bankNumber)}`"
                                :value="listItem.id"
                              ></el-option>
                        </el-select>
                    </li>

                    <p>
                        <span @click="changeStatus('Modify',false)" class="cares-button-danger pain">取消</span>
                        <span class="cares-button-primary" @click="confirmModify">确认</span>
                    </p>
                </ul>
            </div>
        </AdminModel>
        
        <!-- 闪提宝服务协议 -->
        <AdminModel v-model="model.Contract"  class="__fast-arrival __auto-content-admin-model clause">
             <div class="clause-content">
                 <h3>闪提宝产品服务协议</h3>
                 <p>闪提宝是CaresPAY为亚马逊卖家打造的一款提前垫资产品，旨在提升卖家资金周转效率，使用闪提宝的亚马逊卖家可享受亚马逊账期一到即可提现的服务（提现时间以CaresPAY短信为准）。</p>
                 <p>开通条件：客户在CaresPAY提交实名认证并绑定店铺即可享用闪提宝服务。目前闪提宝支持的平台有亚马逊北美站和亚马逊欧洲站。</p>
                 <p>开通费用：CaresPAY会按照客户每笔提现金额的0.1%收取手续费。</p>
                 <p>服务生效：闪提宝的最小服务单位为亚马逊店铺。客户在CaresPAY商户后台可对店铺开通闪提宝服务，服务生效日期以客户开通日期为准。</p>
                 <p>服务终止：开通闪提宝服务的客户可在CaresPAY商户后台关闭该服务，服务终止日期以客户点击关闭日期为准。</p>
                 <p>闪提宝是CaresPAY旗下产品，客户使用该服务需同意《CaresPAY服务协议》条款。CaresPAY保留对闪提宝的最终解释权。</p>

                 <p style="text-indent:0;">
                     <span style="font-weight:bold;text-decoration:none;">{{activeTab==1?'关闭':'开通'}}闪提宝同意书</span><br/>
                     本人授权以下店铺:</p>
                 <p style="margin-top:-15px;"> 
                     <span class="cares-color" v-for="(item,index) in _STORE_NAME" :key="index">{{item}}</span>
                 </p>
                 <p>开通CaresPAY“闪提宝”产品服务，享受亚马逊账期到期（以CaresPAY短信为准）即可提现的服务。本人同意CaresPAY按照每笔提现金额的0.1%收取手续费。</p>
                 <div>
                     <span style="width:60px;" @click="changeStatus('Contract',false)" class="cares-button-danger pain">不同意</span>
                     <span style="width:60px;" @click="AgreeContract" class="cares-button-primary">同意</span>
                 </div>
            </div>
        </AdminModel>

        <!-- 自动提现条款 -->
        <AdminModel v-model="model.AutoPay" class="__auto-content-admin-model clause">
            <div class="clause-content">
                 <h3>自动提现使用条款</h3>
                 <p>本人同意亚马逊店铺资金变为可提现状态（以收到CaresPAY提现短信通知为准）后，授权CaresPAY系统自动打款到本人绑定在CaresPAY商户后台的银行账户。</p>
                 <p>本人授权自动打款的店铺如下:</p>
                 <p style="margin-top:-15px;"> 
                     <span class="cares-color" v-for="(item,index) in _STORE_NAME" :key="index">{{item}}</span>
                 </p>
                 <p>提现账户为：<span style="font-size:16px;font-weight:bold;" class="cares-color">{{(modifyForm.withdrawAccountId) | fineAccountNum(holdInfoList) }}</span></p>
                 <p>本人同意：工作时间内收到提现通知短信后，授权 CaresPAY 当天给本人付款；在非工作时间内收到提现通知短信，则授权 CaresPAY 在下一个工作日给本人付款。本人接受换汇汇率为 CaresPAY 实际打款时的合作银行实时交割汇率，所有由于汇率波动而产生的实际交易损失由本人承担。 工作时间：周一到周五9:00至18:30，节假日除外。</p>
                 <p>应本人要求，CaresPAY 在打款后需要给本人提供相应（电子版）打款凭证。本人同意，CaresPAY 提供相应（电子版）打款凭证后，CaresPAY 已完成作为代理收款商对该笔资金管理的全部责任，CaresPAY 将不需承担对该笔资金的后续一切法律责任。</p>
                 <div>
                     <span style="width:60px;" @click="changeStatus('AutoPay',false)" class="cares-button-danger pain">不同意</span>
                     <span style="width:60px;" @click="bindContracyConfirm(1)" class="cares-button-primary">同意</span>
                 </div>
            </div>
        </AdminModel>

        <!-- 开通成功/提示 -->
        <AdminModel v-model="model.Success" class="__auto-content-admin-model">
            <div class="auto-content-model auto-content-close-fn">
                 <h3>提示</h3>
                 <ul>
                     <li>您将要关闭以下店铺的闪提宝服务</li>
                     <li><span class="cares-color" v-for="(item,index) in _STORE_NAME" :key="index">{{item}}</span></li>
                     <li>关闭后，您的相关店铺不再有闪提宝服务，确认关闭吗？</li>
                 </ul>
                 <p>
                     <span @click="changeStatus('Success',false)" class="cares-button-primary pain">再想想</span>
                     <span @click="CloseFleshWithdraw" class="cares-button-primary">确认关闭</span>
                 </p>
            </div>
        </AdminModel>


        <AdminModel v-model="model.CloseAuto" class="__auto-content-admin-model">
            <div class="auto-content-model auto-content-close-fn">
                <h3>提示</h3>
                <ul>
                    <li>您将要关闭以下店铺的自动提现</li>
                    <li><span class="cares-color" v-for="(item,index) in _STORE_NAME" :key="index">{{item}}</span></li>
                    <li>关闭后，您需要登录CaresPAY商户后台手动操作提现，确认关闭吗？</li>
                </ul>
                <p>
                    <span @click="changeStatus('CloseAuto',false)" class="cares-button-primary pain">再想想</span>
                    <span @click="bindContracyConfirm(0)" class="cares-button-primary">确认关闭</span>
                </p>
            </div>
        </AdminModel>
    </div>
</template>


<script>

import './../../../../css/carespay/activeFnContent.scss';
import AdminModel from './../../../../components/adminModel.vue';

import { hideNumberCode,formatTimer } from './../../../../js/common.js';

import CTable from './../../../../components/CTable.vue';

import { 
    getflashWithdrawNotice,
    getFlashWithdrawStatistics,
    getFlashWithdrawStore,
    bindFlashWithdraw,
    unBindFlashWithdraw,
    updateAutoWithdraw
    } from  './../../../../js/api.js';

import { 
    queryAccountModleData
} from '../../utils/localbase.js';

export default {
    data(){
        return {
            activeTab:"",
            STORES_:{
                BM:[],
                EU:[],
                YD:[],
            },
            platCheck:{
                BM:false,
                EU:false,
                YD:false,
            },
            //闪提宝节省统计
            statistical:{},

            slectAll:false,
            slectBox:[],


            LOADING:false,
            ING:false,

            modifyForm:{
                storeId:'',
                platformCode:'',
                type:'',                //提现方式
                storeType:'',           //店铺提现方式
                withdrawAccountId:'',   //自动提现的银行ID
            },

            isRead:false,       //是否已经阅读了条款

            model:{
                CF:false,       //开通确认
                Contract:false,     //服务协议
                Success:false,      //开通成功弹窗
                Modify:false,       //修改提现方式
                AutoPay:false,       //自动提现条款
                CloseAuto:false,       //关闭自动提现的提示
            },
            holdInfoList:[],
        }
    },
    props:['tabIndex'],
    created(){
        this.bindSlectTab(this.tabIndex);
        queryAccountModleData().then(res=>{
            res.forEach(account=>{
                (account.status==2 && account.currency=='CNY') && this.holdInfoList.push(account);
            });
        });
    },
    watch:{
        "tabIndex"(nIndex){
            this.bindSlectTab(nIndex);
        },
        slectBox(NEWS){

            let flagAll = true;

            for (const key in this.STORES_) {
                let flag = true;
                this.STORES_[key].forEach(item=>{
                    if(NEWS.indexOf(item.actualStoreId)<0){
                        flag = false;
                        flagAll = false;
                    }
                });
                if(!(NEWS.length)) flag = false;
                this.platCheck[key] = flag;
            };
            if(!(NEWS.length)) flagAll = false;
            //全部的
            this.slectAll = flagAll;
        },
    },
    methods:{
        __reset(){
            this.slectBox = [];
            for (const key in this.platCheck) {
                this.platCheck[key] = false;
            };
            for (const key in this.STORES_) {
                this.STORES_[key] = [];
            };

            this.slectAll = false;
        },
        __QueryList(num){
             if(this.LOADING) return;
            this.LOADING = true;
            getFlashWithdrawStore({type:num}).then(res=>{
                this.LOADING = false;
                if(res.code==0){
                    let OBJ =  {};
                    res.data.length && res.data.forEach(item=>{
                        item.platformCode in OBJ ?
                            (
                                OBJ[item.platformCode].push(item)
                            ):
                            (
                                OBJ[item.platformCode] = [item]
                            );
                    });
                    //数据对象
                    this.STORES_ = OBJ;
                }else{
                    this.$Message.error(res.msg);
                }
            });

            //已开通统计节省的结果
            num == 1 && getFlashWithdrawStatistics().then(res=>{
                if(res.code==0){
                    this.statistical = res.data;
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
       bindSlectTab(index){
           this.__reset();
           this.activeTab = index;
           this.__QueryList(index);
       },
       bindPlatCheckChange(key){
            if(this.platCheck[key]){
                 this.STORES_[key].forEach(item=>{
                      if(!this.slectBox.includes(item.actualStoreId)){ this.slectBox.push(item.actualStoreId) };
                 });
            }else{
                this.STORES_[key].forEach(item=>{
                    let index = this.slectBox.indexOf(item.actualStoreId);
                    if(index>-1) {
                        this.slectBox.splice(index,1);
                    };
                 });
                
            };
       },
       //编辑提现方式
       bindToUpDataAutoPay(STOREID,BANKID,platformCode,widthDrawType,storeType){
            this.slectBox = [STOREID]
            this.modifyForm.storeId = STOREID;

            this.modifyForm.withdrawAccountId = BANKID;
            this.modifyForm.platformCode = platformCode;
            this.modifyForm.storeType = storeType;
            this.modifyForm.type = String(widthDrawType);

            this.changeStatus('Modify',true);
       },

       bindSlectAllChange(){
            if(this.slectAll) {

                for (const key in this.STORES_) {
                    this.STORES_[key].forEach(item=>{
                        if(!this.slectBox.includes(item.actualStoreId)){this.slectBox.push(item.actualStoreId)};
                    });
                };

           }else{
               this.slectBox = [];
           };
       },
       //关闭闪提宝
       toCloseFlashWithdraw(){
           if(!this.slectBox.length) return;
           this.changeStatus('Success',true);
       },
       bindToConfirm(){
           if(!this.slectBox.length) return;
           this.isRead = false;
           this.changeStatus('CF',true);
       },
       changeStatus(prop,bol){
           this.model[prop] = bol;
       },
       //确认开通闪提宝服务
       bindToCFconfirm(){   
           if(!this.isRead) return this.$Message.error('请阅读并同意闪提宝服务条款！');
            if(this.ING) return;
             this.ING = true;
            bindFlashWithdraw({customerStore:this.slectBox.join(",")}).then(res=>{
                this.ING = false;
                if(res.code==0){
                    this.changeStatus('CF',false);
                    this.$router.push({
                         name:"AuthenticationDone",
                         params:{
                             source:'FleshWithdraw',
                         }
                     });
                    // this.changeStatus('Success',true);
                    //刷新未开通的列表
                    // this.bindSlectTab(0);
                }else{
                    this.$Message.error(res.msg);
                }
            });
       },
       //闪提宝条款同意
       AgreeContract(){
           this.isRead = true;
           this.changeStatus('Contract',false);
       },
       //确认修改
       confirmModify(){
        //1. 未修改的数据
        let {isAutoWithdraw,autoWithdrawAccountId} = this.STORES_[this.modifyForm.platformCode].find(item=>{
            return item.actualStoreId== this.modifyForm.storeId
        });

        let {  type,withdrawAccountId } = this.modifyForm;
        
        if(type==1){

            if(!withdrawAccountId) return this.$Message.warning('请选择提现账户！');
            
            isAutoWithdraw == 1 ? 
            //2. 修改自动提现银行账号
                (withdrawAccountId != autoWithdrawAccountId ? this.changeStatus('AutoPay',true) : this.$Message.warning('未做任何修改！')) :
                //3. 如果提现方式手动变成自动
                (this.changeStatus('AutoPay',true));

        }else{//手动
            //4. 关闭自动提现
            isAutoWithdraw == 1 ? this.changeStatus('CloseAuto',true) :(
                this.$Message.warning('未做任何修改！')
            );
        };

        // this.changeStatus('Modify',false);
       },
       //自动提现条款同意确认
       bindContracyConfirm(status){
            if(this.ING) return;
            this.ING = true;
            updateAutoWithdraw({
                withdrawStatus:status,
                storeIdList:this.slectBox,
                withdrawAccountId: status==1 ? this.modifyForm.withdrawAccountId :''
            }).then(res=>{
                this.ING = false;
                if(res.code==0){
                     this.$Message.success(res.msg);
                     this.changeStatus('Modify',false);
                     this.changeStatus('AutoPay',false);
                     this.changeStatus('CloseAuto',false);
                    //刷新已开通的列表
                    this.bindSlectTab(1);
                }else{
                    this.$Message.error(res.msg);
                }
            });
       },
       //确认关闭自动提现
       CloseFleshWithdraw(){
            if(this.ING) return;
            this.ING = true;
            unBindFlashWithdraw({customerStore:this.slectBox.join(",")}).then(res=>{
                this.ING = false;
                if(res.code==0){
                    this.changeStatus('Success',false);
                    //刷新已开通的列表
                    this.bindSlectTab(1);
                }else{
                    this.$Message.error(res.msg);
                }
            });
       },
       farmatBankCode(val){
            return hideNumberCode(val)
        },

        formatData(value){
            return formatTimer(value,true)
        },

        findStoreName(id){
            let name=null;
            for (const key in this.STORES_) {
                this.STORES_[key].find(item=>{
                    if(item.actualStoreId == id){
                        name = item.storeName
                    }
                });
            };

            return name;
        }
        
    },
    computed:{
        HASSTORE(){
            let flag = false;
            for (const key in this.STORES_) {
                if(this.STORES_[key].length){
                    flag = true;
                }
            }
            return flag;
        },
        _STORE_NAME(){
            let ARR = [];
            for (const key in this.STORES_) {
                this.STORES_[key].forEach(item=>{
                    this.slectBox.includes(item.actualStoreId) && ARR.push(item.storeName);
                });
            };

            return ARR;
        }
    },
    components:{
        AdminModel,
        CTable
    },
    filters:{
        fineAccountNum(value,holdeList){
            let Account = holdeList.find(item=>{
                return item.id == value
            });
            if(Account){
                return Account.bankNumber;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import './../../../../css/common/theme.scss';

    .fashArrivalContent{
        min-height: 300px;
        color: #666;
        padding-bottom: 20px;
    }

    .fastArrivalBanner{
        height: 90px;
        margin: 20px 0;
        background: url('../../../../images/carepay/闪提宝banner.png') no-repeat center center;
        p{
            font-size: 18px;
            color: #fff;
            margin-top: 28px;
            span{
                font-size: 26px;
                font-weight: bold;
            }
        }
        .fl{
            margin-left: 140px;
        }
        .fr{
            margin-right: 140px;
        }
    }

    .contract{
        padding: 20px 0;
        padding-left: 50px;
        font-size: 14px;
        border: 1px solid #e5e5e5;
        border-left: none;
        border-right: none;
    }

    .appFnContainer .auto-content-success{
        padding-top: 20px;
        min-height: 150px;
        div{
            text-align: center;
        }
        p{
            span{
                margin-left: 10px;
            }
        }
    }

    .appFnContainer .auto-content-close-fn{
        padding-left: 40px;
        padding-right: 40px;
        padding-bottom: 36px;
        li{
            margin-bottom: 10px;
            color: #333;
            font-size: 14px;
            span{
                color: $--color-primary-one;
            }
        }
    }
</style>

<style lang="scss">
.__fast-arrival{
    .modal-container{
        top:40px;
    }
}



.__modify-withdraw-type{
    .modal-container{
        min-height:280px;
    }
}
</style>


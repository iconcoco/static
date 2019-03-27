<template>
    <div class="fadeIn AutoPayContainer">
        <div class="auto-tab">
            <span @click="bindSlectTab(1)" :class="{active:activeTab==1}">已开通店铺</span>
            <span @click="bindSlectTab(0)" :class="{active:activeTab==0}">未开通店铺</span>
        </div>
        <!-- 已开通 -->
        <div v-if="HASSTORE && activeTab==1">

            <div class="plat-form-item" v-for="(item,key) in STORES_" :key="key">
                <p class="logo-title" v-if="key=='BM'"> <span class="amazon-logo"></span>北美站 </p>
                <p class="logo-title" v-if="key=='EU'"> <span class="amazon-logo"></span>欧洲站 </p>
                <p class="logo-title" v-if="key=='YD'"> <span class="amazon-logo"></span>印度站 </p>
                <table>
                    <thead>
                        <tr>
                            <th> <el-checkbox :disabled="!item.length" v-model="platCheck[key]" @change="bindPlatCheckChange(key)"></el-checkbox> </th>
                            <th class="per20">店铺名</th>
                            <th class="per40">提现账户</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(innerItem,index) in item" :key="index"> 
                            <td>  <el-checkbox :label="innerItem.actualStoreId"  v-model="slectBox"></el-checkbox> </td>
                            <td> {{innerItem.storeName}} </td>
                            <td> {{innerItem.autoWithdrawAccountNumber}} </td>
                            <td> 
                                <span class="cares-button-primary pain"  @click="bindToUpDataAutoPay(innerItem.actualStoreId,innerItem.autoWithdrawAccountId,key)">
                                    <i class="el-icon-edit-outline"></i>
                                </span> 
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


            <div class="handle-nav">
                <el-checkbox :disabled="!HASSTORE" v-model="slectAll" @change="bindSlectAllChange">全选</el-checkbox>
                <p>共 <span>{{slectBox.length}}</span> 个店铺</p>
                <a href="javascript:;" class="btn fr" @click="bindToCloseAutoPay" :class="{disabled:!(slectBox.length)}">关闭自动提现</a>
            </div>
           
        </div>

        <!-- 未开通 -->
        <div v-if="HASSTORE && activeTab==0" class="unOpening">

            <div class="plat-form-item" v-for="(item,key) in STORES_" :key="key">
                <p class="logo-title" v-if="key=='BM'"> <span class="amazon-logo"></span>北美站 </p>
                <p class="logo-title" v-if="key=='EU'"> <span class="amazon-logo"></span>欧洲站 </p>
                <p class="logo-title" v-if="key=='YD'"> <span class="amazon-logo"></span>印度站 </p>
                <table>
                    <thead>
                        <tr>
                            <th class="per10"> <el-checkbox :disabled="!item.length" v-model="platCheck[key]" @change="bindPlatCheckChange(key)"></el-checkbox> </th>
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
            </div>

             <div class="handle-nav">
                <el-checkbox :disabled="!HASSTORE" v-model="slectAll" @change="bindSlectAllChange">全选</el-checkbox>
                <p>共 <span>{{slectBox.length}}</span> 个店铺</p>
                <a href="javascript:;" class="btn fr" @click="bindToConfirm" :class="{disabled:!(slectBox.length)}">开通自动提现</a>
            </div>
        </div>

        <!-- kong  -->
        <div v-if="!ING && !HASSTORE" class="empty">
             <img src="../../../../images/carepay/empty.png" alt="暂无内容">
             <p v-if="activeTab==1">暂无已开通店铺...</p>
             <p v-if="activeTab==0">暂无未开通店铺...</p>
        </div>

        <AdminModel v-model="model.SZ" class="__auto-content-admin-model">
           <div class="auto-content-model">
                <h3 v-if="activeTab==0">开通自动提现</h3>
                <h3 v-if="activeTab==1">修改提现账户</h3>
                <ul>
                    <li v-if="activeTab==1">
                        <label>平 台：</label>
                        <span v-if="addForm.platformCode=='BM'">亚马逊北美站</span>
                        <span v-if="addForm.platformCode=='EU'">亚马逊欧洲站</span>
                        <span v-if="addForm.platformCode=='YD'">亚马逊印度站</span>
                    </li>

                    <li>
                        <label>店 铺：</label>
                        <span v-for="(item,index) in SL_STORE_NAME" :key="index" class="cares-color">{{item}}</span>
                    </li>
                   
                    <li>
                        <label>提现账户：</label>
                        <el-select v-model="addForm.withdrawAccountId" placeholder="选择提现账户">
                              <el-option v-for="(listItem,index) in holdInfoList" :key="index"
                                :label="`${listItem.bankName}  ${farmatBankCode(listItem.bankNumber)}`"
                                :value="listItem.id"
                              ></el-option>
                        </el-select>
                    </li>
                </ul>
                <p>
                    <span @click="bindToClose('SZ')" class="cares-button-danger pain">取消</span>
                    <span @click="bindToSZconfirm" class="cares-button-primary">确认</span>
                </p>
           </div>
        </AdminModel>

        <AdminModel v-model="model.TK" class="__auto-content-admin-model clause">
            <div class="clause-content">
                 <h3>自动提现使用条款</h3>
                 <p>本人同意亚马逊店铺资金变为可提现状态（以收到CaresPAY提现短信通知为准）后，授权CaresPAY系统自动打款到本人绑定在CaresPAY商户后台的银行账户。</p>
                 <p>本人授权自动打款的店铺如下:</p>
                 <p style="margin-top:-15px;"> 
                     <span v-for="(item,index) in SL_STORE_NAME" :key="index" class="cares-color">{{item}}</span>
                 </p>
                 <p>提现账户为：<span style="font-size:16px;font-weight:bold;" class="cares-color">{{showBankNumber(addForm.withdrawAccountId)}}</span></p>
                 <p>本人同意：工作时间内收到提现通知短信后，授权 CaresPAY 当天给本人付款；在非工作时间内收到提现通知短信，则授权 CaresPAY 在下一个工作日给本人付款。本人接受换汇汇率为 CaresPAY 实际打款时的合作银行实时交割汇率，所有由于汇率波动而产生的实际交易损失由本人承担。 工作时间：周一到周五9:00至18:30，节假日除外。</p>
                 <p>应本人要求，CaresPAY 在打款后需要给本人提供相应（电子版）打款凭证。本人同意，CaresPAY 提供相应（电子版）打款凭证后，CaresPAY 已完成作为代理收款商对该笔资金管理的全部责任，CaresPAY 将不需承担对该笔资金的后续一切法律责任。</p>
                 <div>
                     <span style="width:60px;" @click="bindToClose('TK')" class="cares-button-danger pain">不同意</span>
                     <span style="width:60px;" @click="__ChangeStatus" class="cares-button-primary">同意</span>
                 </div>
            </div>
        </AdminModel>

        <AdminModel  v-model="model.CLOSE" class="__auto-content-admin-model">
            <div class="close-auto-pay-model">
                 <h3>提示</h3>
                 <p>您将要关闭以下店铺的自动提现</p>
                 <p>
                     <span v-for="(item,index) in SL_STORE_NAME" :key="index" class="cares-color">{{item}}</span>
                 </p>
                 <p>关闭后，您需要登录CaresPAY商户后台手动操作提现，确认关闭吗？</p>
                 <div>
                     <span @click="bindToClose('CLOSE')" class="cares-button-danger pain">再想想</span>
                     <span @click="__ChangeStatus" class="cares-button-primary">确认关闭</span>
                 </div>
            </div>
        </AdminModel>

    </div>
</template>

<script>

import { 
    hideNumberCode
} from '../../../../js/common.js';

import AdminModel from './../../../../components/adminModel.vue';

import {queryAutoWithdrawStore,updateAutoWithdraw} from './../../../../js/api.js';

  import { 
        queryAccountModleData
    } from '../../utils/localbase.js';

export default {
    data(){
        return{
            
            platCheck:{
                BM:false,
                EU:false,
                YD:false,
            },
            STORES_:{
                BM:[],
                EU:[],
                YD:[],
            },
            slectBox:[],
            slectAll:false,

            activeTab:1,
            holdInfoList:[],
            addForm:{
                withdrawAccountId:'',
                storeIdList:'',
                platformCode:'',
                withdrawStatus:'',
            },

            model:{
                SZ:false,
                TK:false,
                CLOSE:false
            }

            ,ING:false,
        }
    },
    props:['status','data'],
    components:{
        AdminModel
    },
    created(){
        this.activeTab = this.status;
        this.__QueryList(this.activeTab);
         //提现银行卡
        queryAccountModleData().then(res=>{
            res.forEach(account=>{
                (account.status==2 && account.currency=='CNY') && this.holdInfoList.push(account);
            });
        });
    },
    watch:{
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
        SL_STORE_NAME(){
            let ARR = [];
            for (const key in this.STORES_) {
                this.STORES_[key].forEach(item=>{
                    if(this.slectBox.indexOf(item.actualStoreId)>-1){
                        ARR.push(item.storeName);
                    }
                });
            };

            return ARR;
        }
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

            this.addForm.withdrawAccountId="";

            this.slectAll = false;
        },
        __QueryList(num){
            if(this.ING) return;
            this.ING = true;
            queryAutoWithdrawStore({isAutoWithdraw:num}).then(res=>{
                this.ING = false;
                if(res.code==0){
                    let OBJ =  {};
                    res.data.forEach(item=>{
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
        },
        //请求接口改变状态
        __ChangeStatus(){

            updateAutoWithdraw({
                withdrawStatus:this.addForm.withdrawStatus,
                storeIdList:this.slectBox,
                withdrawAccountId:this.addForm.withdrawAccountId
            }).then(res=>{
                if(res.code==0){
                    //1. 提示
                    this.$Message.success(res.msg);
                    //2. 关闭模态框
                    for (const key in this.model) {
                        this.model[key] = false;
                    };
                    //3. 重新请求
                    this.bindSlectTab(this.activeTab);
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },


        bindSlectTab(index){ 
            // console.log(index);
            // if(this.activeTab == index) return;
            this.__reset();
            this.activeTab = index; 
            this.__QueryList(this.activeTab);
        },
        //单个平台的全选
        bindPlatCheckChange(key){
            if(this.platCheck[key]){
                 this.STORES_[key].forEach(item=>{
                      if(this.slectBox.indexOf(item.actualStoreId)<0){ this.slectBox.push(item.actualStoreId) };
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
        //所有平台的全选
        bindSlectAllChange(){
           if(this.slectAll) {

                for (const key in this.STORES_) {
                    this.STORES_[key].forEach(item=>{
                        if(this.slectBox.indexOf(item.actualStoreId)<0){this.slectBox.push(item.actualStoreId)};
                    });
                };

           }else{
               this.slectBox = [];
           };
        },

        bindToConfirm(){
            if(!(this.slectBox.length)) return
            this.model.SZ = true;
        },
        bindToCloseAutoPay(){
            if(!this.slectBox.length) return;
            //关闭自动提现的状态
            this.addForm.withdrawStatus = 0;
            this.addForm.withdrawAccountId = '';
            this.model.CLOSE = true;
        },
        bindToSZconfirm(){
            if(!this.addForm.withdrawAccountId) return this.$Message.warning('请选择提现账户');

            //即将需要更新的状态
            this.addForm.withdrawStatus = 1; //开通自动提现

            this.model.SZ = false;
            this.model.TK = true;
        },
        bindToClose(key){
            this.model[key] = false;
        },
        //编辑自动提现的店铺
        bindToUpDataAutoPay(STOREID,BANKID,platformCode){
            this.slectBox.indexOf(STOREID)<0 && this.slectBox.push(STOREID);
            this.addForm.withdrawAccountId = BANKID;
            this.addForm.platformCode = platformCode;

            this.model.SZ = true;
        },
        
        farmatBankCode(num){
            return hideNumberCode(num);
        },
        showBankNumber(code){
            let n = null;
            this.holdInfoList.forEach(item=>{
                if(item.id==code){ n = item.bankNumber  }
            });

            return n;
        }
    },
}
</script>


<style lang="scss" scoped>
    @import './../../../../css/common/theme.scss';
    .AutoPayContainer{
        min-height: 300px;
        color: #666;
        padding-bottom: 20px;
    }

    .auto-tab{
        text-align: center;
        margin-top: 10px;
        span{
            display: inline-block;
            color: #666;
            font-size: 16px;
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            border-bottom: 2px solid #fff;
            cursor: pointer;
            &.active{
                color: $--color-primary-three;
                border-color: $--color-primary-three;
            }
        }
    }

    .handle-nav{
        margin-top: 50px;
        height: 50px;
        line-height: 50px;
        background-color: #F8F8F8;
        padding: 0 20px;
        font-size: 14px;
        p{
            display: inline-block;
            margin-left: 20px;
            span{
                color: $--color-primary-three;
            }
        }
       
        .btn{
            margin-top: 10px;
            display: inline-block;
            padding: 0 20px;
            border-radius: 4px;
            height: 30px;
            line-height: 30px;
            color: $--color-primary-two;
            border: 1px solid $--color-primary-two;
            // transition: all .3s;
            &:hover{
                color:#fff;
                background-color: $--color-primary-two;
                border-color: $--color-primary-two;
            }

            &.disabled{
                color:#fff;
                background-color: #ccc;
                border-color: #ccc;
            }
        }
    }

    .plat-form-item{
        margin: 20px 0 0 0;
        .logo-title{
            font-size: 14px;
            vertical-align: middle;
            span{
                margin-right: 5px;
            }
        }
    }

    .unOpening{
        .plat-form-item{
            width: 50%;
            margin: 20px auto 0;
        }
    }
  
    table{
        width: 100%;
        margin: 10px 0;
        thead{
            background-color: #F8F8F8;
        }
        th,td{
            text-align: center;
             height: 40px;
            line-height: 40px;
            font-size: 14px;
        }
    }

    .clause-content,.close-auto-pay-model{
        width: 490px;
        padding: 20px;
        color:#333;
        h3{
            text-align: center;
            font-size: 16px;
            margin-bottom: 15px;
         }
        p{
            font-size: 14px;
            text-indent: 2em;
            margin-bottom: 15px;
            line-height: 22px;
            text-align: justify;
            text-justify:inter-ideograph;
            color: #666;
            span{
                margin-right: 15px;
                text-decoration: underline;
            }
        } 
        div{
            text-align: center;
            span{
                margin-right: 10px;
            }
        }
    }

    .close-auto-pay-model{
         width: 400px;
        min-height: 100px;
    }


    .auto-content-model{
        width: 400px;
        min-height: 200px;
        color: #333;
         h3{
            text-align: center;
            font-size: 16px;
            margin-bottom: 15px;
        }
        p{
            font-size: 14px;
            // text-indent: 2em;
            // margin-bottom: 15px;
            line-height: 22px;
            text-align: center;
            color: #666;
            position: absolute;
            width: 100%;
            bottom: 15px;
            left: 0;
            span{
                padding: 0 20px;
                margin-right: 10px;
            }
        }
        ul{
            margin-bottom: 15px;
            li{
                line-height: 22px;
                // text-indent: 2em;
                font-size: 14px;
                 text-align: justify;
                 text-justify:inter-ideograph;
                 color: #666;
                 margin-bottom: 20px;
                 label{
                    display: inline-block;
                    width: 120px;
                    text-align: right;
                }
                .cares-color{
                    margin-right: 15px;
                    text-decoration: underline;
                }
            }
        }
        
    }

    .empty{
        text-align: center;
        padding: 70px 0 20px;
        img{
            width: 100px;
        }
        p{
            font-size: 14px;
            color: #aaa;
            margin-top: 10px;
        }
    }
</style>

<style lang="scss">
    .AutoPayContainer{
        //修改element的样式

        table{
            .el-checkbox__label{
                display: none;
            }
        }
    }

    .__auto-content-admin-model{
        &.clause{
            .modal-container{
                margin-left:-255px;
            }
        }
       .modal-container{
            left: 50%;
            margin-left: -200px;
        }
    }
</style>

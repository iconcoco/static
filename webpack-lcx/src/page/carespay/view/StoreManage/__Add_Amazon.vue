<template>
    <div class="fadeIn">
        <div v-if="!isShowEnterprice">
            <div v-if="RefuseReason.length" class="refuse-reason">
                <p>因为以下原因，您的店铺资料审核未通过：</p>
                <ul>
                    <li class="no" v-for="(item,index) in RefuseReason" :key="index">
                        <i class="point no"></i> {{item.remark}}
                    </li>
                </ul>
            </div>

            <div class="form-item platformcode" v-if="!isEdit">
                <span class="bold">账号用途</span>
                <div class="item">
                    <el-radio label="1" v-model="form.storeType">用于创建新的亚马逊店铺</el-radio>
                    <el-radio label="2"  v-model="form.storeType">为已经开立的店铺收款</el-radio>
                </div>
            </div>

            <p class="amazon-notice" v-if="form.storeType==1">对于暂无Amazon店铺的用户，待实名认证通过后，CaresPAY将会为您提供一个待激活的收款账户，便于您注册Amazon新店铺。当您开始售卖产品或完成注册后，您需绑定店铺，避免影响您的亚马逊资金入账。</p>

            <div class="form-item channel" style="border:0px;">
                <span class="bold">店铺信息</span>
            </div>

            <el-form-item label="店铺名称" name="storeName">
                <el-input :disabled="(isEdit && ReturnAuditStatus('storeName'))" type="text" name="storeName" v-model="form.storeName" @blur="bindIptBlur('storeName')"  placeholder="请填写您的店铺名称"></el-input>
            </el-form-item>

            <!-- 店铺所在国家 -->
            <el-form-item name="nation" label="店铺所在国家" class="nations">
                <span class="small">（可多选，再次点击取消）</span>
                <template v-if="form.platformCode=='BM'">
                    
                    <el-checkbox-group v-model="form.defaultNation" >
                        <el-checkbox 
                        v-for="(item,index) in NationCode" :key="index" 
                        v-if="item.platformCode=='BM'"
                        @change="bindNationCodeChange(item.code)"

                        :disabled="(isEdit && ReturnAuditStatus('nation',item.code))" 
                        name="nation"  
                        :label="item.code">
                            {{item.nation}}
                        </el-checkbox>
                    </el-checkbox-group>
                </template>

                <template v-if="form.platformCode=='EU'">
                    <el-checkbox-group v-model="form.defaultNation"  >
                         <el-checkbox 
                        v-for="(item,index) in NationCode" :key="index" 
                        v-if="item.platformCode=='EU'"
                         @change="bindNationCodeChange(item.code)"

                        :disabled="(isEdit && ReturnAuditStatus('nation',item.code))" 
                        name="nation"  
                        :label="item.code">
                            {{item.nation}}
                        </el-checkbox>
                    </el-checkbox-group>
                </template>

                <template v-if="form.platformCode=='YD'">
                    <el-checkbox-group v-model="form.defaultNation" >
                        <el-checkbox 
                        v-for="(item,index) in NationCode" :key="index" 
                        v-if="item.platformCode=='YD'"
                         @change="bindNationCodeChange(item.code)"

                        :disabled="(isEdit && ReturnAuditStatus('nation',item.code))" 
                        name="nation"  
                        :label="item.code">
                            {{item.nation}}
                        </el-checkbox>
                     </el-checkbox-group>
                </template>
            </el-form-item>

            <div class="shop-information" v-for="(code,index) in form.defaultNation" :key="index">
                <p>
                    <span v-if="code=='US'">美国店铺信息</span>
                    <span v-if="code=='CA'">加拿大店铺信息</span>
                    <span v-if="code=='MX'">墨西哥店铺信息</span>
                    <span v-if="code=='DE'">德国店铺信息</span>
                    <span v-if="code=='ES'">西班牙店铺信息</span>
                    <span v-if="code=='FR'">法国店铺信息</span>
                    <span v-if="code=='GB'">英国店铺信息</span>
                    <span v-if="code=='IT'">意大利店铺信息</span>
                    <span v-if="code=='IN'">印度店铺信息</span>
                </p>

                <el-form-item label="销售类目" name="productCategories">
                    <el-select v-model="form.mwsDetail[code].productCategories" 
                    :disabled="(isEdit && ReturnAuditStatus('productCategories',code))"
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
                    <el-select v-model="form.mwsDetail[code].expectedSale" 
                    :disabled="(isEdit && ReturnAuditStatus('expectedSale',code))" 
                    name="expectedSale" 
                    placeholder="请选择年销量">
                        <el-option 
                        v-for="(item,index) in saleCount" 
                        :key="index"
                        :label="`${item.saleName}${saleUnitFn(code)}`"
                        :value="item.saleCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>

            <p v-if="isEdit && showSkipBox" style="margin:10px 0px;"><el-checkbox v-model="skipAuthen" label="暂无授权信息"></el-checkbox></p>
             <!-- 卖家编号和 auth token -->
            <template v-if="!skipAuthen && (form.storeType==2 || isEdit)">
                <div class="form-item" style="margin-bottom:0px; min-height:40px;">
                    <span class="bold" >店铺授权</span>
                </div>

                <p class="text">店铺授权过程中，您需要将开发者信息填写到亚马逊后台从而获得授权信息。<a class="cares-color" target="_blank" :href="`https://www.carespay.com/TokenKey.html`">如何获取卖家编号、MWS授权令牌？</a></p>

                <ul class="developer">
                    <li>
                        <p>开发商名称<i class="ING">（Developer Name）</i></p>
                        <p>
                            {{form.platformCode=='BM'?'CaresPay':'CaresPAY EU'}}
                            <span class="copy CopyElement" 
                                :data-clipboard-text="form.platformCode=='BM'?'CaresPay':'CaresPAY EU'" 
                                @click="BindCopyEvent">
                                    复制
                                    <b class="yes"> <i class="el-icon-circle-check"></i> 复制成功</b>
                            </span> 
                        </p>
                    </li>
                    <li>
                        <p>开发者ID<i class="ING">（Developer ID）</i> </p>
                        <p>
                            {{form.platformCode=='BM'?'055365445997':'109093602965'}}
                            <span class="copy CopyElement" 
                                :data-clipboard-text="form.platformCode=='BM'?'055365445997':'109093602965'" 
                                @click="BindCopyEvent">复制
                                <b class="yes"> <i class="el-icon-circle-check"></i> 复制成功</b>
                            </span> 
                        </p>
                    </li>
                </ul>

                <el-form-item name="sellerId">
                    <p>卖家编号<span class="ING">（Seller ID）</span> </p>
                    <el-input type="text" :disabled="(isEdit && ReturnAuditStatus('sellerId'))"   @blur="bindIptBlur('sellerId')" name="sellerId" v-model="form.sellerId" placeholder="Seller ID"></el-input>
                </el-form-item>

                <el-form-item name="authToken">
                    <p>MWS Auth Token <span class="ING">（MWS Auth Token）</span> </p>
                    <el-input type="text" :disabled="(isEdit && ReturnAuditStatus('authToken'))"  v-model="form.authToken" @blur="bindIptBlur('authToken')" name="authToken" placeholder="MWS Auth Token"></el-input>
                </el-form-item>
            </template>

            <!-- 提现账号与币种 -->
            <div class="form-item channel"><span class="bold">提现方式</span>
            </div>

            <el-form-item label="提现币种与账号" name="channelCode">
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
                <a class="cares-color" @click="bindShowAppointment" href="javascript:;">
                    <template v-if="form.platformCode=='BM'"> 《亚马逊北美站店铺使用条款》 </template>
                    <template v-if="form.platformCode=='YD'"> 《亚马逊印度站店铺使用条款》 </template>
                    <template v-if="form.platformCode=='EU'"> 《亚马逊欧洲站店铺使用条款》 </template>
                </a>
            </div>

            <span  v-if="!isEdit" @click="__bindAddShopNext"  :class="isAgree?'cares-button-primary':'cares-button-info'">{{(['EU','YD'].indexOf(form.platformCode)>-1) ? "下一步":"绑定店铺"}}</span>
            <span v-if="isEdit && (STORE_STATUS==3)" @click="__bindAddShopNext" :class="isAgree?'cares-button-primary':'cares-button-info'">重新绑定</span>

            <!-- 条款弹框 -->
            <div class="appointment-content">
                <el-popover placement="top-end" v-model="showAppiont">
                    <h2 v-if="form.platformCode=='BM'">亚马逊北美站店铺使用条款</h2>
                    <h2 v-if="form.platformCode=='YD'">亚马逊印度站店铺使用条款</h2>
                    <h2 v-if="form.platformCode=='EU'">亚马逊欧洲站店铺使用条款</h2>
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
         <!-- 亚马逊欧洲站/印度站未完成企业信息 -->
        <template v-if="isShowEnterprice && ['EU','YD'].indexOf(form.platformCode)>-1" >
            <!-- <h4 class="cares-color">*请补充注册Amazon{{form.platformCode=='EU'?'欧洲站':'印度站'}}店铺时填写的企业信息</h4> -->
            <AnthenticationCompany
                :id="STORE_ID[form.platformCode]"
                :data="ENTERPRISE_INFO[form.platformCode]"
                INCOM="ADD_EU"
                :PLATFORM="form.platformCode"
                :ISADD="EnterpriseISADD"
            >
            </AnthenticationCompany>
        </template>
    </div>
</template>

<script>
import Clipboard from 'clipboard';
import VERIFICATION from '../../../../js/verification.js';
import { removeClass } from '../../../../js/common.js';

import {
    querySaleTypeList,                              //销售类目
    querySaleVolumeList,                            //年销量
    NationCode,                                     //nation对应的code
} from '../../utils/localbase.js';
 import {
     updateStoreDetail,                              //修改店铺
     addStoreDetail,                                 //添加店铺
     enterpriseInfo
 } from '../../../../js/api.js';

//2018-11-28  实名认证的组件
import AnthenticationCompany from './AuthenticationCompany.vue';

export default {
    data(){
        return{
            STORE_STATUS:1,
            END_STORE:{  //是否完成店铺的信息添加
                EU:false,
                YD:false,
            },      
            STORE_ID:{  //完成店铺注册之后的店铺ID
                EU:"",
                YD:"", 
            },
            ENTERPRISE_INFO:{   //完成店铺的企业信息
                EU:{},
                YD:{}, 
            },
            ENTERPRISE_STATUS:{ //企业信息的审核状态 //1. 审核中  2. 审核通过  3. 审核失败
                EU:0,
                YD:0, 
            },
            form:{
                storeType:'2',      //店铺类型
                platformCode:'BM',  //平台

                storeName:'',       //店铺名称
                sellerId:'',
                authToken:'',       
                defaultNation:[],          //国家
                // productCategories:'',          //销售类目
                // expectedSale:'',          //预计年销量
                channelCode:'',          //提现账号与币种
                id:'',                  //店铺ID

                mwsDetail:{}
            },

            EnterpriseISADD:true,       //添加还是编辑店铺企业的信息

            isAgree:false,
            showAppiont:false,
            saleType:[],
            saleCount:[],
            NationCode:NationCode,

            showSkipBox:false,  //是否展示可以略过认证authentoken的按钮
            skipAuthen:false,   //是否可以略过

            RefuseReason:[],//店铺审核失败原因

            ING:false,

            //每一项的审核状态
            AuditStatus:{
                storeName:0,
                authToken:0,
                sellerId:0,
                //国家审核状态，对应店铺信息审核状态
                expectedSale:{
                    US:0,
                    CA:0,
                    MX:0,
                    DE:0,
                    ES:0,
                    FR:0,
                    GB:0,
                    IT:0,
                    IN:0,
                },
                productCategories:{
                    US:0,
                    CA:0,
                    MX:0,
                    DE:0,
                    ES:0,
                    FR:0,
                    GB:0,
                    IT:0,
                    IN:0,
                }
            }
        }
    },
    props:["isEdit","platCode","STORESTATUS","topTab","data",'AfterJumpFn'],
    watch:{
        "form.storeType"(){
            let nodes = document.querySelectorAll('.is-error');
            for(let i=0;i<nodes.length;i++){
                 removeClass(nodes[i],'is-error');
                 nodes[i].querySelector('.el-form-item__error').remove();
            }
        },
        platCode(code){
           this.form.platformCode = code;

            this.changeNation(code);

            !this.isEdit && (this.form.channelCode = '');
             
            let nodes = document.querySelectorAll('.is-error');
            for(let i=0;i<nodes.length;i++){
                 removeClass(nodes[i],'is-error');
                 nodes[i].querySelector('.el-form-item__error').remove();
            }
       },
       topTab(index){
            let p = this.form.platformCode || this.platCode;
            this.END_STORE[p] = index==1? false: true;
       },
       STORESTATUS(status){
           this.STORE_STATUS = status;
       },
       data(n){
            this.isEdit && (this.editData(n));
       },
       "form.defaultNation"(ns){
           //2019-1-18
           ns.forEach(code=>{
               //如果不存在
               if(!(code in this.form.mwsDetail)){
                   this.$set(this.form.mwsDetail,code,{
                        productCategories:'',          //销售类目
                        expectedSale:'',          //预计年销量
                   });
               };
           });
       }
    },
    created(){
        this.form.platformCode = this.platCode || 'BM';
        this.STORE_STATUS = this.STORESTATUS;
        //初始国家的选择
        this.changeNation(this.platCode);

        Promise.all([
            querySaleTypeList(),
            querySaleVolumeList(),
        ]).then(res=>{
            let [a,b] = res;
            this.saleType = a
            this.saleCount = b
        });

        //店铺信息回显
        !this.isEdit && (this.EnterpriseISADD = true);
        this.isEdit && (this.editData(this.data));
    },
    methods:{
        __DOAJ(){
                if(this.ING) return;
                this.ING = true;
                //2019-01-18 添加多个国家
                let DATA = Object.assign({},this.form);
                DATA.mwsDetail = JSON.stringify(DATA.mwsDetail);

                // return console.log(DATA);
               //4. 判断是否是编辑还是添加
                // 4.1 编辑店铺

                this.isEdit && updateStoreDetail(DATA).then(res=>{
                     this.ING  = false;
                     if(res.code==0){
                         this.$Message.success('修改成功！');
                         let JUMP = ['EU','YD'];
                         //1. 判断是否是欧洲站的编辑
                         if(JUMP.indexOf(DATA.platformCode) > -1){
                             //2. 判断欧洲站的企业信息审核是否通过 3 或者未添加信息
                             [0,3].indexOf(this.ENTERPRISE_STATUS[DATA.platformCode]) >-1 ? 
                             this.$emit('transparams',{name:'tab',value:2}) : 
                             ( 
                                 this.AfterJumpFn()
                            );

                         }else{
                            this.$emit('transparams',{name:'fillDone',value:true}); //判断店铺是否完成添加
                            this.AfterJumpFn();
                         }

                     }else{
                         this.$Message.error(res.msg);
                     }
                 });

                //4.2 添加店铺
                !this.isEdit && addStoreDetail(DATA).then(res=>{
                    this.ING = false;
                     if(res.code==0){
                         this.$Message.success('添加成功！');
                         //2018-11-28 添加欧洲站
                         switch(DATA.platformCode){
                             case 'EU':
                             case 'YD':
                             {
                                 this.__reset(),
                                 this.STORE_ID[DATA.platformCode] = res.data,//返回添加成功之后的店铺ID
                                 this.END_STORE[DATA.platformCode] = true //补充店铺实名认证信息
                             }
                             break;
                             default :
                             { 
                                this.$emit('transparams',{name:'fillDone',value:true}); //判断店铺是否完成添加
                                  //跳转到成功添加店铺的页面
                                this.AfterJumpFn()
                             } 
                             break;
                         }
                     }else{
                         this.$Message.error(res.msg);
                     }
                 });
        },
        __bindAddShopNext(){
            //1. 必填字段
            let must = null;

            if(this.isEdit){
                //编辑
                must= this.skipAuthen ? 
                ['storeName','defaultNation','channelCode'] :
                ['storeName','defaultNation','sellerId','authToken','channelCode'];
            }else{
                //添加
                must= this.form.storeType==1 ? 
                ['storeName','defaultNation','channelCode'] :
                ['storeName','defaultNation','sellerId','authToken','channelCode'];
            };

            //2. 验证必填结果
            let flag = true;

            for(let i =0; i<must.length;i++){
                if(!this.bindIptBlur(must[i])) flag = false;
            };

            if(!flag) return;

            //2019-1-18  店铺信息销售类目/预计年销量 多个国家对应
            for (const key in this.form.mwsDetail) {
                let stn;
                this.NationCode.forEach(item=>{
                    if(item.code==key){ stn=item.nation };
                });
                if(!this.form.mwsDetail[key]['productCategories']) return this.$Message.warning(`请填写${stn}店铺信息的销售类目！`);
                if(!this.form.mwsDetail[key]['expectedSale']) return this.$Message.warning(`请填写${stn}店铺信息的预计年销量！`);
            }

            //3. 判断是否阅读条款
            if(!this.isAgree) return  this.showAppiont = true;

            //4.进行ajax请求
            this.__DOAJ();
        },
        __reset(){
            let DF =['platformCode','storeType','defaultNation','currency'];//有默认输入的不清空

            for (const key in this.form) {

                if(DF.indexOf(key)<0){
                    this.form[key] = '';
                }
            };
        },
        //失去焦点验证必填
        bindIptBlur(name){
            let value;
            value =  name=='defaultNation' ? this.form[name].length==0 ? '':'0':this.form[name];

           name=='defaultNation' && (name = 'nation');

           return VERIFICATION(name,value);
        },
        bindAppiontRes(bol){
            this.showAppiont = false;
            this.isAgree = bol;
        },
        bindShowAppointment(){
            this.showAppiont = true;
        },


        editData(data){
            let def = ["mwsDetail","defaultNation"];
            for (const key in this.form) {
                def.indexOf(key)<0 && ( this.form[key] = (data[key] || ""));
            };

            //2019-1-21 回显选中的国家与店铺信息
            data['mwsDetail'] && (this.form.mwsDetail = JSON.parse(data['mwsDetail']));

            //  data['mwsDetail'] && console.log(JSON.parse(data['mwsDetail']));
            
            for (const key in this.form.mwsDetail) {
                this.form.defaultNation.push(key);
            };

            //2019-1-22 编辑的时候对应的输入框的审核状态
            data["auditInfoVoList"] &&  data["auditInfoVoList"].forEach(item=>{
                if(/^expectedSale/.test(item.auditField)){
                    let key = item.auditField.split('expectedSale')[1];
                    this.AuditStatus["expectedSale"][key] = item.auditStatus;

                }else if(/^productCategories/.test(item.auditField)){
                    let key = item.auditField.split('productCategories')[1];
                    this.AuditStatus["productCategories"][key] = item.auditStatus;
                }else{
                   this.AuditStatus.hasOwnProperty(item.auditField) && (this.AuditStatus[item.auditField]=item.auditStatus);
                }
            });
            
            //保存对应的平台的店铺的ID
            data.storeId && (this.STORE_ID[this.form.platformCode] = data.storeId);

            //店铺审核失败原因
            data.status==3 && data.auditInfoVoList && data.auditInfoVoList.forEach(item=>{
                if(item.auditStatus==3) this.RefuseReason.push(item);
            });

            // 请求企业信息
            this.QueryEnterpriseInfo(this.data.storeId);
        },

        QueryEnterpriseInfo(storeId){
            if(!storeId) return console.log(`缺少店铺ID`);
            enterpriseInfo({storeId}).then(res=>{
                if(res.code==0){
                    console.log(`---有`);
                    this.EnterpriseISADD = false;
                    //对应的企业信息
                    this.ENTERPRISE_INFO[this.form.platformCode] = res.data;
                    //对应的企业信息的审核状态
                    this.ENTERPRISE_STATUS[this.form.platformCode] = res.data.status;

                    res.data.status == 3 && this.canIskipAuthen();

                }else{
                    console.log(`---没有`);
                    //没有企业信息
                    this.EnterpriseISADD = true;
                     //2019-3-21  欧洲站新店铺可以略过授权信息
                    this.canIskipAuthen();
                }
            });
        },

        changeNation(code){
            //2019-1-17  国家可以多选
            this.form.defaultNation=[];
            this.form.mwsDetail = {};
            if(code=='EU'){
                this.form.storeType = '2'
            };
        },

        bindNationCodeChange(code){
            if(this.form.defaultNation.indexOf(code)<0){
                delete this.form.mwsDetail[code];
            }
        },

        ReturnAuditStatus(code,nt){
            if(this.STORE_STATUS!=3) return true;   //如果不可以编辑提交 都不能编辑

            if(["productCategories","expectedSale"].indexOf(code)>-1){
                //销售类目
                return [0,3].indexOf(this.AuditStatus[code][nt]) < 0;
            }else if(code=='nation'){
                //国家
                let arr = [
                    [0,3].indexOf(this.AuditStatus['productCategories'][nt])< 0,
                    [0,3].indexOf(this.AuditStatus['expectedSale'][nt])< 0,
                ];
                return arr[0] && arr[1];
            }else{
                return [0,3].indexOf(this.AuditStatus[code]) < 0 ;
            }
           
        },

        saleUnitFn(code){
            if(['BM','YD'].indexOf(this.form.platformCode)>-1){
                let untis = '美元';
                switch(code){
                    case 'MX':
                    case 'US':{ untis = '美元' } break;
                    case 'CA':{ untis = '加元' } break;
                }
                return untis
            };

            if(['EU'].indexOf(this.form.platformCode)>-1){
                return code === 'GB' ? "英镑" : "欧元";
            };

        },
        canIskipAuthen(){
            if(this.form.platformCode == 'EU' && this.form.storeType==1 &&!this.form.authToken &&!this.form.sellerId){
                this.showSkipBox = true;
            };
        },
        //点击复制执行的函数
        BindCopyEvent(event){

            let oClassName = event.target.className;

            if(oClassName.indexOf('active')>-1) return;


            let clipboard = new Clipboard('.CopyElement')
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
    computed:{
        isShowEnterprice(){
            if(['EU','YD'].indexOf(this.form.platformCode)>-1){ 
                return this.END_STORE[this.form.platformCode];
             }else{
                return false;
            }  
        },
    },
    components:{
        AnthenticationCompany
    }
}
</script>

<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';
.form-item{
    margin-bottom: 20px;
}

.amazon-notice{
    line-height: 24px;
    padding: 10px;
    font-size: 14px;
    margin-bottom: 10px;
    background-color: rgba(251, 248, 233, 1);
}

.text{
    font-size: 14px;
    margin-bottom: 10px;
}

.developer{
    p{
        display: inline-block;
        width: 250px;
        margin-right: 10px;
        margin-bottom: 10px;
        font-size: 14px;
        padding: 5px 10px;
        background-color: #f1f1f1;
        position: relative;
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
            }

            &.active{
                .yes{
                    opacity: 1;
                     z-index: 1;
                }
            }
        }
}
</style>

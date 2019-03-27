<template>
 <!-- <transition name="fade"> -->
    <div class="shop-manage-container" :class="{hasPlat:PLATCODEARRAY.length}">
        <div v-if="PLATCODEARRAY.length" class="shop-platform">
            <div class="banner">
                <label v-for="(code,index) in PLATCODEARRAY" :key="index" 
                @click="bindPlatTab(code)" 
                v-if="PLATCODEARRAY.indexOf(code)>-1" 
                :class="{active:platformCode==code}" 
                > 
                    <span v-if="['BM','EU','YD'].indexOf(code)>-1" class="amazon-logo"></span> 
                    <span v-if="code=='EBAY'" class="ebay-logo"></span> 
                    <span v-if="code=='AE'" class="AE-logo"></span> 
                    <span v-if="code=='WISH'" class="wish-logo"></span> 
                    <template v-if="code=='BM'">北美站</template>
                    <template v-if="code=='EU'">欧洲站</template>
                    <template v-if="code=='YD'">印度站</template>
                </label>
            </div>
        </div>
        <!-- 店铺信息 -->
        <div class="fadeIn shop-information">
            <!-- 账户信息和账户明细 -->
            <div class="account-info">
                <ul class="clearfix">
                    <li v-if="['EBAY','AE','WISH'].indexOf(platformCode)>-1" class="other">
                        <p class="title">待处理金额
                            <label class="icon-container">
                                    <span class="el-icon-question cares-color"></span>
                                    <div class="explain">
                                        <h4>为什么要上传订单？</h4>
                                        <p>依国家外汇管制要求：外币结汇到国内需要真实、有效的订单，才能完成结汇。</p>
                                        <h4>上传订单规则：</h4>
                                        <p>1.请上传该{{platformCode=='AE' ? 'AliExpress':''}}{{platformCode=='WISH' ? 'Wish':''}}{{platformCode=='EBAY' ? 'eBay':''}}店铺有效订单，订单总金额大于或等于待处理金额；</p>
                                        <p>2.请上传最近3个月以内的订单数据；</p>
                                        <p>3.订单来源：{{platformCode=='EBAY' ? 'eBay':''}}店铺后台导订单数据；</p>
                                        <p>4.上传文件格式：.xlsx、.xls 、.csv。</p>
                                        <h4>友情提示：</h4>
                                        <p>1.上传订单务必为申请提现店铺有效订单；</p>
                                        <p>2.禁止上传重复订单或者已使用过的订单；</p>
                                        <p>3.若由于卖家上传订单数据无效，造成无法正常结汇，请及时联系您的客户经理。</p>
                                        <a v-if="platformCode=='WISH'" class="cares-color" target="_blank" :href="`${DOMAIN.login}/#/exportOrder`">点此查看详情</a>
                                    </div>
                            </label>
                        </p>
                        <div v-for="(item,key) in customerAmountInfo" :key="key">
                            <span class="fl">{{key}}</span>
                            <b>{{FormatUnit(key)}} {{FormatPrice(item.preInbound)}}</b>
                            <span>{{key}}</span>
                        </div>
                    </li>

                    <li v-else>
                        <p class="title">预入账金额</p>
                        <div v-for="(item,key) in customerAmountInfo" :key="key">
                            <span class="fl">{{key}}</span>
                            <b>{{FormatUnit(key)}} {{FormatPrice(item.preInbound)}}</b>
                            <span>{{key}}</span>
                        </div>
                    </li>

                    <li>
                        <p class="title">可提现金额</p>
                         <div v-for="(item,key) in customerAmountInfo" :key="key">
                             <span class="fl">{{key}}</span>
                            <b>{{FormatUnit(key)}} {{FormatPrice(item.balance)}}</b>
                            <span>{{key}}</span>
                        </div>
                    </li>
                    <li>
                        <p class="title">提款中金额</p>
                        <div v-for="(item,key) in customerAmountInfo" :key="key">
                            <span class="fl">{{key}}</span>
                            <b>{{FormatUnit(key)}} {{FormatPrice(item.frozen)}}</b>
                            <span>{{key}}</span>
                        </div>
                    </li>
                    <li>
                        <p class="title">总入账金额</p>
                        <div v-for="(item,key) in customerAmountInfo" :key="key">
                            <span class="fl">{{key}}</span>
                            <b>{{FormatUnit(key)}} {{FormatPrice(item.cashAbleAmont)}}</b>
                            <span>{{key}}</span>
                        </div>
                    </li>
                </ul>
            </div>

        </div>

    
        <ul class="fadeIn shop-tab clearfix">
            <li @click="bindChoseShop(1)" :class="{active:shopActive==1}">正常店铺({{storeDone.length}}) </li>
            <li @click="bindChoseShop(2)" :class="{active:shopActive==2}">审核中的店铺({{storeIng.length}}) </li>
            <li @click="bindChoseShop(3)" :class="{active:shopActive==3}">待完善店铺({{storeWill.length}}) </li>
        </ul>
        
        <div class="fadeIn shop-tab-content">
            <!-- 正常店铺 -->
            <CTable>
                <table :class="{'active fadeIn':shopActive==1}">
                    <thead>
                        <tr>
                            <th>店铺名称</th>
                            <th>国家</th>
                            <th>币种</th>
                            <th>
                                <template  v-if="['EBAY','AE','WISH'].indexOf(platformCode)>-1">
                                    待处理金额
                                    <label class="icon-container">
                                            <span class="el-icon-question cares-color"></span>
                                            <div class="explain">
                                                <h4>为什么要上传订单？</h4>
                                                <p>依国家外汇管制要求：外币结汇到国内需要真实、有效的订单，才能完成结汇。</p>
                                                <h4>上传订单规则：</h4>
                                                <p>1.请上传该{{platformCode=='AE' ? 'AliExpress':''}}{{platformCode=='WISH' ? 'Wish':''}}{{platformCode=='EBAY' ? 'eBay':''}}店铺有效订单，订单总金额大于或等于待处理金额；</p>
                                                <p>2.请上传最近3个月以内的订单数据；</p>
                                                <p>3.订单来源：{{platformCode=='AE' ? 'AliExpress':''}}{{platformCode=='WISH' ? 'Wish':''}}{{platformCode=='EBAY' ? 'eBay':''}}店铺后台导订单数据；</p>
                                                <p>4.上传文件格式：.xlsx、.xls 、.csv。</p>
                                                <h4>友情提示：</h4>
                                                <p>1.上传订单务必为申请提现店铺有效订单；</p>
                                                <p>2.禁止上传重复订单或者已使用过的订单；</p>
                                                <p>3.若由于卖家上传订单数据无效，造成无法正常结汇，请及时联系您的客户经理。</p>
                                                <a v-if="platformCode=='WISH'" class="cares-color" target="_blank" :href="`${DOMAIN.login}/#/exportOrder`">点此查看详情</a>
                                            </div>
                                    </label>
                                </template>

                                <template v-else>预入账金额</template>
                            
                            </th>
                            <th v-if="platformCode=='EBAY'">PayPal可转出金额</th>
                            <th v-if="['AE','WISH'].indexOf(platformCode)>-1">待处理金额状态</th>

                            <th>提现中金额</th>
                            <th>可提现金额</th>
                            <th>历史总入账金额</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!storeDone.length" class="empty">
                            <td colspan="9">暂无数据</td>
                        </tr>
                        <tr v-else v-for="(item,index) in tableData['Done']" :key="index">
                        <td>{{item.storeName}}</td>
                        <td>
                            <span v-for="(code,index) in item.national.split('/')" :key="index">{{nationName(code)}}<i v-if="index != item.national.split('/').length-1">/</i> </span>
                        </td>
                        <td>{{item.currency}}</td>

                            <td>{{FormatPrice(item.preInbound)}}</td>

                        <td v-if="platformCode=='EBAY'">
                            {{FormatPrice(item.ebaySettleAmount/100)}}
                            <span  @click="bindRefreshPaypal(item.storeId,1)"  class="el-icon-refresh refresh-icon"></span>
                        </td>
                            <td v-if="['AE','WISH'].indexOf(platformCode)>-1">
                                <label class="status-text">
                                    <span class="cares-color" v-if="item.orderImportStatus==0"> <i class="point ING"></i> 未上传店铺订单</span>
                                    <span class="ING" v-if="item.orderImportStatus==1"><i class="point ING"></i> 店铺订单导入中</span>
                                    <span class="yes" v-if="item.orderImportStatus==2"><i class="point yes"></i>店铺订单导入成功</span>
                                    <span class="no" v-if="[3,4,5].indexOf(item.orderImportStatus)>-1"><i class="point no"></i>上传订单异常</span>


                                    <div class="status-tit" v-if="[1,2].indexOf(item.orderImportStatus)<0">
                                        <template v-if="item.orderImportStatus==0">
                                            <p>应国家外汇管制要求，请<a href="javascript:;"  class="toDue"  @click="bindToUploadOrder(item.storeId)">点此上传</a>该店铺的有效订单数据。如需帮助请联系您的客户经理。</p>
                                        </template>

                                        <template v-if="item.orderImportStatus==3">
                                            <p>上传账单总金额小于结汇金额。</p>
                                            <p>请<a href="javascript:;"  class="toDue"  @click="bindToUploadOrder(item.storeId)">点此重新上传</a>有效的订单数据。如需帮助请联系您的客户经理。</p>
                                        </template>

                                        <template v-if="item.orderImportStatus==4">
                                            <p>订单文件包含超过“待处理金额”到账日期的前3个月的订单数据；</p>
                                            <p>请<a href="javascript:;"  class="toDue"  @click="bindToUploadOrder(item.storeId)">点此重新上传</a>有效的订单数据。如需帮助请联系您的客户经理。</p>
                                        </template>

                                        <template v-if="item.orderImportStatus==5">
                                            <p>订单文件中包含历史上传的订单数据；</p>
                                            <p>请<a href="javascript:;"  class="toDue"  @click="bindToUploadOrder(item.storeId)">点此重新上传</a>有效的订单数据。如需帮助请联系您的客户经理。</p>
                                        </template>
                                    </div>
                                </label>
                            </td>

                        <td>{{FormatPrice(item.frozen)}}</td>
                        <td>{{FormatPrice(item.balance)}}</td>
                        <td>{{FormatPrice(item.cashAbleAmont)}}</td>
                        <td td class="handle">
                                <router-link class="shopdetail el-icon-more" :to="`/shopdetail/${item.id}`"></router-link>
                                <span v-if="['AE','WISH'].indexOf(platformCode)>0 && [0,3,4,5].indexOf(item.orderImportStatus)>-1" class="upload-button" @click="bindToUploadOrder(item.storeId)">{{item.orderImportStatus==0?'上传订单':'重新上传订单'}}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
             </CTable>
            <!-- 审核中的店铺 -->
            <CTable>
                <table :class="{'active fadeIn':shopActive==2}">
                    <thead>
                        <tr>
                            <th class="per20">店铺名称</th>
                            <th>国家</th>
                            <th>币种</th>
                            <th v-if="platformCode=='EBAY'">PayPal可转出金额（仅供参考）</th>
                            <th>审核状态</th>
                            <th class="per20">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!storeIng.length" class="empty">
                            <td :colspan="platformCode=='EBAY'?6:5">暂无数据</td>
                        </tr>
                        <tr v-else v-for="(item,index) in tableData['Ing']" :key="index">
                            <td>{{item.storeName}}</td>
                            <td><span v-for="(code,index) in item.national.split('/')" :key="index">{{nationName(code)}}<i v-if="index != item.national.split('/').length-1">/</i> </span></td>
                            <td>{{item.currency}}</td>

                                <td v-if="platformCode=='EBAY'">
                                    {{FormatPrice(item.ebaySettleAmount/100)}}
                                    <span v-if="item.status==2" @click="bindRefreshPaypal(item.storeId,2)" class="el-icon-refresh refresh-icon"></span>
                                    <span v-else style="opacity:0;" class="el-icon-refresh refresh-icon"></span>
                                </td>

                            <td v-html="item.context"></td>
                            <td class="handle">
                                <router-link class="shopdetail el-icon-more" :to="`/shopdetail/${item.id}`"></router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CTable>
            <!-- 待完善的店铺 -->
            <CTable>
                <table :class="{'active fadeIn':shopActive==3}">
                    <thead>
                        <tr>
                            <th class="per20">店铺名称</th>
                            <th>国家</th>
                            <th>币种</th>
                            <th>审核状态</th>
                            <th class="per20">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!storeWill.length" class="empty">
                            <td colspan="5">暂无数据</td>
                        </tr>
                        <tr v-else v-for="(item,index) in tableData['Will']" :key="index">
                            <td>{{item.storeName}}</td>
                            <td><span v-for="(code,index) in item.national.split('/')" :key="index">{{nationName(code)}}<i v-if="index != item.national.split('/').length-1">/</i> </span></td>
                            <td>{{item.currency}}</td>
                            <td v-html="item.context"></td>
                        <td class="handle">
                                <router-link class="shopdetail el-icon-more" :to="`/shopdetail/${item.id}`"></router-link>
                                <router-link class="bindshop" :to="`/addshop?type=2&id=${item.id}`">
                                    <template v-if="['BM','EU','YD'].indexOf(platformCode)>-1">
                                        店铺绑定
                                    </template>
                                    <template v-if="['WISH','AE','EBAY'].indexOf(platformCode)>-1">
                                        编辑店铺
                                    </template>
                                </router-link>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </CTable>

                <!--分页 -->
          <div class="store-page-container">
                <Pagination
                :page='PageData.page'
                :pageSize='PageData.pageSize'
                :count='PageData.count'
                :countSize='PageData.countSize'
                :chosefallback='bindChosePage'
                ></Pagination>
          </div>

        </div>

        <div class="caras-reminder">
            <el-popover placement="top-start" v-model="uploadModel">
                <div class="popover-content fadeIn">
                    <span v-if="platformCode=='AE'" class="AE-logo"></span>
                    <span v-if="platformCode=='WISH'" class="wish-logo"></span>
                    <h4>上传订单规则：</h4>
                    <p>1.请上传该{{platformCode=='AE' ? 'AliExpress':''}}{{platformCode=='WISH' ? 'Wish':''}}店铺有效订单，订单总金额大于或等于待处理金额；</p>
                    <p>2.请上传最近3个月以内的订单数据；</p>
                    <p>3.订单来源：{{platformCode=='AE'?'AliExpress':''}}{{platformCode=='WISH' ? 'Wish':''}}店铺后台导订单数据；</p>
                    <div class="u-container">
                        <el-upload
                            drag
                            id="order_upload"
                            :action="fileActive"
                            name='upFile'
                            :beforeUpload="beforeAvatarUpload"
                            :on-success="function(res,file){ return bindUploadFileSucess(res,file,'order_upload') }"
                            :on-remove="function(file, fileList){ return bindUploadFileExceed(file, fileList,'order_upload')} "
                            :on-error="bindUploadError"
                            multiple>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em class="cares-color">点击上传</em></div>
                        </el-upload>
                    </div>
                    <p><a :href="`${DOMAIN.login}/#/exportOrder`" target="_blank" class="cares-color">查看详情</a></p>
                    <p style="margin-top:20px;text-align:right;">
                        <a class="btn cares-button-danger pain" href="javascript:;" @click="bindToUploadOrder()">取消</a>
                        <a class="btn cares-button-primary" @click="bindUploadWishOrder" href="javascript:;">上传</a>
                    </p>
                </div>
            </el-popover>
       </div>

      
    </div>
 <!-- </transition> -->
</template>


<script>

    import {
        uploadefile,
         customerAmountInfo,        //获取商家的四个金额
         storeInfo,                  //获取店铺列表
         updateStoreCard,           //修改店铺的提现账户
         querySettleAmount,           
         importWishOrder       
        } from './../../../../js/api.js';


    import { queryCustomerInfo,NationCode } from '../../utils/localbase.js'

    import { Pricemoney } from '../../../../js/common.js'

    import DOMAIN from '../../../../js/domain.js';

    import Swiper from '../../../../components/swiper.vue';
    import CTable from '../../../../components/CTable.vue';

    import $ from 'jquery';

    export default {
        data(){
            return{
                fileActive:uploadefile,
                shopActive:1,
                storeDone:[],               //正常的店铺
                storeIng:[],                //审核中的店铺
                storeWill:[],               //待完善

                customerAmountInfo:{        //店铺商家的四个金额
                    USD:{
                        balance:'--',             //可提现
                        cashAbleAmont:'--',       //总与入账
                        frozen:'--',              //提现中
                        preInbound:'--'           //预备入账金额
                    }
                },

                PageData:{
                    page:'1',
                    pageSize:'4',
                    count:'0',
                    countSize:'0',
                },
                tableData:{
                    Done:[],               //正常的店铺
                    Ing:[],                //审核中的店铺
                    Will:[],               //待完善
                },
                
                platformCode:null,            //平台类型值，默认应该为空，否则会影响相面的watch监听以及create的时候请求的时候赋值判断等
                PLATCODEARRAY:[],           //当前用户绑定的所有编码的类型
                //2018-12-6  流程优化
                AJAXING:false,
                uploadModel:false,
                uploadForm:{
                    fileId:'',
                    storeId:'',
                },
                DOMAIN:DOMAIN

            }
        },
        created() {
            //2018-11-8 页面初始化的默认选择
            this.LOADINGQUERY();
        },
        methods:{
            RESET(){
                this.storeDone = [];              //正常的店铺
                this.storeIng = [];              //审核中的店铺
                this.storeWill = [];               //待完;
                this.customerAmountInfo = {        //店铺商家的四个金额
                   USD:{
                        balance:'--',             //可提现
                        cashAbleAmont:'--',       //总与入账
                        frozen:'--',              //提现中
                        preInbound:'--'           //预备入账金额
                   }
                };

                this.tableData.Done=[]
                this.tableData.Ing=[]
                this.tableData.Will=[]
            },
            //店铺信息请求
            LOADINGQUERY(params){
                 this.RESET();

                if(this.AJAXING) return;
                this.AJAXING = true;
                
                storeInfo(params).then(res=>{
                    this.AJAXING = false;
                    if(res.code==0 ){
                        res.data && this.TosortStoreAndAmount(res,params);
                    }else{
                        this.$Message.error(res.msg);
                    } 
                });
            },
            // 四个金额的请求
            QUERYAMOUNT(){
                 if(this.AJAXING) return;
                this.AJAXING = true;
                 //2. 请求四个金额
                customerAmountInfo({platformCode:this.platformCode}).then(cres=>{
                     this.AJAXING = false;
                    if(cres.code==0){
                        this.customerAmountInfo = cres.data; 
                    }else{
                        this.$Message.error(cres.msg);
                    }
                });
            },
            //处理店铺信息和四个金额
            TosortStoreAndAmount(res,params){
                //1.区分是刚进入的还是确认平台的
                if(params){
                    this.dueShop(res.data);
                }else{
                    let STORE_DF = [];
                    res.data.forEach((item,index)=>{
                        //1. 选择默认的平台
                        index == 0 && (this.platformCode = item.platformCode);
                        //2. 展示默认的店铺数据
                        item.platformCode==this.platformCode && STORE_DF.push(item);
                        //3. 所有平台
                        this.PLATCODEARRAY.indexOf(item.platformCode)<0 && this.PLATCODEARRAY.push(item.platformCode);
                    });

                    this.dueShop(STORE_DF);
                };
                //2. 请求四个金额
                this.QUERYAMOUNT();
                
            },
            //店铺分类
            dueShop(list){
                
                list && list.forEach((item,index)=>{
                    
                    switch(item.type){
                        case 1:{ this.storeDone.push(item) }break;
                        case 2:{ this.storeIng.push(item) } break;
                        case 3:{ this.storeWill.push(item) } break;
                    }
                });

                //3. 默认选择正常店铺
                this.bindChoseShop(1);
            },
            bindPlatTab(code){
                if(this.AJAXING) return;
                this.platformCode = code;
            },
            //显示哪个表格
            bindChoseShop(i){
                this.shopActive = i;

                let D = [],
                    K='Done';
                i == 1 && (K='Done',D = this.storeDone);
                i == 2 && (K='Ing',D = this.storeIng);
                i == 3 && (K='Will',D = this.storeWill);

                this.PageData.countSize = D.length;     //总记录
                this.PageData.count = Math.ceil((D.length / this.PageData.pageSize)); //总页码
                this.PageData.page = 1; //当前页

                //分割数据
                this.tableData[K] =  this.spiceTableData(D,this.PageData.page);
            },
            FormatPrice(num=0){
                return Pricemoney(String(num));
            },
            FormatUnit(unit='USD'){
                let str = null;
                switch(unit){
                    case "USD":{ str="$" }break;
                    case "GBP":{ str="￡" }break;
                    case "EUR":{ str="€" }break;
                };
                return str
            },
            bindRefreshPaypal(storeId,type){
                querySettleAmount({storeId}).then(res=>{
                    if(res.code==0){

                        switch(type){
                            case 1:{
                                this.storeDone.forEach(item=>{
                                    if(item.storeId== storeId) item.ebaySettleAmount = res.data;
                                });
                            }
                            break;
                            case 2:{
                                this.storeIng.forEach(item=>{
                                    if(item.storeId== storeId) item.ebaySettleAmount = res.data;
                                });
                            }
                            break;
                        }

                    }else{
                        this.$Message.error(res.code)
                    }
                });

        
            },
            bindToUploadOrder(id){
                
                this.uploadForm.storeId = id ? id :'';

                this.uploadModel = !this.uploadModel;
            },
            bindUploadWishOrder(){
                if(!this.uploadForm.fileId) return this.$Message.warning(`请上传订单数据！`);
                if(!this.uploadForm.storeId) return this.$Message.warning(`请选择店铺！`);
                importWishOrder(this.uploadForm).then(res=>{
                    if(res.code==0){
                        this.$Message.success(`上传成功！`);
                        this.uploadModel = !this.uploadModel;

                        this.LOADINGQUERY({platformCode:this.platformCode}); 
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
            },
            bindUploadError(){
                 this.$Message.error(`上传失败，请重新上传！`);
            },
             bindUploadFileExceed(file,fileList){
                this.uploadForm.fileId = "";
            },
            bindUploadFileSucess(res,file,name){
                //清掉当前上传的
                if(res.code==0){
                   $(`#${name}`).find('.el-upload-list li').length>1 && $(`#${name}`).find('.el-upload-list li').eq(0).hide(100,function(){ $(this).remove() });
                    this.uploadForm.fileId = res.data.uuid;
                }else{
                    this.$Message.error(res.msg);
                }
            },
            //上传Wish账单
            beforeAvatarUpload(file){
                let fileType = file.name.substring(file.name.lastIndexOf('.')+1).toUpperCase();
                if(fileType=='XLS'||fileType=='XLSX'||fileType=='CSV'){
                    return true;
                }else{
                    this.$Message.error(`只能上传xls、xlsx、csv格式的文件!`);
                    return false;
                }
            },
            nationName(code){
                let n;
                NationCode.forEach(item=>{
                    if(item.code == code){ n = item.nation };
                });
                return n;
            },

            bindChosePage(index,pageSize){

                let D = [],
                    K='Done';

                this.shopActive == 1 && (K='Done',D = this.storeDone);
                this.shopActive == 2 && (K='Ing',D = this.storeIng);
                this.shopActive == 3 && (K='Will',D = this.storeWill);

                this.PageData.pageSize = pageSize;//每页几条
                this.PageData.page = index;//当前第几页
                this.PageData.count = Math.ceil((D.length / this.PageData.pageSize)); //总页码

                this.tableData[K] =  this.spiceTableData(D,this.PageData.page);

            },

            spiceTableData(Data,index){
                //Data 源数据  index 当前第几页
                let PageSize = this.PageData.pageSize;  //每页几条

                return Data.slice(PageSize*(index-1),PageSize*index);
            },
        },
        watch:{
            platformCode(n,o){
                if(!o) return;//2018-11-8 默认选择平台，第一次赋值的时候不需要请求

                this.LOADINGQUERY({platformCode:n}); 
                
            }
        },
        components:{
            Swiper,
            CTable,
        },
      
    }
</script>

<style lang="scss" scoped>

@import './../../../../css/common/theme.scss';

    @function percent($s,$t){
        @return ($s/$t)*100%;
    }

    $primary:$--color-primary-two;
    $primary_hover:$--color-primary-two-hover;


    .shop-manage-container{
       &.hasPlat{
            padding-top: 70px;
       }
        // padding-top: 0px;
        .shop-platform{
            position: absolute;
            left: 0;
            top: 140px;
            width: 100%;
            height: 70px;
            margin-top: 0px;
            line-height: 70px;
            border-top: 1px solid #F8F8F8;
            overflow: hidden;
            label{
                display: inline-block;
                height: 30px;
                line-height: 30px;
                padding: 0 10px;
                color: #aaa;
                font-size: 14px;
                border:1px solid #fff;
                border-radius: 15px;
                vertical-align: middle;
                cursor: pointer;
                margin-right: 10px;
                // border-color:#e5e5e5;
                // background-color: #fafafa;
                transition: all .2s;
                &.active{
                    background-color: #fff;
                    color: #333;
                    border-color: $--color-primary-two;
                    box-shadow: 0 0px 2px 0px $--color-primary-two-hover;
                    &:hover{
                        box-shadow: 0 0px 2px 0px $--color-primary-two-hover;
                    }
                }
                &:hover{
                    color: #333;
                    // border-color: $primary;
                    box-shadow: 0 0px 5px 0px rgba(0,0,0,.3);
                }
                
            }
            input{
                display: none;
            }
        }
    }

    .notice{
        height: 48px;
        // background-color: white;
        line-height: 48px;
        padding-left: 38px;
        font-size: 14px;
        // color: $--color-primary-one;
        color: #666;
        margin-bottom: 10px;
    }

    // 店铺信息
    .shop-information{
        // overflow: hidden;
        position: relative;
        margin-bottom: 10px;
        padding: 0;
    }
    .account-info{
        h2{
            line-height: 34px;
            height: 34px;
            font-size: 16px;
            color: #666;
            font-weight: normal;
            a{
                font-size: 12px;
                // color: blue;
            }
        }
        ul{
            padding: 20px 0;
            box-sizing: border-box;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            .other{
                background-color: #F9F9F9;
            }
            li{
                // float: left;
                // width: percent(25,100 );
                width: 250px;
                min-height: 60px;
                padding: 10px;
                // height: 142px;
                text-align: left;
                position: relative;
                background-color: #F2F8FC;
                .title{
                    line-height: 36px;
                    color: #000;
                }
                >div{
                    text-align: right;
                    background: transparent;
                    b{
                        display: inline-block;
                        height: 28px;
                        vertical-align: middle;
                        color: $--color-primary-one;
                        font-size: 20px;
                        max-width: 60%;
                        overflow: hidden;   
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    span{
                        display: inline-block;
                        vertical-align: middle;
                        height: 28px;
                        font-size: 14px;
                        color: #333;
                        line-height: 28px;
                    }
                }

                >p{
                    // position: absolute;
                    // bottom: -28px;
                    // color: #666;
                    // width: 100%;
                    // line-height: 28px;  
                    // background: transparent;
                    .el-icon-question{
                        cursor: help;
                    }
                }
            }
        }
        .shop-apply{
            height: 70px;
            line-height: 70px;
            color: #666;
            font-size: 16px;
        }
    }

    //店铺状态
    .shop-tab{
        // margin-bottom: 6px;
        background-color: #fff;
        padding: 10px 38px;
        li{
            float: left;
            line-height: 32px;
            height: 32px;
            padding: 0 16px;
            background-color: #fafafa;
           
            // margin-right: 6px;
            font-size: 14px;
            color: #aaa;
            cursor: pointer;
            margin-right: 20px;
            border: 1px solid #e5e5e5;
            border-radius: 16px;
             transition: all .2s;
            &:hover{
                color:  $--color-primary-two;
                border-color: $--color-primary-two;
                background-color: #F2F8FC;
                // box-shadow: 0 3px 5px 0px rgba(0,0,0,.1);
                //  span{
                //     border-color:#333;
                //     border-color: $--color-primary-two;
                // }
            }
            &.active{
                color:  $--color-primary-two;
                border-color: $--color-primary-two;
                background-color: #fff;

                // &:hover{
                    //  box-shadow: 0 3px 3px 0px $--color-primary-two-hover;
                // }
                // span{
                //     border-color: $--color-primary-two;
                //      color:  $--color-primary-two;
                // }
            }
            span{
            //     display:inline-block;
            //     width:14px;
            //     height:14px;
            //     border:1px solid #aaa;
            //     border-radius:50%;
            //     text-align:center;
            //     line-height:14px;
                font-size:12px;
            }
        }

    }
    .shop-tab-content{
        // overflow: hidden;
        padding: 20px 38px;
        table{
            width: 100%;
            display: none;
            .empty{
                td{
                    text-align: center;
                }
            }
            &.active{
                display: table;
            }
             .refresh-icon{
                    cursor: pointer;
                    font-size: 16px;
                    color: $primary;
                    vertical-align: middle;
                }
            tbody{
                text-align: center;
                color: #666;
                font-size: 12px;
                .accountLink{
                    color: $--color-primary-one;
                }
                .handle{
                    .bindshop,
                    .shopdetail,
                    .upload-button{
                        display: inline-block;
                        height: 30px;
                        line-height: 30px;
                        padding: 0 15px;
                        border: 1px solid #e5e5e5;
                        background-color: #fafafa;
                        vertical-align: middle;
                        border-radius: 15px;
                        color: #aaa;
                        cursor: pointer;
                        transition: all .2s;
                        text-align: center;
                        &:hover{
                            background-color: #F2F8FC; 
                            color: $--color-primary-two;
                            border-color: $--color-primary-two;
                        }
                    }
                    .shopdetail{
                        width: 30px;
                        padding: 0;
                        text-align: center;
                        line-height: 30px;
                    }
                }
                .status-text{
                    position: relative;
                    padding-top: 13px;
                    &:hover{
                        .status-tit{
                            display: block;
                        }
                    }
                    >span{
                        color: $primary;
                    }
                    .status-tit{
                        position: absolute;
                        width: 300px;
                        background-color: rgba(0,0,0,0.6);
                        color: #fff;
                        padding: 10px;
                        left: 50%;
                        bottom: 20px;
                        margin-left: -50px;
                        text-align: left;
                        // text-indent: 2em;
                        border-radius: 6px;
                        display: none;
                        &::after{
                            content: "";
                            width: 0px;
                            height: 0px;
                            position: absolute;
                            border: 6px solid rgba(0,0,0,0.6);
                            border-bottom-color: transparent;
                            border-left-color: transparent;
                            border-right-color: transparent;
                            top: 100%;
                            left: 10%;
                        }
                    }
                }
            }
        }
    }

    .caras-reminder{
        .el-popper{
            .popover-content{
                width:490px;
                height: auto;
                padding: 10px 20px;
                text-align: left;
                h4{
                    font-size: 16px;
                    margin: 10px 0;
                }
                p{
                    font-size: 12px;
                    color: #333;
                    margin-bottom: 10px;
                }
                .u-container{
                    text-align: center;
                    margin: 15px 0;
                }
                .btn{
                    width: 100px;
                    text-align: center;
                    margin-left: 10px;
                    height: 32px;
                    line-height: 32px;
                }
            }

        }
    }
    .store-page-container{
        // display: none;
        margin-top: 20px;
         .pagination{
            padding-bottom: 0;
        }
    }
   
    .icon-container{
            position: relative;
            &:hover{
                    .explain{
                        display: block;
                    }
                }
            }
            .explain{
                position: absolute;
                width: 430px;
                text-align: left;
                box-shadow: 5px 5px 30px rgba(0,0,0,0.1);
                z-index: 2;
                left: 16px;
                bottom: -150px;
                // margin-top: -200px;
                padding: 10px;
                display: none;
                border-radius: 8px;
                line-height: 28px;
                h4{
                    color: #333;
                    font-size: 14px;
                    
                }
                p{
                    font-size: 12px;
                    color: #333;
                }
                a{
                    margin-top: 10px;
                    font-size: 12px;
                }
            }


</style>

<style lang="scss" >
@import './../../../../css/common/theme.scss';
    .toDue{
        color: #ea5413;
        border-bottom: 1px solid #ea5413;
        &:hover{
            color: red;
            border-color: red;
        }
    }

</style>


<template>
    <div class="fadeIn">
        <div class="table-container ">
            <div class="block">
                <h5>申请详情</h5>
                <ul class="item-container">
                    <li><span>客户ID：</span>{{PAGEDATA.customerNo}}</li>
                    <li><span>申报国家：</span>{{PAGEDATA.countryCode}}</li>
                    <li><span>申报月份：</span>{{PAGEDATA.months ? PAGEDATA.months.join('、') : 'N/A'}}</li>
                    <li><span>申报截止日：</span>{{formatTimer(PAGEDATA.deadlineTime)}}</li>
                    <li><span>状态：</span>{{fineValName(PAGEDATA.status,STATUS,'name','status')}}</li>
                </ul>
            </div>

            <div class="block">
                <h5>服务信息</h5>
                <ul class="item-container">
                    <li><span>服务类型：</span>{{PAGEDATA.type==1 ? '注册+首年申报' : '单次注册'}}</li>
                    <li><span>已报税次数：</span>{{PAGEDATA.useDeclaraCount}}</li>
                    <li><span>剩余报税次数：</span>{{PAGEDATA.declaraCount- PAGEDATA.useDeclaraCount}}</li>
                </ul>
            </div>

             <div class="block"  
                v-if="
                (['DE','GB','PL','CZ'].includes(PAGEDATA.countryCode) && [13,12,4].includes(PAGEDATA.status) ) ||
                (['ES','FR','IT'].includes(PAGEDATA.countryCode) && [4,14,9,15,12].includes(PAGEDATA.status))
                ">
                <h5>{{fineValName(PAGEDATA.status,STATUS,'name','status')}}原因</h5>
                <ul class="failReason">
                    <li> <i class="point no"></i> {{PAGEDATA.failReason}}</li>
                </ul>
            </div>

            <div class="block">
                <h5>税号信息</h5>
                <ul class="item-container">
                    <li v-if="['GB','FR','CZ','PL'].includes(PAGEDATA.countryCode)">
                        <span>增值税/商品和服务税登记号：</span>{{PAGEDATA.taxNo}}
                    </li>

                    <template v-if="['DE'].includes(PAGEDATA.countryCode)">
                        <li><span>Steuernummer（税务识别号）：</span>{{PAGEDATA.dutySteuernummer || 'N/A'}}</li>
                        <li><span>增值税/商品和服务税登记号：</span>{{PAGEDATA.taxNo|| 'N/A'}}</li>
                        <li><span>税务副本：</span>
                            <a class="primary" 
                                v-if="PAGEDATA.dutyTaxCopy" 
                                target="_blank" 
                                :href="`${download}?fileId=${PAGEDATA.dutyTaxCopy}`">
                                <span class="fa fa-cloud-download"></span> 下载税务副本
                            </a>
                        </li>
                    </template>

                     <template v-if="['IT'].includes(PAGEDATA.countryCode)">
                        <li><span>本地增值税号：</span>{{PAGEDATA.dutyLocalNumber || 'N/A'}}</li>
                        <li><span>欧盟内部增值税税号：</span>{{PAGEDATA.dutyEuNumber || 'N/A'}}</li>
                    </template>

                    <template v-if="['ES'].includes(PAGEDATA.countryCode)">
                        <li><span>本地增值税号：</span>{{PAGEDATA.dutyLocalNumber || 'N/A'}}</li>
                        <li><span>欧盟内部增值税税号：</span>{{PAGEDATA.dutyEuNumber || 'N/A'}}</li>
                        <li>
                            <span>税务副本：</span>
                            <a class="primary" 
                                v-if="PAGEDATA.dutyTaxCopy" 
                                target="_blank" 
                                :href="`${download}?fileId=${PAGEDATA.dutyTaxCopy}`">
                                <span class="fa fa-cloud-download"></span> 下载税务副本
                            </a>
                        </li>
                    </template>

                    <li><span>EORI Number：</span>{{PAGEDATA.dutyEoriNumber}}</li>
                    <li><span>税号生效日期：</span>{{formatTimer(PAGEDATA.dutyEffectTime)}}</li>
                </ul>
            </div>

            <div class="block">
                <h5>税号公司信息</h5>
                <ul class="item-container">
                    <li><span>公司名称：</span>{{PAGEDATA.companyName||'N/A'}}</li>
                    <li><span>法人姓名：</span>{{PAGEDATA.dutyLegalPerson|| 'N/A'}}</li>
                    <li><span>申请人电话：</span>{{PAGEDATA.phone || 'N/A'}}</li>
                    <li><span>店铺预计年销售额：</span>{{PAGEDATA.dutyPreTurnover|| 'N/A'}}</li>
                    <li><span>店铺名称：</span>{{PAGEDATA.dutyStoreName||'N/A'}}</li>
                    <li><span>店铺地址：</span>{{PAGEDATA.dutyStoreAddress||'N/A'}}</li>
                </ul>

                <table>
                    <thead>
                        <tr>
                            <th class="per30"
                                v-if="
                                    ['DE','GB','PL','CZ'].includes(PAGEDATA.countryCode) && [0,1,2,5,6,8,10,4,13].includes(PAGEDATA.status) ||
                                    ['FR','IT','ES'].includes(PAGEDATA.countryCode) && [0,1,2,4,7,16,10,14].includes(PAGEDATA.status) 
                                "
                            >操作</th>
                            <!-- 税金确认函 -->
                            <th v-if="![0,1,2].includes(PAGEDATA.status)">税金确认函</th>
                            <!-- 支付信息 -->
                            <th
                                v-if="
                                    ['DE','GB','PL','CZ'].includes(PAGEDATA.countryCode) && [7,8,9,10,11,12].includes(PAGEDATA.status)
                                 || ['FR','IT','ES'].includes(PAGEDATA.countryCode) && ![0,1,2].includes(PAGEDATA.status) "
                                >
                                支付信息
                            </th>
                            <th>客户销售数据</th>
                            <th v-if="PAGEDATA.status==1">销售数据上传时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <!-- 操作 -->
                            <td
                            v-if="
                                ['DE','GB','PL','CZ'].includes(PAGEDATA.countryCode) && [0,1,2,5,6,8,10,4,13].includes(PAGEDATA.status) ||
                                ['FR','IT','ES'].includes(PAGEDATA.countryCode) && [0,1,2,4,7,16,10,14].includes(PAGEDATA.status) 
                            "
                            >
                                <el-button type="primary" v-if="PAGEDATA.status==1" @click='changeApplyStatus("请确认已将销售数据提交至服务商！",3)'>已提交销售数据至服务商</el-button>

                                <el-button type="primary" v-if="PAGEDATA.status==4" @click='changeApplyStatus("请确认申报金额异议已与商户或服务商处理中！",13)'>申报金额异议处理中</el-button>

                                

                                <template v-if="['DE','GB','PL','CZ'].includes(PAGEDATA.countryCode)">
                                    <!-- 金额有异议处理中 -->
                                    <template v-if="[13].includes(PAGEDATA.status) ">
                                        <ElButton type="primary" @click='changeApplyStatus("请确认申报金额异议已与商户或服务商协商成功！",6)'>申报金额已确认</ElButton>
                                        <ElButton type="primary" @click="changeModel(true,'unNormalModel')" plain>申报异常</ElButton>
                                    </template>

                                    <el-button type="primary" v-if="PAGEDATA.status==5" @click='changeApplyStatus("请确认已通知服务商确认税金",6)'>已通知服务商确认税金</el-button>

                                    <el-button type="primary" v-if="PAGEDATA.status==8" @click='changeApplyStatus("请确认已通知服务商审核支付回执！",10)'>已通知服务商审核支付回执</el-button>

                                     <el-upload
                                        v-if="[2,6].includes(PAGEDATA.status)" 
                                        :show-file-list='false'
                                        name='upFile'   
                                        :action="actionsUpload"
                                        :on-success="bindUploadSuccess"
                                        :on-error="bindUploadError"
                                        style="display:inline-block;"
                                        >
                                            <el-button type="success">
                                                <template v-if="PAGEDATA.status==2">上传税金确认函</template>
                                                <template v-if="PAGEDATA.status==6">上传支付信息</template>
                                            </el-button>
                                    </el-upload>

                                     <!-- 审核支付回执 -->
                                    <template v-if="[10].includes(PAGEDATA.status) ">
                                        <ElButton type="primary" @click='changeApplyStatus("请确认支付回执审核通过",11)'>审核通过</ElButton>
                                        <ElButton type="primary" @click="changeModel(true,'unNormalModel')" plain>审核异常</ElButton>
                                    </template>
                                </template>

                                <!-- 法国，意大利，西班牙 -->
                                <template v-if="['FR','IT','ES'].includes(PAGEDATA.countryCode)">
                                    <!-- 上传税金确认函与支付信息 -->
                                    <el-button type="success" v-if="PAGEDATA.status==2" @click="changeModel(true,'payInfoModel')">上传税金确认函&&支付信息文件</el-button>

                                     <!-- 提交支付回执 -->
                                    <ElButton v-if="PAGEDATA.status==7" type="primary" @click='changeApplyStatus("请确认已通知服务商审核支付回执！",160)'>已通知服务商审核支付回执</ElButton>

                                     <!-- 审核支付回执 -->
                                    <template v-if="[16].includes(PAGEDATA.status) ">
                                        <ElButton type="primary" @click='changeApplyStatus("请确认支付信息审核通过 && 已通知服务商进行申报处理！",100)'>支付信息审核通过</ElButton>
                                        <ElButton type="primary" plain @click="changeModel(true,'unNormalModel')">支付信息审核失败</ElButton>
                                    </template>
                                     <!-- 审核成功、审核失败 -->
                                    <template v-if="[10].includes(PAGEDATA.status) ">
                                        <ElButton type="primary" @click='changeApplyStatus("请确认已申报成功",11)'>审核通过</ElButton>
                                        <ElButton type="primary" @click="changeModel(true,'unNormalModel')" plain>审核异常</ElButton>
                                    </template>
                                    <!-- 金额有异议处理中 -->
                                    <template v-if="[14].includes(PAGEDATA.status) ">
                                        <ElButton type="primary" >申报金额已确认</ElButton>
                                        <ElButton type="primary" plain>申报异常</ElButton>
                                    </template>
                                </template>
                               
                            </td>
                            <!-- 税金确认函 -->
                            <td v-if="![0,1,2].includes(PAGEDATA.status)">
                                <a class="primary" 
                                    v-if="PAGEDATA.taxConfirm" 
                                    target="_blank" 
                                    :href="`${download}?fileId=${PAGEDATA.taxConfirm}`">
                                    <span class="fa fa-cloud-download"></span> 下载税金确认函
                                </a>
                                <el-upload
                                    v-if="PAGEDATA.taxConfirm"
                                    :show-file-list="false"
                                    name='upFile'   
                                    :action="actionsUpload"
                                    :on-success="(res, file)=>{ return bindUploadSuccess(res,file,'taxConfirm',true) }"
                                    :on-error="bindUploadError"
                                    style="display:inline-block;"
                                    >
                                    <ElButton type="success" >重新上传</ElButton>
                                </el-upload>
                                
                            </td>
                            <!-- 支付信息 -->
                            <td
                                v-if="
                                    ['DE','GB','PL','CZ'].includes(PAGEDATA.countryCode) && [7,8,9,10,11,12].includes(PAGEDATA.status)
                                 || ['FR','IT','ES'].includes(PAGEDATA.countryCode) && ![0,1,2].includes(PAGEDATA.status) "
                            >
                                <a class="primary" 
                                    v-if="PAGEDATA.payInfo" 
                                    target="_blank" 
                                    :href="`${download}?fileId=${PAGEDATA.payInfo}`">
                                    <span class="fa fa-cloud-download"></span> 下载支付信息
                                </a>
                                 <el-upload
                                    v-if="PAGEDATA.payInfo"
                                    :show-file-list="false"
                                    name='upFile'   
                                    :action="actionsUpload"
                                    :on-success="(res, file)=>{ return bindUploadSuccess(res,file,'payInfo',true) }"
                                    :on-error="bindUploadError"
                                    style="display:inline-block;"
                                    >
                                    <ElButton type="success" >重新上传</ElButton>
                                </el-upload>
                            </td>
                            <!-- 客户销售数据 -->
                             <td>
                                <a class="primary" 
                                    v-if="PAGEDATA.summaryReport" 
                                    target="_blank" 
                                    :href="`${download}?fileId=${PAGEDATA.summaryReport}`">
                                    <span class="fa fa-cloud-download"></span> 下载Summary Report文件
                                </a>
                                <a class="primary" 
                                    v-if="PAGEDATA.transactionReport" 
                                    target="_blank" 
                                    :href="`${download}?fileId=${PAGEDATA.transactionReport}`">
                                    <span class="fa fa-cloud-download"></span> 下载transactionReport 文件
                                </a>

                                <ElButton type="success" v-if="PAGEDATA.summaryReport"
                                    @click="changeModel(true,'applyModel')"
                                >重新上传</ElButton>
                            </td>
                            <td v-if="PAGEDATA.status==1">{{formatTimer(PAGEDATA.reportUpTime)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="block">
                <h5>报税记录</h5>
                 <table>
                    <thead>
                        <tr>
                            <th>申报国家</th>
                            <th>申报月份</th>
                            <th>销售文件</th>
                            <th>税金确认函</th>
                            <th>支付信息</th>
                            <th>支付回执</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in table" :key="index">
                            <!-- 申报国家 -->
                            <td>{{fineValName(item.countryCode,AllNationCode,'nation','code')}}</td>
                            <!-- 申报月份 -->
                            <td>{{item.months.join('、')}}</td>
                            <!-- 销售文件 -->
                            <td>
                                <a class="primary" 
                                    v-if="item.summaryReport" 
                                    target="_blank" 
                                    :href="`${download}?fileId=${item.summaryReport}`">
                                    <span class="fa fa-cloud-download"></span> 下载Summary Report文件
                                </a>
                                <a class="primary" 
                                    v-if="item.transactionReport" 
                                    target="_blank" 
                                    :href="`${download}?fileId=${item.transactionReport}`">
                                    <span class="fa fa-cloud-download"></span> 下载transactionReport 文件
                                </a>
                            </td>
                            <!-- 税金确认函 -->
                            <td>
                                 <a class="primary" 
                                    v-if="item.taxConfirm" 
                                    target="_blank" 
                                    :href="`${download}?fileId=${item.taxConfirm}`">
                                    <span class="fa fa-cloud-download"></span> 下载税金确认函
                                </a>
                            </td>
                            <!-- 支付信息-->
                            <td>
                                <a class="primary" 
                                    v-if="item.payInfo" 
                                    target="_blank" 
                                    :href="`${download}?fileId=${item.payInfo}`">
                                    <span class="fa fa-cloud-download"></span> 下载支付信息
                                </a>
                            </td>
                            <!-- 支付回执 -->
                            <td>
                                <a class="primary" 
                                    v-if="item.payReceipt" 
                                    target="_blank" 
                                    :href="`${download}?fileId=${item.payReceipt}`">
                                    <span class="fa fa-cloud-download"></span> 下载支付回执
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

             <div class="block">
                <h5>备注</h5>
                <p  class="fr" style="margin-top: -18px;"><el-button type="primary" @click="changeModel(true,'RemarkModel')">新增备注</el-button></p>
                <ul class="remark">
                    <li v-for="(item,index) in remarkList" :key="index">
                        <p>#{{index+1}} <i>{{item.operatorName}}</i> 于 {{formatTimer(item.createdTime)}}</p>
                        <p class="content">{{item.remark}}</p>
                    </li>
                </ul>
            </div>

        </div>

        <AdminModel title="备注" 
             v-model="RemarkModel.flag"
             :confirm="modelConfirm"
         >
            <el-input
                class="textarea"
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="RemarkModel.value">
            </el-input>
        </AdminModel>

        <AdminModel title="异常原因" 
            v-model="unNormalModel.flag"
            :confirm="unNormalModelConfirm"
        >
            <el-input
                class="textarea"
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="unNormalModel.value">
            </el-input>
        </AdminModel>

        <AdminModel 
            title="上传税金确认函与支付信息"
            v-model="payInfoModel.flag"
            :confirm="payInfoModelConfirm"
            class="vat-upload-model"
        >
            <el-form :model="payInfoModel">
                <el-form-item label="税金确认函*">
                    <el-upload
                        :show-file-list="false"
                        name='upFile'   
                        :action="actionsUpload"
                        :on-success="(res, file)=>{ return bindUploadSuccess(res,file,'taxConfirm') }"
                        :on-error="bindUploadError"
                        style="display:inline-block;"
                        >
                           <el-button type="primary">上传税金确认函</el-button>
                    </el-upload>
                    <br>
                    <span  v-if="payInfoModel.taxConfirm_Info.name">{{payInfoModel.taxConfirm_Info.name}}</span>
                </el-form-item>

                <el-form-item label="支付信息*">
                     <el-upload
                     :show-file-list="false"
                        name='upFile'   
                        :action="actionsUpload"
                        :on-success="(res, file)=>{ return bindUploadSuccess(res,file,'payInfo') }"
                        :on-error="bindUploadError"
                        style="display:inline-block;"
                        >
                         <el-button type="primary">上传支付信息</el-button>
                    </el-upload>
                    <br>
                    <span  v-if="payInfoModel.payInfo_Info.name">{{payInfoModel.payInfo_Info.name}}</span>
                </el-form-item>
            </el-form>
        </AdminModel>

        <AdminModel
            title="上传申报数据"
             v-model="applyModel.flag"
            :confirm="applyModelConfirm"
            class="vat-upload-apply-model"
        >
           <el-form :model="applyModel">
               <!-- transactionReport summaryReport -->
                <el-form-item label="VAT Transaction Report*">
                    <el-upload
                        :show-file-list="false"
                        name='upFile'   
                        :action="actionsUpload"
                        :on-success="(res, file)=>{ return bindUploadSuccess(res,file,'transactionReport',true) }"
                        :on-error="bindUploadError"
                        :before-upload="(file)=>{ return BeforeUpload(file,'txt')}" 
                        style="display:inline-block;"
                        >
                           <el-button type="primary">上传Transaction Report</el-button>
                    </el-upload>
                     <br>
                    <span  v-if="applyModel.transactionReport_name">{{applyModel.transactionReport_name}}</span>
                </el-form-item>

                <el-form-item label="Summary Report*">
                     <el-upload
                     :show-file-list="false"
                        name='upFile'   
                        :action="actionsUpload"
                        :on-success="(res, file)=>{ return bindUploadSuccess(res,file,'summaryReport',true) }"
                        :on-error="bindUploadError"
                        :before-upload="(file)=>{ return BeforeUpload(file,'pdf')}" 
                        style="display:inline-block;"
                        >
                         <el-button type="primary">上传Summary Report</el-button>
                    </el-upload>
                    <br>
                    <span  v-if="applyModel.summaryReport_name">{{applyModel.summaryReport_name}}</span>
                </el-form-item>
            </el-form>
        </AdminModel>
    </div>
</template>

<script>
import AdminModel from './../../../components/adminModal.vue';
import { 
    AllNationCode
} from '../../../ext/localBase.js';
import { findDeclarationModelList,vatrecordSaveRemark,vatrecordGetRemark ,
    download,
    upload,
    declarationSubmitService,
    declarationNotifyService,
    declarationRejectData,
    declarationRejectPay,
    declarationCommitService,
    declarationSbmitResult,
    declarationAmountExceptioning,
    declarationPayConfirm,
    declarationReUpload,
} from './../../../utils/axios/api.js';
import { formatTimer } from '../../../utils/common.js';

import { STATUS_REPORT_PART1,STATUS_REPORT_PART2 } from './var.js';

export default {
    data(){
        return{
            PAGEDATA:{},
            // taxCompanyTable:[],
            table:[],
            remarkList:[],
            
            RemarkModel:{
                flag:false,
                value:'',
            },
            unNormalModel:{
                flag:false,
                value:'',
            },

            payInfoModel:{
                flag:false,
                taxConfirm:'',//税金确认函
                taxConfirm_Info:'',//税金确认函上传的信息
                payInfo:'',//支付信息
                payInfo_Info:'',//支付信息
            },

            applyModel:{
                flag:false,
                transactionReport:'',
                transactionReport_name:'',
                summaryReport:'',
                summaryReport_name:'',
            },

            actionsUpload:upload,
            download:download,
            AllNationCode:AllNationCode,
            STATUS:[],
        }
    },
    created(){

        let OBJ = this.$route.params;
        let m = this.$store.state.Memory.vatReportDetail;

        if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"vatReporting"});
        
        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
            let ID = OBJ.id
            this.loadingQuery(ID);
        };
       
    },
    methods:{
        changeApplyStatus(msg,status){
            let fn;
            let params;

            switch(status){
                //提交资料到服务商
                case 3:{
                    fn = declarationSubmitService;
                    params = {
                        id:this.PAGEDATA.id,
                        countryCode:this.PAGEDATA.countryCode,
                    };
                }break;
                //金额已经确认  通知服务商
                case 6:{
                    fn= declarationNotifyService;
                    params = {
                        id:this.PAGEDATA.id,
                        countryCode:this.PAGEDATA.countryCode,
                    };
                }break;
                //支付回执已上传 通知服务商
                case 10:
                case 160:
                {
                    fn= declarationCommitService;
                    params = {
                        id:this.PAGEDATA.id,
                        countryCode:this.PAGEDATA.countryCode,
                    };
                }break;
                //支付回执审核通过
                case 11:{
                    fn = declarationSbmitResult;
                    params = {
                        id:this.PAGEDATA.id,
                        flag:true,
                        countryCode:this.PAGEDATA.countryCode,
                    };
                }break;
                //申报金额有异议
                case 13:{
                    fn = declarationAmountExceptioning;
                    params = {
                        id:this.PAGEDATA.id,
                        flag:true,
                        countryCode:this.PAGEDATA.countryCode,
                    };
                }break;
                case 100:{
                    fn = declarationPayConfirm;
                    params = {
                        id:this.PAGEDATA.id,
                        flag:true,
                        countryCode:this.PAGEDATA.countryCode,
                    };
                }break;
            };

            this.$confirm(msg,'提示').then(()=>{
                fn(params).then(res=>{
                    if(res.code==0){
                        //修改成功
                        this.$message.success(`修改成功！`);
                        //刷新页面
                        this.loadingQuery(this.PAGEDATA.id);
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            })
            .catch(()=>{})
        },
        loadingQuery(id){
            findDeclarationModelList({
                id,
                pageNum:1,
                pageSize:10,
            }).then(res=>{
                if(res.code==0){
                    this.PAGEDATA = res.data.list[0];

                    ['FR','IT','ES'].includes(this.PAGEDATA.countryCode) ? (
                        this.STATUS = STATUS_REPORT_PART2
                    ):(
                        this.STATUS = STATUS_REPORT_PART1
                    );

                    return findDeclarationModelList({
                        customerNo:this.PAGEDATA.customerNo,
                        countryCode:this.PAGEDATA.countryCode,
                        pageNum:1,
                        pageSize:10,
                    })
                }else{
                    this.$message.error(res.msg);
                }
            }).then(res=>{
                if(!res) return;
                if(res.code==0){
                    this.table = res.data.list
                }else{
                    this.$message.error(res.msg);
                }
            });

            //查询备注
            this.queryRemarkList(id);

        },

        changeModel(bol,target){
            this[target].flag = bol;
        },
        //查询备注列表
        queryRemarkList(id){
            vatrecordGetRemark({
                type:'2',
                id
            }).then(res=>{
                if(res.code==0){
                    this.remarkList = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //确认添加备注
        modelConfirm(){
            if(!this.RemarkModel.value) return this.$message.warning(`请输入备注内容！`);
            
            vatrecordSaveRemark({
                type:'2',
                id:this.PAGEDATA.id,
                remark:this.RemarkModel.value
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`添加备注成功！`);
                    this.changeModel(false,'RemarkModel');
                    this.RemarkModel.value="";

                    this.queryRemarkList(this.PAGEDATA.id);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //异常原因确认
        unNormalModelConfirm(){

            if(!this.unNormalModel.value) return this.$message.warning(`请输入异常原因！`);

            let FN = declarationSbmitResult;

            if(['FR','IT','ES'].includes(this.PAGEDATA.countryCode) && this.PAGEDATA.status=='16') {
                FN=declarationPayConfirm;
            };

            FN({
                id:this.PAGEDATA.id,
                countryCode:this.PAGEDATA.countryCode,
                flag:false,
                failReason:this.unNormalModel.value,
            }).then(res=>{
                if(res.code==0){
                    //修改成功
                    this.$message.success(`修改成功！`);
                    //关闭异常输入框
                    this.changeModel(false,'unNormalModel');
                    //刷新页面
                    this.loadingQuery(this.PAGEDATA.id);
                }else{
                    this.$message.error(res.msg);
                }
            });
            
        },
        payInfoModelConfirm(){
            if(!this.payInfoModel.taxConfirm) return this.$message.error(`请上传税金确认函`);
            if(!this.payInfoModel.payInfo) return this.$message.error(`请上传支付信息`);

            declarationRejectData({
                taxConfirm:this.payInfoModel.taxConfirm,
                payInfo:this.payInfoModel.payInfo,
                countryCode:this.PAGEDATA.countryCode,
                id:this.PAGEDATA.id,
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`上传成功！`);

                    this.changeModel(false,"payInfoModel");

                    this.loadingQuery(this.PAGEDATA.id);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //上传申报数据
        applyModelConfirm(){
            if(!this.applyModel.transactionReport) return this.$message.error(`请上传transactionReport文件`);
            if(!this.applyModel.summaryReport) return this.$message.error(`请上传summaryReport文件`);

            this.reUploadData({
                id:this.PAGEDATA.id,
                countryCode:this.PAGEDATA.countryCode,
                transactionReport:this.applyModel.transactionReport,
                summaryReport:this.applyModel.summaryReport,
            });
        },  
      
        //上传税金确认函
        rejectData(uuid){
            if(!uuid) return this.bindUploadError();
            declarationRejectData({
                taxConfirm:uuid,
                countryCode:this.PAGEDATA.countryCode,
                id:this.PAGEDATA.id,
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`上传成功！`);
                    this.loadingQuery(this.PAGEDATA.id);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //上传支付信息
        declarationRejectPay(uuid){
             if(!uuid) return this.bindUploadError();

            declarationRejectPay({
                countryCode:this.PAGEDATA.countryCode,
                id:this.PAGEDATA.id,
                payInfo:uuid
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`上传成功！`);
                    this.loadingQuery(this.PAGEDATA.id);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //重新上传的接口
        reUploadData(params){
            declarationReUpload(params).then(res=>{
                if(res.code==0){
                    this.$message.success(`上传成功`);
                     this.loadingQuery(this.PAGEDATA.id);

                     this.changeModel(false,'applyModel');
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindUploadSuccess(res,file,name,bol){
            if(res.code==0){
                // 2019-5-20  重新上传
                if(bol){
                    ['transactionReport','summaryReport'].includes(name) ? (
                        this.applyModel[name] = res.data.uuid,
                        this.applyModel[`${name}_name`] = file.name
                    ) : this.reUploadData({
                        id:this.PAGEDATA.id,
                        [name]:res.data.uuid,
                        countryCode:this.PAGEDATA.countryCode
                    });
                }else{

                     if(['DE','GB','PL','CZ'].includes(this.PAGEDATA.countryCode)){
                        [2].includes(this.PAGEDATA.status) && this.rejectData(res.data.uuid);
                        [6].includes(this.PAGEDATA.status) && this.declarationRejectPay(res.data.uuid);
                    }else{
                        this.payInfoModel[name] = res.data.uuid;
                        this.payInfoModel[`${name}_Info`] = file;
                    }
                }

                 
            }else{
                this.$message.error(res.msg);
                typeof name == 'string' && (this.payInfoModel[`${name}_Info`] = '');
            }
        },
        BeforeUpload(file,type){
            let fileType = file.name.substring(file.name.lastIndexOf('.')+1).toUpperCase();
            if(fileType != type.toUpperCase()){
                this.$message.warning(`请上传.${type}格式的文件!`);
                return false;
            };
            return true;
        },
        bindUploadError(){
            this.$message.error(`上传失败，请重新上传！`);
        },
        formatTimer(code){
            return formatTimer(code)
        },
        fineValName(code,LIST,NAME,itemCode){
            let I = LIST.find(item=>{
                return item[itemCode]==code;
            });
            if(I){
                return I[NAME];
            }
        },
    },
    components:{
        AdminModel
    },
    destroyed(){
        let tabArr = this.$store.state.TabList;
        tabArr.forEach(item=>{
            if(item.name=='vatReportDetail'){
                return  this.$store.commit('setModelRecordData',{
                     key:'vatReportDetail',
                     data:this._data
                 });
            }
        });
    }
}
</script>


<style lang="scss" scoped>
@import './../../../css/element-variables.scss';
.block{
    padding-top: 10px;
    border-bottom: 1px solid #e5e5e5;
}
  h5{
        font-size: 14px;
        color: #333;
    }

.item-container{
        padding: 20px 0;
        li{
            display: inline-block;
            margin-right: 40px;
            color: #666;
            min-width: 20%;
            // max-width: 20%;
            line-height: 30px;
            span{
                color: #333;
            }
        }  
}

.textarea{
    margin: 20px 0;
}

.remark{
        padding: 15px 0;
        li{
            font-size: 14px;   
            p{
                color: #666;
                padding: 5px 0;
            }
            .content{
                color: #333;
            }
            i{
                color: $--color-primary;
            }
        }
}

.failReason{
    background-color: #f1f1f1;
    margin: 10px 0;
    li{
        margin: 5px 0;
        color: $--color-danger;
    }
}
</style>

<style lang="scss">
.vat-upload-model{
    form{
        padding-top:20px;
        .el-form-item__label{
            width:120px;
        }
    }
}

.vat-upload-apply-model{
    form{
        padding-top:20px;
        .el-form-item__label{
            min-width:180px;
        }
    }
}
</style>


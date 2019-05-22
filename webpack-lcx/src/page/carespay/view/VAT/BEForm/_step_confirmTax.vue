<template>
    <div>
         <p class="title">VAT待申报信息</p>
        <CTable>
            <table>
                <thead>
                    <tr>
                        <th>申报国家</th>
                        <th>增值税号</th>
                        <th>申报月份</th>
                        <th>申报截止日</th>
                        <th>销售数据</th>
                        <th
                            v-if="![0,1,2].includes(DATA.status)"
                        >税金确认函</th>
                        <!-- 支付信息 -->
                        <th
                            v-if="
                            ['DE','GB','PL','CZ'].includes(DATA.countryCode) && [7,8,9,10,11].includes(DATA.status) ||
                            ['FR','IT','ES'].includes(DATA.countryCode) &&  [3,5].includes(DATA.status)
                            "
                        >支付信息</th>
                        <th 
                            v-if="['DE','GB','PL','CZ'].includes(DATA.countryCode) && [8,10,11].includes(DATA.status)"
                        >
                            支付回执
                        </th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{fineValName(DATA.countryCode,AllNationCode,'nation','code')}}</td>
                        <td>{{DATA.taxNo}}</td>
                        <!-- 申报月份 -->
                        <td>{{DATA.months.join('/')}}月</td>
                        <td>{{formatTimer(DATA.deadlineTime)}}</td>
                        <td>
                            <a class="cares-color" 
                                v-if="DATA.summaryReport" 
                                target="_blank" 
                                :href="`${download}${DATA.summaryReport}`">
                                <span class="el-icon-download"></span> 下载Summary Report文件
                            </a>
                            <br/>
                            <a class="cares-color" 
                                v-if="DATA.transactionReport" 
                                target="_blank" 
                                :href="`${download}${DATA.transactionReport}`">
                                <span class="el-icon-download"></span> 下载transaction Report文件
                            </a>
                        </td>
                        <!-- 税金确认函 -->
                        <td
                            v-if="![0,1,2].includes(DATA.status)"
                        >

                            <a class="cares-color" 
                                v-if="DATA.taxConfirm" 
                                target="_blank" 
                                :href="`${download}${DATA.taxConfirm}`">
                                <span class="el-icon-download"></span> 下载税金确认函
                            </a>

                        </td>
                        <!-- 支付信息 -->
                        <td
                            v-if="['DE','GB','PL','CZ'].includes(DATA.countryCode) && [7,8,9,10,11].includes(DATA.status) ||
                                 ['FR','IT','ES'].includes(DATA.countryCode) && [3,5].includes(DATA.status)
                            "
                        >
                            <a class="cares-color" 
                                v-if="DATA.payInfo" 
                                target="_blank" 
                                :href="`${download}${DATA.payInfo}`">
                                <span class="el-icon-download"></span> 下载支付信息
                            </a>
                        </td>
                        <!-- 支付回执 -->
                        <td
                            v-if="['DE','GB','PL','CZ'].includes(DATA.countryCode) && [8,10,11].includes(DATA.status)"
                        >
                            <a class="cares-color" 
                                v-if="DATA.payReceipt" 
                                target="_blank" 
                                :href="`${download}${DATA.payReceipt}`">
                                <span class="el-icon-download"></span> 下载支付回执
                            </a>
                        </td>
                        <td>
                             <!-- 确认税金按钮 -->
                            <template v-if="[3].includes(DATA.status)">
                                <a href="javascript:;" class="cares-button-primary" @click="confirmTaxCount">确认报税金额</a>
                                
                                <a href="javascript:;"
                                v-if="['DE','GB','PL','CZ'].includes(DATA.countryCode)"
                                 class="cares-button-danger" 
                                 @click="disagreement">报税金额有异议</a>
                            </template>

                             <!-- 申报成功 -->
                            <template v-if="DATA.status==11">申报成功</template>
                           <!-- 德国、英国、波兰、捷克 -->
                            <template v-if="['DE','GB','PL','CZ'].includes(DATA.countryCode)">
                                 <!-- 申报金额有异议 -->
                                <template v-if="[4,13].includes(DATA.status)">
                                     报税金额有异议
                                    <ElTooltip content="1～2个工作日内将会有CaresPAY的专业客户人员线下跟进，请留意！" placement="top-end">
                                        <span class="el-icon-info cares-color"></span>
                                    </ElTooltip>
                                </template>
                                 <!-- 提交税局中 -->
                                <template v-if="[5,6].includes(DATA.status)">
                                     已确认税金，提交税局中
                                    <ElTooltip content="工作人员已经向官方递交税金确认函，待官方下发支付信息后，您可在系统查看文件，请耐心等待！" placement="top-end">
                                        <span class="el-icon-info cares-color"></span>
                                    </ElTooltip>
                                </template>
                                 <!-- 支付信息下发，支付回执待上传 declarationUploadPay-->
                                <template v-if="[7].includes(DATA.status)">
                                    <!-- <span class="cares-button-primary"
                                         @click="jumpRouter('VATpay',{
                                            TO:'PayTaxApply',
                                            declarationId:DATA.id,
                                            taxPayFile:DATA.payInfo,
                                        })"
                                    >申请代缴税金</span> -->
                                    <el-upload
                                        :show-file-list='false'
                                        name='upFile'   
                                        :action="uploadefile"
                                        :on-success="bindUploadSuccess"
                                        :on-error="bindUploadError"
                                        style="display:inline-block;"
                                        >
                                        <a href="javascript:;" class="cares-button-primary pain">已缴税，上传支付凭证</a>
                                    </el-upload>
                                    
                                </template>
                                <!-- 申报金额已缴纳，审核中 -->
                                <template v-if="[9].includes(DATA.status)">
                                    申报金额已缴纳，审核中
                                    <ElTooltip content="工作人员会在后台审核您上传的支付回执信息是否准确，确认无误后，本月报税完成" placement="top-end">
                                        <span class="el-icon-info cares-color"></span>
                                    </ElTooltip>
                                </template>
                                <!-- 审核支付回执 -->
                                <template v-if="[8,10].includes(DATA.status)">
                                    申报回执审核中
                                    <ElTooltip content="工作人员会在后台审核您上传的支付回执信息是否准确，确认无误后，本月报税完成" placement="top-end">
                                        <span class="el-icon-info cares-color"></span>
                                    </ElTooltip>
                                </template>
                            </template>

                            <!-- 法国、西班牙、意大利 -->
                            <template v-if="['FR','IT','ES'].includes(DATA.countryCode)">
                                <!--待缴纳税金 -->
                                 <template v-if="[5,9].includes(DATA.status)">
                                     <!-- <span class="cares-button-primary"
                                        v-if="DATA.status==5" 
                                         @click="jumpRouter('VATpay',{
                                            TO:'PayTaxApply',
                                            declarationId:DATA.id,
                                            taxPayFile:DATA.payInfo,
                                        })"
                                    >缴纳税金</span> -->
                                    <el-upload
                                        :show-file-list='false'
                                        name='upFile'   
                                        :action="uploadefile"
                                        :on-success="bindUploadSuccess"
                                        :on-error="bindUploadError"
                                        style="display:inline-block;"
                                        >
                                        <a href="javascript:;" v-if="DATA.status==5" class="cares-button-primary pain">已缴税，上传支付凭证</a>
                                        <a href="javascript:;" v-if="DATA.status==9" class="cares-button-primary pain">重新上传支付凭证</a>
                                    </el-upload>
                                </template>

                                 <!-- 申报金额有异议 -->
                                <template v-if="[4,14].includes(DATA.status)">
                                     报税金额有异议
                                    <ElTooltip content="1～2个工作日内将会有CaresPAY的专业客户人员线下跟进，请留意！" placement="top-end">
                                        <span class="el-icon-info cares-color"></span>
                                    </ElTooltip>
                                </template>

                                 <!-- 审核支付回执 -->
                                <template v-if="[6,7,16].includes(DATA.status)">
                                    申报审核中
                                    <ElTooltip content="CaresPAY工作人员正在审核您的申报信息，预计1~2个工作日审核完毕！" placement="top-end">
                                        <span class="el-icon-info cares-color"></span>
                                    </ElTooltip>
                                </template>
                                 <!-- 审核支付回执 -->
                                <template v-if="[10,13].includes(DATA.status)">
                                    已确认税金，提交税局中
                                    <ElTooltip content="工作人员已经向官方递交税金确认函，待官方下发支付信息后，您可在系统查看文件，请耐心等待！" placement="top-end">
                                        <span class="el-icon-info cares-color"></span>
                                    </ElTooltip>
                                </template>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </CTable>

         <p class="title">VAT税号信息</p>
         <CTable>
            <table>
                <thead>
                    <tr>
                        <th>公司名</th>
                        <th>申报国家</th>
                        <th>增值税/商品和服务税登记号</th>
                        <th>已报税次数</th>
                        <th>剩余报税次数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{DATA.companyName}}</td>
                        <td>{{fineValName(DATA.countryCode,AllNationCode,'nation','code')}}</td>
                        <td>{{DATA.taxNo}}</td>
                        <td>{{DATA.useDeclaraCount}}</td>
                        <td>{{DATA.declaraCount-DATA.useDeclaraCount}}</td>
                    </tr>
                </tbody>
            </table>
        </CTable>

        <p class="title">报税记录</p>
        <CTable>
            <table>
                <thead>
                    <tr>
                        <th>申报国家</th>
                        <th>增值税号</th>
                        <th>申报月份</th>
                        <th>销售文件</th>
                        <th>税金确认函</th>
                        <th>支付信息</th>
                        <th>支付回执</th>
                    </tr>
                </thead>
                <tbody>
                     <tr v-if="!table.length" class="empty">
                        <td colspan="7">暂无数据</td>
                     </tr>
                    <tr v-for="(item,index) in table" :key="index">
                        <td>{{fineValName(item.countryCode,AllNationCode,'nation','code')}}</td>
                        <td>{{item.taxNo}}</td>
                        <td>{{item.months.join('/')}}</td>
                        <td>
                            <a class="cares-color" 
                                v-if="item.summaryReport" 
                                target="_blank" 
                                :href="`${download}${item.summaryReport}`">
                                <span class="el-icon-download"></span> 下载Summary Report文件
                            </a>
                            <br/>
                            <a class="cares-color" 
                                v-if="item.transactionReport" 
                                target="_blank" 
                                :href="`${download}${item.transactionReport}`">
                                <span class="el-icon-download"></span> 下载transaction Report文件
                            </a>
                        </td>
                        <td>
                            <a class="cares-color" 
                               v-if="item.taxConfirm" 
                               target="_blank" 
                               :href="`${download}${item.taxConfirm}`">
                               <span class="el-icon-download"></span> 下载税金确认函
                            </a>
                        </td>
                        <!-- 支付信息 -->
                        <td>
                            <a class="cares-color" 
                                v-if="item.payInfo" 
                                target="_blank" 
                                :href="`${download}${item.payInfo}`">
                                <span class="el-icon-download"></span> 下载支付信息
                            </a>
                        </td>
                        <!-- 支付回执 -->
                        <td>
                            <a class="cares-color" 
                                v-if="item.payReceipt" 
                                target="_blank" 
                                :href="`${download}${item.payReceipt}`">
                                <span class="el-icon-download"></span> 下载支付回执
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </CTable>

        <AdminModel v-model="modelStatus"
            class="vat-report-model"
        >
            <div>
                <p>请输入申报异议原因：</p>
                <el-input v-model="disagreementTxt" type="textarea" placeholder=""></el-input>
                <p class="btn">
                    <span 
                        class="cares-button-primary"
                        @click="disagreementApply"
                    >确认</span><br/>
                    <a href="javascript:;" class="ING"
                        @click="changeModelStatus(false)"
                    >取消</a>
                </p>
            </div>
        </AdminModel>
    </div>
</template>

<script>
import CTable from './../../../../../components/CTable.vue';
import AdminModel from './../../../../../components/adminModel.vue';
import {AllNationCode} from './../../../utils/localbase.js';
import { formatTimer } from './../../../../../js/common.js';

import { 
    declarationCalcPay ,
    findDeclarationModelList ,
    declarationUploadPay ,      //上传支付回执
    uploadefile ,      //上传支付回执
    downloadfile
} from './../../../../../js/api.js';

export default {
    props:['DATA'],
    data(){
        return {
            table:[],
            uploadefile:uploadefile,
            download:downloadfile,
            modelStatus:false,
            disagreementTxt:'',
            AllNationCode:AllNationCode
        }
    },
    created(){
        this.loadingQuery();
    },
    components:{
        CTable,
        AdminModel
    },
    methods:{
        loadingQuery(){
            findDeclarationModelList({
                customerNo:this.DATA.customerNo,
                countryCode:this.DATA.countryCode,
                pageNum:1,
                pageSize:10,
            }).then(res=>{
                if(res.code==0){
                    this.table = res.data.list;
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        confirmTaxCount(){
            // 您确认金额后需要支付对应的税金，我司工作人员会在您缴纳税金后向税局官方递交申请
            let msg = ['DE','GB','PL','CZ'].includes( this.DATA.countryCode) ? 
                '您确认金额后，我司工作人员会在您确认后向税局官方递交申请' :
                '您确认金额后需要支付对应的税金，我司工作人员会在您缴纳税金后向税局官方递交申请';
            let self = this;
            this.$confirm(msg,
                '请核对税金后，确认申报税金无误！', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                confirmButtonClass:'cares-button-primary',
                cancelButtonClass:'cares-button-primary pain',
                type: 'warning'
            }).then(()=>{
                this.declarationCalcPay({flag:true},function(){
                    if(['FR','IT','ES'].includes(self.DATA.countryCode)){
                        return self.$emit('reflesh');
                    };
                   
                    self.$router.push({
                        name:'AuthenticationDone',
                        params:{
                            source:'VATConfirmTaxMoney',
                            id:self.DATA.id
                        }
                    })
                });

            }).catch(()=>{})
        },
        // 确认税金  或者有异议
        declarationCalcPay(params,fn){
            
            declarationCalcPay({
                id:this.DATA.id,
                countryCode:this.DATA.countryCode,
                failReason:params.failReason || '',
                flag:params.flag
            }).then(res=>{
                if(res.code==0){
                    fn();
                }else{
                    this.$Message.error(res.msg);
                }
            })
        },
        // 不同意金额
        disagreementApply(){
            if(!this.disagreementTxt) return this.$Message.warning(`请输入异议原因！`);
            let self = this;

            this.declarationCalcPay({flag:false,failReason:this.disagreementTxt},function(){
                self.changeModelStatus(false);
                self.disagreementTxt="";

                self.$router.push({
                    name:'AuthenticationDone',
                    params:{
                        source:'VATMoneyDisagreedSubmit',
                        id:self.DATA.id
                    }
                });
            });
        },
        declarationUploadPay(uuid){
            if(!uuid) return this.bindUploadError();
            declarationUploadPay({
                countryCode:this.DATA.countryCode,
                id:this.DATA.id,
                payReceipt:uuid
            }).then(res=>{
                if(res.code==0){
                    this.$Message.success(`上传成功`);
                    //刷新页面
                    this.$emit('reflesh');
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        //文件上传成功
        bindUploadSuccess(res){
            if(res.code==0){
                if(['DE','GB','PL','CZ'].includes(this.DATA.countryCode)){
                    [7].includes(this.DATA.status) && this.declarationUploadPay(res.data.uuid);
                }

                if(['FR','IT','ES'].includes(this.DATA.countryCode)){
                    [5,9].includes(this.DATA.status) && this.declarationUploadPay(res.data.uuid);
                }
            }else{
                this.$message.error(res.msg);
            }
        },
        bindUploadError(){
            this.$message.error(`上传失败，请重新上传！`);
        },

        disagreement(){
            this.changeModelStatus(true)
        },
        jumpRouter(name,params){
            this.$router.push({
                name,
                params
            })
        },
        changeModelStatus(bol){
            this.modelStatus = bol;
        },
        fineValName(code,LIST,NAME,itemCode){
            let I = LIST.find(item=>{
                return item[itemCode]==code;
            });
            if(I){
                return I[NAME];
            }
        },
        formatTimer(code){
            return formatTimer(code);
        }
    }
}
</script>

<style lang="scss">
.vat-report-model {
    .modal-container{
        width: 500px;
        left: 50%;
        margin-left: -250px;
        // transform: translateX(-50%);
        p{
            line-height: 40px;
            font-size: 14px;
        }

        .btn{
            text-align: center;
            line-height: 20px;
            span{
                min-width: 80px;
                margin-bottom: 5px;
            }
        }

        textarea{
            height: 160px;
            margin-bottom: 20px;
        }
        
    }
}
</style>

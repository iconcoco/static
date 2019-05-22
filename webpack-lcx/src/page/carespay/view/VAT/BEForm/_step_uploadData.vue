<template>
    <div>
        <p class="title">VAT待申报信息</p>
        <el-form :model="form" class="Apply-vat-form">
            <ElFormItem label="公司信息" v-if="DATA.status!=12">{{DATA.companyName}}</ElFormItem>
            <ElFormItem label="申报国家">{{fineValName(DATA.countryCode,AllNationCode,'nation','code')}}</ElFormItem>
            <ElFormItem label="VAT号码">{{DATA.taxNo}}</ElFormItem>
            <ElFormItem label="申报月份">{{DATA.months.join('/')}}月</ElFormItem>
            <ElFormItem label="申报截止日"  v-if="DATA.status!=12">{{formatTimer(DATA.deadlineTime)}}</ElFormItem>

            <div class="form-item"  v-if="DATA.status!=12">
                <span>VAT Transaction Report*</span>
                <div class="item">
                    <p>请上传报税2、3、4月份英国站点的VAT Transaction Report（可在Amazon店铺后台下载），最大不超过10M，格式限定为.txt</p>
                    <ul class="clearfix uploadBox">
                        <li>
                            <el-upload
                            name='upFile'   
                            :action="uploadefile"
                            id="transactionReport"
                            :on-success="(res,file)=>{ return uploadFileSucess(res,file,'transactionReport','txt')}"
                            :on-error="()=>{ return bindUploadError('pdf') }"
                            :on-remove="function(file, fileList){ return bindUploadFileExceed(file, fileList,'transactionReport')} "
                            :before-upload="(file)=>{ return BeforeUpload(file,'txt')}" 
                            >
                                <span class="cares-button-primary pain">点击上传</span>
                            </el-upload>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="form-item"  v-if="DATA.status!=12">
                <span>Summary Report*</span>
                <div class="item">
                    <p>请上传报税2、3、4月份英国站点的Summary Report（可在Amazon店铺后台下载），最大不超过10M，格式限定为.pdf</p>
                    <ul class="clearfix uploadBox">
                        <li>
                            <el-upload
                            name='upFile'   
                            id="summaryReport"
                            :action="uploadefile"
                            :on-success="(res,file)=>{ return uploadFileSucess(res,file,'summaryReport','pdf')}"
                            :on-remove="function(file, fileList){ return bindUploadFileExceed(file, fileList,'summaryReport')} "
                            :on-error="()=>{ return bindUploadError('pdf') }"
                            :before-upload="(file)=>{ return BeforeUpload(file,'pdf')}" 
                            >
                                <span class="cares-button-primary pain">点击上传</span>
                            </el-upload>
                        </li>
                    </ul>

                </div>
            </div>

            <div class="form-item line"  v-if="DATA.status!=12">
                <div class="item">
                    <el-checkbox v-model="isRead">我已阅读并同意</el-checkbox><a href="javascript:;" @click="changeServiceStatus(true)" class="cares-color">《VAT申请条款》</a> 
                </div>
            </div>

            <a 
            v-if="DATA.status!=12"
            href="javascript:;" 
            :class="isRead ? 'cares-button-primary':'cares-button-info'" 
            @click="submitReport">提交申报</a>

            <template  v-if="DATA.status==12">
                <!-- 销售数据 -->
                <div class="form-item">
                    <span>销售数据</span>
                    <div class="item">
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
                    </div>
                </div>
                <!-- 税金确认函 -->
                <div class="form-item">
                    <span>税金确认函</span>
                    <div class="item">
                        <a class="cares-color" 
                            v-if="DATA.taxConfirm" 
                            target="_blank" 
                            :href="`${download}${DATA.taxConfirm}`">
                            <span class="el-icon-download"></span> 下载税金确认函
                        </a>
                    </div>
                </div>
                <!-- 支付信息 -->
                <div class="form-item">
                    <span>支付信息</span>
                    <div class="item">
                        <a class="cares-color" 
                            v-if="DATA.payInfo" 
                            target="_blank" 
                            :href="`${download}${DATA.payInfo}`">
                            <span class="el-icon-download"></span> 下载支付信息
                        </a>
                    </div>
                </div>
                <!-- 支付回执 -->
                <div class="form-item">
                    <span>支付回执</span>
                    <div class="item">
                        <a class="cares-color" 
                            v-if="DATA.payReceipt" 
                            target="_blank" 
                            :href="`${download}${DATA.payReceipt}`">
                            <span class="el-icon-download"></span> 下载支付回执
                        </a>
                    </div>
                </div>
            </template>
        </el-form>

         <VatService v-model="flag"
            :buttonEvent="serviceButtonEvent"
        ></VatService>
    </div>
</template>

<script>
import $ from 'jquery';
import {AllNationCode} from './../../../utils/localbase.js';
import { formatTimer } from './../../../../../js/common.js';
import VatService from './../VATServiceAgreement.vue';

import { 
    downloadfile,
    declarationUpdateData,
    uploadefile,
} from './../../../../../js/api.js';

export default {
    props:["DATA"],
    data(){
        return {
            flag:false,
            isRead:false,
            download:downloadfile,
            uploadefile:uploadefile,
            form:{
                summaryReport:'',
                transactionReport:'',
                countryCode:'',
                id:'',
            },
            AllNationCode:AllNationCode
        }
    },
    methods:{
        submitReport(){

            if(!this.form.summaryReport) return this.$Message.warning('请上传VAT Summary Report');
            if(!this.form.transactionReport) return this.$Message.warning('请上传VAT Transaction Report');

            if(!this.isRead) return this.flag = true;

            this.form.id = this.DATA.id;
            this.form.countryCode = this.DATA.countryCode;
            declarationUpdateData(this.form).then(res=>{
                if(res.code==0){

                    this.$router.push({
                        name:"AuthenticationDone",
                        params:{
                            source:'VATreportApply',
                            id:this.DATA.id
                        }
                    });
                }else{
                    this.$Message.error(res.msg);
                }
            });
            
        },
        serviceButtonEvent(bol){
             this.isRead = bol;
            this.changeServiceStatus(false);
        },

        changeServiceStatus(bol){
            this.flag = bol;
        },
        uploadFileSucess(res,file,name,attr){
            
            if(res.code==0){
                //判断给股东回显还是董事
                this.form[name]  = res.data.uuid;
                $(`#${name}`).find('.el-upload-list li').length>1 && $(`#${name}`).find('.el-upload-list li').eq(0).hide(500,function(){ $(this).remove() });
            }else{
                this.$Message.error(res.msg);
            }
        },
        bindUploadError(attr){
            this.$Message.warning(`上传失败，请重新上传！`);
        },
        bindUploadFileExceed(file,fileList,name){
            this.form[name] = "";
        },
        BeforeUpload(file,type){
            let fileType = file.name.substring(file.name.lastIndexOf('.')+1).toUpperCase();
            if(fileType != type.toUpperCase()){
                this.$Message.warning(`请上传.${type}格式的文件!`);
                return false;
            };
            return true;
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
    },
    components:{
        VatService
    },
}
</script>

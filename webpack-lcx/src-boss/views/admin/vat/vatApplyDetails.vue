<template>
    <div class="fadeIn">
        <div class="table-container ">
            <div class="block">
                <h5>申请详情</h5>
                <ul class="item-container">
                    <li><span>客户ID：</span>{{PAGEDATA.customerNo}}</li>
                    <li><span>申请时间：</span>{{formatTimer(PAGEDATA.createdTime)}}</li>
                    <li><span>申报国家：</span>{{fineValName(PAGEDATA.declaredCountry,AllNationCode,'nation','code')}}</li>
                    <li><span>服务类型：</span>{{PAGEDATA.type==1 ? '注册+首年申报' : '单次注册'}}</li>
                    <li><span>状态：</span>
                        <i v-if="[0,6,7,9].includes(PAGEDATA.attachStatus)" class="waiting">{{fineValName(PAGEDATA.attachStatus,STATUS,'name','status')}}</i>
                         <i v-if="[1].includes(PAGEDATA.attachStatus)" class="yes">{{fineValName(PAGEDATA.attachStatus,STATUS,'name','status')}}</i>
                         <i v-if="[2,5].includes(PAGEDATA.attachStatus)" class="no">{{fineValName(PAGEDATA.attachStatus,STATUS,'name','status')}}</i>
                         <i v-if="[3,4,8].includes(PAGEDATA.attachStatus)" class="ing">{{fineValName(PAGEDATA.attachStatus,STATUS,'name','status')}}</i>
                    </li>
                </ul>
            </div>

            <div class="block" v-if="[2,5].includes(PAGEDATA.attachStatus)">
                <h5>{{fineValName(PAGEDATA.attachStatus,STATUS,'name','status')}}原因</h5>
                <ul class="failReason">
                    <li> <i class="point no"></i> {{PAGEDATA.remark}}</li>
                </ul>
            </div>

            <div class="block">
                <h5>联系信息</h5>
                <ul class="item-container">
                    <li><span>申请人电话：</span>{{PAGEDATA.phone}}</li>
                    <li><span>申请人邮箱：</span>{{PAGEDATA.email}}</li>
                </ul>
            </div>
            <!-- 联系信息table -->
            <!-- {{PAGEDATA.attachStatus}} -->
            <table>
                <thead>
                    <tr>
                        <th v-show="[0,2,6,8,9].includes(PAGEDATA.attachStatus)">操作</th>
                        <th v-show="PAGEDATA.attachStatus==1">申请成功时间</th>
                        <th>注册所需材料模板</th>
                        <th>客户注册资料</th>
                        <th>注册资料上传时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td v-show="[0,2,6,8,9].includes(PAGEDATA.attachStatus)" data-txt="操作">
                            <el-button type="primary" v-if="PAGEDATA.attachStatus==0" @click="changeApplyStatus('确认审核通过？',3)">审核通过</el-button>

                            <el-button type="primary" v-if="PAGEDATA.attachStatus==6" @click="changeApplyStatus('确认已通知服务商申请税号？',8)">通知服务商申请税号</el-button>

                            <el-button type="primary" v-if="PAGEDATA.attachStatus==9" @click="changeModel(true,'taxNoInfoForm')">完善税号信息</el-button>

                            <el-button type="primary" v-if="PAGEDATA.attachStatus==2" @click="changeModel(true,'taxNoInfoForm')">录入税号信息</el-button>

                            <template v-if="PAGEDATA.attachStatus==8">
                                <el-button type="primary" @click="changeModel(true,'taxNoInfoForm')">录入税号信息</el-button>
                                <el-button type="danger" @click="changeModel(true,'unNormalModel')">申请异常</el-button>
                            </template>
                        </td>
                        <td v-if="PAGEDATA.attachStatus==1" data-txt="申请成功时间">
                             {{formatTimer(PAGEDATA.applySuccessTime)}}
                        </td>
                        <td data-txt="注册所需资料">
                            <a class="primary" v-if="PAGEDATA.fileForward" target="_blank" :href="`${download}?fileId=${PAGEDATA.fileForward}`"><span class="fa fa-cloud-download"></span> 下载资料</a>
                        </td>
                        <td data-txt="客户注册资料">
                            <a class="primary" v-if="PAGEDATA.fileAttach" target="_blank" :href="`${download}?fileId=${PAGEDATA.fileAttach}`"><span class="fa fa-cloud-download"></span> 下载资料</a>
                            <el-upload
                                :show-file-list='false'
                                name='upFile'   
                                :action="actionsUpload"
                                :on-success="bindUploadSuccess"
                                :on-error="bindUploadError"
                                style="display:inline-block;"
                                >
                                <el-button type="success">{{PAGEDATA.fileAttach ? '重新上传': '上传'}}</el-button>
                            </el-upload>
                        </td>
                        <td data-txt="注册资料上传时间">
                             {{formatTimer(PAGEDATA.fileTime)}}
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- 税号信息 -->
            <div class="block" v-if="[1,2,6,8,9].includes(PAGEDATA.attachStatus)">
                <h5>税号信息</h5>
                <p  class="fr" style="margin-top: -18px;"><el-button type="primary" @click="changeModel(true,'taxNoInfoForm')">编辑税号信息</el-button></p>
                <ul class="item-container" v-if="!taxNoInfoForm.flag">
                    <template v-if="['GB','FR','CZ','PL'].includes(PAGEDATA.declaredCountry)">
                        <li><span>增值税/商品和服务税登记号：</span>{{PAGEDATA.dutyServiceNumber? PAGEDATA.dutyServiceNumber: 'N/A'}}</li>

                    </template>
                    
                    <template v-if="['DE'].includes(PAGEDATA.declaredCountry)">
                        <li><span>Steuernummer（税务识别号）：</span>{{PAGEDATA.dutySteuernummer? PAGEDATA.dutySteuernummer: 'N/A'}}</li>
                        <li><span>增值税/商品和服务税登记号：</span>{{PAGEDATA.dutyServiceNumber? PAGEDATA.dutyServiceNumber: 'N/A'}}</li>
                        <li><span>税务副本：</span>{{PAGEDATA.dutyTaxCopy? PAGEDATA.dutyTaxCopy: 'N/A'}}</li>
                    </template>

                    <template v-if="['IT'].includes(PAGEDATA.declaredCountry)">
                        <li><span>本地增值税号：</span>{{PAGEDATA.dutyLocalNumber? PAGEDATA.dutyLocalNumber: 'N/A'}}</li>
                        <li><span>欧盟内部增值税税号：</span>{{PAGEDATA.dutyEuNumber? PAGEDATA.dutyEuNumber: 'N/A'}}</li>
                    </template>

                    <template v-if="['ES'].includes(PAGEDATA.declaredCountry)">
                        <li><span>本地增值税号：</span>{{PAGEDATA.dutyLocalNumber? PAGEDATA.dutyLocalNumber: 'N/A'}}</li>
                        <li><span>欧盟内部增值税税号：</span>{{PAGEDATA.dutyEuNumber? PAGEDATA.dutyEuNumber: 'N/A'}}</li>
                        <li><span>税务副本：</span>{{PAGEDATA.dutyTaxCopy? PAGEDATA.dutyTaxCopy: 'N/A'}}</li>
                    </template>
                        <li><span>EORI Number：</span>{{PAGEDATA.dutyEoriNumber? PAGEDATA.dutyEoriNumber: 'N/A'}}</li>
                        <li><span>税号生效日期：</span>{{PAGEDATA.dutyEffectTime? formatTimer(PAGEDATA.dutyEffectTime): 'N/A'}}</li>
                </ul>
                <el-form v-else :model="taxNoInfoForm" :inline="true"  class="admin-form-inline">

                    <template v-if="['GB','FR','CZ','PL'].includes(PAGEDATA.declaredCountry)">
                        <el-form-item label="增值税/商品和服务税登记号">
                            <ElInput v-model="taxNoInfoForm.dutyServiceNumber" placeholder="请输入商户/商品和服务税登记号"></ElInput>
                        </el-form-item>

                    </template>

                    <template v-if="['DE'].includes(PAGEDATA.declaredCountry)">
                        <el-form-item label="Steuernummer（税务识别号）">
                            <ElInput v-model="taxNoInfoForm.dutySteuernummer" placeholder="请输入Steuernummer（税务识别号）"></ElInput>
                        </el-form-item>
                        <el-form-item label="增值税/商品和服务税登记号">
                           <ElInput v-model="taxNoInfoForm.dutyServiceNumber" placeholder="请输入商户/商品和服务税登记号"></ElInput>
                        </el-form-item>

                        <el-form-item label="税务副本">
                            <el-upload
                                :show-file-list='false'
                                name='upFile'   
                                :action="actionsUpload"
                                :on-success="bindUploadSuccess"
                                :on-error="bindUploadError"
                                style="display:inline-block;"
                                >
                                <el-button type="success">上传税务副本</el-button>
                            </el-upload>
                            <a class="primary" v-if="taxNoInfoForm.dutyTaxCopy" target="_blank" :href="`${download}?fileId=${taxNoInfoForm.dutyTaxCopy}`"><span class="fa fa-cloud-download"></span> 下载资料</a>
                        </el-form-item>
                    </template>

                    <template v-if="['IT'].includes(PAGEDATA.declaredCountry)">
                        <el-form-item label="本地增值税号">
                            <ElInput v-model="taxNoInfoForm.dutyLocalNumber" placeholder="请输入本地增值税号"></ElInput>
                        </el-form-item>
                        <el-form-item label="欧盟内部增值税税号">
                            <ElInput v-model="taxNoInfoForm.dutyEuNumber" placeholder="请输入欧盟内部增值税税号"></ElInput>
                        </el-form-item>

                    </template>

                    <template v-if="['ES'].includes(PAGEDATA.declaredCountry)">
                        <el-form-item label="本地增值税号">
                           <ElInput v-model="taxNoInfoForm.dutyLocalNumber" placeholder="请输入本地增值税号"></ElInput>
                        </el-form-item>
                        <el-form-item label="欧盟内部增值税税号">
                           <ElInput v-model="taxNoInfoForm.dutyEuNumber" placeholder="请输入欧盟内部增值税税号"></ElInput>
                        </el-form-item>

                         <el-form-item label="税务副本">
                            <el-upload
                                :show-file-list='false'
                                name='upFile'   
                                :action="actionsUpload"
                                :on-success="bindUploadSuccess"
                                :on-error="bindUploadError"
                                style="display:inline-block;"
                                >
                                <el-button type="success">上传税务副本</el-button>
                            </el-upload>
                            <a class="primary" v-if="taxNoInfoForm.dutyTaxCopy" target="_blank" :href="`${download}?fileId=${taxNoInfoForm.dutyTaxCopy}`"><span class="fa fa-cloud-download"></span> 下载资料</a>
                        </el-form-item>
                    </template>

                    <el-form-item label="EORI Number">
                        <ElInput v-model="taxNoInfoForm.dutyEoriNumber" placeholder="请输入EORI Number"></ElInput>
                    </el-form-item>

                    <el-form-item label="税号生效日期">
                          <el-date-picker
                            v-model="taxNoInfoForm.dutyEffectTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请输入税号生效日期">
                        </el-date-picker>
                    </el-form-item>

                    <p>
                        <ElButton type="primary" @click="updataTaxInfo(1,'taxNoInfoForm')">保存</ElButton>
                        <ElButton type="danger" @click="changeModel(false,'taxNoInfoForm')">取消</ElButton>
                    </p>
                </el-form>
            </div>

            <!-- 税号公司信息 -->
            <div class="block" v-if="[1,2,6,8,9].includes(PAGEDATA.attachStatus)">
                <h5>税号公司信息</h5>
                <p  class="fr" style="margin-top: -18px;"><el-button type="primary"  @click="changeModel(true,'taxNoCompanyInfoForm')">编辑税号公司信息</el-button></p>
                <ul v-if="!taxNoCompanyInfoForm.flag" class="item-container">
                    <li><span>公司名称：</span>{{PAGEDATA.dutyCompany? PAGEDATA.dutyCompany: 'N/A'}}</li>
                    <li><span>法人姓名：</span>{{PAGEDATA.dutyLegalPerson? PAGEDATA.dutyLegalPerson: 'N/A'}}</li>
                    <li><span>店铺预计年销售额：</span>{{PAGEDATA.dutyPreTurnover? PAGEDATA.dutyPreTurnover: 'N/A'}}</li>
                    <li><span>店铺名称：</span>{{PAGEDATA.dutyStoreName? PAGEDATA.dutyStoreName: 'N/A'}}</li>
                    <li><span>店铺地址：</span>{{PAGEDATA.dutyStoreAddress? PAGEDATA.dutyStoreAddress: 'N/A'}}</li>
                </ul>

                <ElForm v-else :model="taxNoCompanyInfoForm" :inline="true"  class="admin-form-inline">
                    <ElFormItem label="公司名称">
                        <el-input v-model="taxNoCompanyInfoForm.dutyCompany" placeholder="请输入公司名称"></el-input>
                    </ElFormItem>
                    <ElFormItem label="法人姓名">
                        <el-input v-model="taxNoCompanyInfoForm.dutyLegalPerson" placeholder="请输入法人姓名"></el-input>
                    </ElFormItem>
                    <ElFormItem label="店铺预计年销售额">
                        <el-input v-model="taxNoCompanyInfoForm.dutyPreTurnover" placeholder="请输入店铺年销售额"></el-input>
                    </ElFormItem>
                    <ElFormItem label="店铺名称">
                        <el-input v-model="taxNoCompanyInfoForm.dutyStoreName" placeholder="请输入店铺名称"></el-input>
                    </ElFormItem>
                    <ElFormItem label="店铺地址">
                        <el-input v-model="taxNoCompanyInfoForm.dutyStoreAddress" placeholder="请输入店铺地址"></el-input>
                    </ElFormItem>
                    <p>
                        <ElButton type="primary" @click="updataTaxInfo(2,'taxNoCompanyInfoForm')">保存</ElButton>
                        <ElButton type="danger" @click="changeModel(false,'taxNoCompanyInfoForm')">取消</ElButton>
                    </p>
                </ElForm>
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
    </div>
</template>

<script>

 import {
     vatApplyStatus,
     AllNationCode
} from '../../../ext/localBase.js';

import { formatTimer } from '../../../utils/common.js';

import AdminModel from './../../../components/adminModal.vue';
import { 
    vatrecordGetByID,
    download,
    upload,
    vatrecordUpdateVatStatus,
    vatrecordGetRemark,
    vatrecordSaveRemark,
    vatrecordUpdateDutyInfo,
    vatrecordUpdateDutyCompany,
    vatrecordUpdateRecordFile
} from './../../../utils/axios/api.js';


export default {
    data(){

        return {
            actionsUpload:upload,
            download:download,
            PAGEDATA:{},
            remarkList:[],

            // 编辑税号信息
            taxNoInfoForm:{
                flag:false,
                id:'',
                dutyServiceNumber:'',
                dutySteuernummer:'',
                dutyEoriNumber:'',
                dutyEuNumber:'',
                dutyLocalNumber:'',
                dutyTaxCopy:'',
                dutyEffectTime:''
            },
            // 编辑税号信息
            taxNoCompanyInfoForm:{
                flag:false,
                id:'',
                dutyCompany:'',
                dutyLegalPerson:'',
                dutyStoreName:'',
                dutyStoreAddress:'',
                dutyPreTurnover:'',
            },

            RemarkModel:{
                flag:false,
                value:'',
            },
            unNormalModel:{
                flag:false,
                value:'',
            },

            STATUS:vatApplyStatus,
            AllNationCode:AllNationCode,
            ING:false,
        }
    },
    created(){
        let OBJ = this.$route.params;
        let m = this.$store.state.Memory.vatApplyDetail;

        if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"vatApply"});
        
        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
            let id = OBJ.id
            this.loadingQuery(id);
        };
       
    },
    methods:{
        loadingQuery(id){
            //查询订单信息
            vatrecordGetByID({id}).then(res=>{
                if(res.code==0){
                    this.PAGEDATA = res.data;

                    for (const key in this.taxNoInfoForm) {
                        if(key != 'flag') {this.taxNoInfoForm[key] = key=='dutyEffectTime' ? this.formatTimer(res.data[key]):  res.data[key]}
                    };

                    for (const key in this.taxNoCompanyInfoForm) {
                        if(key != 'flag') {this.taxNoCompanyInfoForm[key] = res.data[key]}
                    };

                }else{
                    this.$message.error(res.msg);
                }
            });
            //查询备注列表
            this.queryRemarkList(id);
        },
        queryRemarkList(id){
            vatrecordGetRemark({
                type:'1',
                id
            }).then(res=>{
                if(res.code==0){
                    this.remarkList = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        changeModel(bol,target){
            this[target].flag = bol
        },
        //更新税号信息 && 更新税号公司信息
        updataTaxInfo(fn,target){
            if(this.ING) return;
            this.ING = true;
            let fetchFn = fn == 1 ? vatrecordUpdateDutyInfo : vatrecordUpdateDutyCompany
            fetchFn(this[target]).then(res=>{
                this.ING = false;
                if(res.code==0){
                    //修改成功
                    this.$message.success(`修改成功！`);
                    this.loadingQuery(this.PAGEDATA.id);

                    this.changeModel(false,target);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //添加备注确认
        modelConfirm(){
            if(!this.RemarkModel.value) return this.$message.warning(`请输入备注内容！`);
            
            vatrecordSaveRemark({
                type:'1',
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
        //修改订单状态
        changeApplyStatus(msg,status){
            this.$confirm(msg,'提示').then(()=>{
                vatrecordUpdateVatStatus({
                    id:this.PAGEDATA.id,
                    status
                }).then(res=>{
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
        //异常原因录入确认
        unNormalModelConfirm(){

            if(!this.unNormalModel.value) return this.$message.warning(`请输入申请异常原因`);
            
            vatrecordUpdateVatStatus({
                 id:this.PAGEDATA.id,
                 status:2,
                 remark:this.unNormalModel.value
             }).then(res=>{
                 if(res.code==0){
                     //隐藏模态框
                     this.changeModel(false,'unNormalModel');
                     //修改成功
                     this.$message.success(`修改成功！`);
                     //刷新页面
                     this.loadingQuery(this.PAGEDATA.id);
                 }else{
                     this.$message.error(res.msg);
                 }
             });
        },
        uploadFiled(fileAttach){
            vatrecordUpdateRecordFile({
                id:this.PAGEDATA.id,
                fileAttach
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`上传成功！`);
                    this.loadingQuery(this.PAGEDATA.id);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindUploadSuccess(res){
            if(res.code==0){
                this.PAGEDATA.attachStatus==0 && this.uploadFiled(res.data.uuid);
                [1,2,6,8,9].includes(this.PAGEDATA.attachStatus) && (this.taxNoInfoForm.dutyTaxCopy = res.data.uuid);
            }else{
                this.$message.error(res.msg);
            }
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
            if(item.name=='vatApplyDetail'){
                return  this.$store.commit('setModelRecordData',{
                     key:'vatApplyDetail',
                     data:this._data
                 });
            }
        });
    }
}
</script>


<style lang="scss" scoped>
@import './../../../css/element-variables.scss';
form{
    margin-bottom: 20px;
    .el-form-item{
        margin-bottom: 5px;
    }
}
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
            margin-bottom: 15px;
            color: #666;
            min-width: 15%;
            // max-width: 15%;
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
        padding: 5px 0;
        color: $--color-danger;
    }
}
</style>

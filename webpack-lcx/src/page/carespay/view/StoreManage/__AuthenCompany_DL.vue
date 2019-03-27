<template>
 <transition name="fade">
    <div>
        <div class="complate-name">
            <!-- <h2  v-if="INCOM=='ADD_EU'" class="banner-module-title">企业信息</h2> -->
            <div class="complate-name-item clearfix">
                <label class="fl">公司信息</label>
                <div class="fl">
                    <div class="inner-box clearfix">
                         <label class="title">营业执照：</label>
                         <div class="step">
                            <p class="nation" v-if="!isForbidUpload">请确保上传资料文字清晰可见，最大不超过10M，格式限定为jpg、jpeg、png、bmp。</p> 
                            <ul class="clearfix">
                                <li>
                                    <el-upload
                                    :show-file-list='false'
                                    name='upFile'   
                                    :action="fileActive"
                                    :on-success="function(res,file){ return bindUploadSuccess(res,file,'blicenceId') }"
                                    :on-error="bindUploadError"
                                    :disabled="!(auditStatus.scanCertification  == 0 || auditStatus.scanCertification == 3)"  
                                    :before-upload="function(file){ return bindBeforeUpload(file,'blicenceId') }"
                                    >
                                        <label class="l-1" >
                                            <img v-if="form.blicenceId" :src="`/general/download?fileId=`+form.blicenceId" alt=""/>
                                        </label>
                                        <p>
                                            <a v-if="auditStatus.scanCertification==0"  class="cares-color" href="javascript:;">点击上传</a>
                                            <a v-if="auditStatus.scanCertification==1" class="check-ing" href="javascript:;">待审核</a>
                                            <a v-if="auditStatus.scanCertification==2" class="cares-yes" href="javascript:;">审核通过</a>
                                            <a v-if="auditStatus.scanCertification==3" class="no" href="javascript:;">审核失败</a>
                                        </p>
                                    </el-upload>
                                </li>
                                <li>
                                    <div class="uploading-icon" style="height:84px;"> 
                                       <span v-show="IMG_UPLOAD_ING['blicenceId']" class="el-icon-loading cares-color"></span>
                                    </div>
                                    <a 
                                        v-if="!isForbidUpload"  
                                        @click="bindToShowExemple('blicenceId')"
                                        href="javascript:;" 
                                        class="cares-color"> <i class="el-icon-search"></i> 查看示例</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="inner-box clearfix" v-if="!isReEdit" >
                        <label class="title">公司章程：</label>
                        <div class="step">
                            <p><span class="no">（选填）</span>请确保上传资料文字清晰可见，最大不超过10M，格式限定为 .rar .zip .doc .docx .pdf .jpg .jpeg...</p>
                            <p class="download_p" v-if="isReEdit"> <a target="_blank" v-if="form.companyArticleId" :href="`/general/download?fileId=${form.companyArticleId}`">下载公司章程</a> </p>
                            <p>
                                <el-upload
                                :show-file-list='true'
                                name='upFile'   
                                id="companyArticleId"
                                :action="fileActive"
                                :on-error="bindUploadError"
                                :on-exceed="bindUploadExceed"
                                :on-success="function(res,file){ return bindUploadFileSucess(res,file,'companyArticleId') }"
                                :on-remove="function(file, fileList){ return bindUploadFileExceed(file, fileList,'companyArticleId')} "
                                :disabled="!(auditStatus.companyArticleId  == 0 || auditStatus.companyArticleId == 3)" 
                                >
                                    <span 
                                    v-if="auditStatus.companyArticleId  == 0 || auditStatus.companyArticleId == 3"
                                    class="cares-button-primary pain upload-btn">
                                        <i class="el-icon-upload2"></i>
                                        上传文件
                                    </span>
                                </el-upload>
                            </p>

                            <!-- <div>
                                <p>如不上传公司章程，有可能会影响正常使用</p>
                                <p>如有必要我们的客服人员稍后会向您联系索取</p>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="complate-name-item inner clearfix">
                    <label class="fl">法定代表人信息</label>
                    <div class="fl">
                        <!-- <p>请确保上传资料文字清晰可见，最大不超过10M，格式限定为jpg、jpeg、png、bmp。</p> -->
                        <div style="margin-bottom:0" class="inner-box clearfix">
                            <label class="title">证件类型：</label>
                            <div class="step">
                                <p class="text" v-if="isForbidUpload">第二代居民身份证</p>    
                                <p class="nation" v-else><el-radio label="1" name="" value="1">第二代居民身份证</el-radio></p>    
                            </div>
                        </div>
                        
                        <div class="inner-box clearfix">
                            <label class="title">证件照片：</label>
                            <div class="step">
                                <p v-if="!isForbidUpload">请确保上传资料文字清晰可见，最大不超过10M，格式限定为jpg、jpeg、png、bmp。</p>
                                <ul class="clearfix">
                                    <li>
                                        <p>身份证正面</p>
                                        <el-upload
                                        :show-file-list='false'
                                        name='upFile'   
                                        :action="fileActive"
                                        :on-success="function(res,file){ return bindUploadSuccess(res,file,'cardFrontId') }"
                                        :on-error="bindUploadError"
                                        :disabled="!(auditStatus.cardFrontId  == 0 || auditStatus.cardFrontId == 3)"  
                                        :before-upload="function(file){ return bindBeforeUpload(file,'cardFrontId') }"
                                        >
                                            <label class="l-1">
                                                <img  v-if="form.cardFrontId" :src="`/general/download?fileId=`+form.cardFrontId" alt=""/>
                                            </label>
                                            <p>
                                                <a v-if="auditStatus.cardFrontId==0"  class="cares-color" href="javascript:;">点击上传</a>
                                                <a v-if="auditStatus.cardFrontId==1" class="check-ing" href="javascript:;">待审核</a>
                                                <a v-if="auditStatus.cardFrontId==2" class="cares-yes" href="javascript:;">审核通过</a>
                                                <a v-if="auditStatus.cardFrontId==3" class="no" href="javascript:;">审核失败</a>
                                            </p>
                                        </el-upload>
                                    </li>
                                    <li>
                                        <p>身份证反面</p>
                                        <el-upload
                                        :show-file-list='false'
                                        name='upFile'   
                                        :action="fileActive"
                                        :on-success="function(res,file){ return bindUploadSuccess(res,file,'cardAnotherId') }"
                                        :on-error="bindUploadError"
                                        :disabled="!(auditStatus.cardAnotherId  == 0 || auditStatus.cardAnotherId == 3)" 
                                        :before-upload="function(file){ return bindBeforeUpload(file,'cardAnotherId') }" 
                                        >
                                            <label class="l-2">
                                                <img  v-if="form.cardAnotherId" :src="`/general/download?fileId=`+form.cardAnotherId" alt=""/>
                                            </label>
                                            <p>
                                                <a v-if="auditStatus.cardAnotherId==0"  class="cares-color" href="javascript:;">点击上传</a>
                                                <a v-if="auditStatus.cardAnotherId==1" class="check-ing" href="javascript:;">待审核</a>
                                                <a v-if="auditStatus.cardAnotherId==2" class="cares-yes" href="javascript:;">审核通过</a>
                                                <a v-if="auditStatus.cardAnotherId==3" class="no" href="javascript:;">审核失败</a>
                                            </p>
                                        </el-upload>
                                    </li>
                                    <li>
                                        <div class="uploading-icon"> 
                                            <span  
                                                v-show="
                                                    IMG_UPLOAD_ING['cardAnotherId']||
                                                    IMG_UPLOAD_ING['cardFrontId']"
                                            class="el-icon-loading cares-color"></span>
                                        </div>
                                        <a v-if="!isForbidUpload"  
                                             @click="bindToShowExemple('idCark')"
                                        href="javascript:;" class="cares-color"> <i class="el-icon-search"></i> 查看示例</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- 店铺企业信息没有常驻地址 -->
                         <div v-if="this.INCOM != 'ADD_EU'" class="inner-box clearfix">
                             <label class="title">常驻地址：</label>
                            <div>
                                 <el-form :model="form" style="padding-top:8px;">
                                    <p> 
                                        <el-form-item>
                                            <span class="text" v-if="isForbidUpload">中国大陆</span>
                                            <el-radio v-else label="1" value="1">中国大陆</el-radio>
                                        </el-form-item>
                                    </p>
                                    <template v-if="auditStatus.residentialAddress  == 0 || auditStatus.residentialAddress == 3">
                                        <p>
                                            <el-form-item class="select-container" name="provinceCode">
                                                <el-select v-model="form.provinceCode" 
                                                :disabled="!(auditStatus.residentialAddress  == 0 || auditStatus.residentialAddress == 3)"  
                                                name='provinceCode' placeholder="请选择省份">
                                                    <el-option 
                                                    v-for="(item,index) in provinceArr" 
                                                    :key="index"
                                                    :label="item.provinceName"
                                                    :value="item.provinceCode"
                                                    ></el-option>
                                                </el-select>
                                            </el-form-item>

                                            <el-form-item class="fr select-container" name="cityCode">
                                            <el-select v-model="form.cityCode" 
                                            :disabled="!(auditStatus.residentialAddress  == 0 || auditStatus.residentialAddress == 3)"  
                                            name='cityCode' placeholder="请选择城市">
                                                    <el-option 
                                                        v-for="(item,index) in cityArr" 
                                                        :key="index"
                                                        :label="item.cityName"
                                                        :value="item.cityCode"
                                                    ></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </p>
                                        <p> 
                                            <el-form-item name="residentialAddress">
                                                <el-input 
                                                type="text" name="residentialAddress" 
                                                @blur="bidnAddIptBlur" v-model="form.residentialAddress" 
                                                class="add-input" placeholder="填写至街道门牌详细地址"
                                                :disabled="!(auditStatus.residentialAddress  == 0 || auditStatus.residentialAddress == 3)"  
                                                ></el-input>
                                            </el-form-item>
                                        </p>
                                    </template>
                                    <p v-else> <span class="text">{{data.province}}{{data.city}}{{data.residentialAddress}}</span> </p>

                                </el-form>
                            </div>
                        </div>
                    </div>
            </div>
            
            <!-- 股东资料 -->
            <div  v-if="!isReEdit || (isReEdit && form.shareHolderJson.length)" class="complate-name-item inner clearfix">
                <label class="fl">股东资料</label>
                <div class="fl">
                    <p v-if="!isForbidUpload">如有持股比例25%以上的股东，请如实上传，如没有可不传。</p>  
                     <template v-for="(item,value) in form.shareHolderJson"> 
                         <div :key="`t`+value" class="inner-box clearfix" style="margin-bottom:0">
                             <label class="title">证件类型：</label>
                             <div class="fl step" style="line-height:42px;">
                                <span class="text" v-if="isForbidUpload">第二代居民身份证</span>
                                <el-radio v-else label="1" value="1">第二代居民身份证</el-radio>
                             </div>
                         </div>

                        <div  :key="value" class="inner-box clearfix">
                            <label class="title">证件资料：</label>
                            <div class="fl step">
                                <ul class="clearfix">
                                    <li>
                                        <p>身份证正面</p>
                                         <el-upload
                                        :show-file-list='false'
                                        name='upFile'   
                                        :action="fileActive"
                                        :on-success="function(res,file){ return bindUploadSuccess(res,file,'cardFrontId',value) }"
                                        :on-error="bindUploadError"
                                        :disabled="!(holderStatus[value].cardFrontId  == 0 || holderStatus[value].cardFrontId == 3)"  
                                        >
                                            <label class="l-1">
                                                <img v-if="item.cardFrontId" :src="`/general/download?fileId=${item.cardFrontId}`"  alt=""/>
                                            </label>
                                            <p>
                                                <a v-if="holderStatus[value].cardFrontId==0"  class="cares-color" href="javascript:;">点击上传</a>
                                                <a v-if="holderStatus[value].cardFrontId==1" class="check-ing" href="javascript:;">待审核</a>
                                                <a v-if="holderStatus[value].cardFrontId==2" class="cares-yes" href="javascript:;">审核通过</a>
                                                <a v-if="holderStatus[value].cardFrontId==3" class="no" href="javascript:;">审核失败</a>
                                            </p>
                                         </el-upload>
                                    </li>
                                    <li>
                                        <p>身份证反面</p>
                                         <el-upload
                                        :show-file-list='false'
                                        name='upFile'   
                                        :action="fileActive"
                                        :on-success="function(res,file){ return bindUploadSuccess(res,file,'cardAnotherId',value) }"
                                        :on-error="bindUploadError"
                                        :disabled="!(holderStatus[value].cardAnotherId  == 0 || holderStatus[value].cardAnotherId == 3)"  
                                        >
                                            <label class="l-2" >
                                                <img v-if="item.cardAnotherId" :src="`/general/download?fileId=${item.cardAnotherId}`" alt=""/>
                                            </label>
                                            <p>
                                                <a v-if="holderStatus[value].cardAnotherId==0"  class="cares-color" href="javascript:;">点击上传</a>
                                                <a v-if="holderStatus[value].cardAnotherId==1" class="check-ing" href="javascript:;">待审核</a>
                                                <a v-if="holderStatus[value].cardAnotherId==2" class="cares-yes" href="javascript:;">审核通过</a>
                                                <a v-if="holderStatus[value].cardAnotherId==3" class="no" href="javascript:;">审核失败</a>
                                            </p>
                                        </el-upload>
                                    </li>
                                    <li>
                                         <div class="uploading-icon"> 
                                            <!-- <span v-show="IMG_UPLOAD_ING['blicenceId']" class="el-icon-loading cares-color"></span> -->
                                        </div>
                                        <a 
                                        v-if="!isForbidUpload"  
                                        @click="bindToShowExemple('idCark')"
                                        href="javascript:;" class="cares-color"> 
                                            <i class="el-icon-search"></i> 查看示例</a>
                                    </li>
                                    <li v-if="!isForbidUpload" class="delete-button" @click="bindDeleteAnHolder(value)"><i class="el-icon-minus"></i></li>
                                </ul>
                            </div>
                        </div>
                        <div  :key="`n`+value" class="inner-box clearfix">
                                <label class="title">占股比例：</label>
                                <div>
                                    <p>
                                        <el-input 
                                        v-if="(holderStatus[value].shareProportion  == 0 || holderStatus[value].shareProportion == 3)"
                                        type="number" 
                                        max="100" 
                                        class="add-input" 
                                        v-model="form.shareHolderJson[value].shareProportion" 
                                        :disabled="!(holderStatus[value].shareProportion  == 0 || holderStatus[value].shareProportion == 3)" 
                                        placeholder="如45%输入45即可">
                                        </el-input>

                                        <span class="text" v-else>{{form.shareHolderJson[value].shareProportion}}%</span>
                                    </p>
                                </div>
                        </div>
                        <!-- 地址 -->
                        <!-- 店铺的企业资料不需要股东常驻地址 2019-3-21 -->
                        <div  :key="`k`+value" class="inner-box clearfix" v-if="INCOM != 'ADD_EU'">
                                <label class="title">常住地址：</label>
                                <div >
                                    <p> 
                                        <span v-if="isForbidUpload" class="text">中国大陆</span>
                                        <el-radio v-else label="1" value="1">中国大陆</el-radio>
                                        <!-- <el-input type="text" class="nation-input" disabled value="中国大陆"></el-input> -->
                                    </p>
                                    <template v-if="holderStatus[value].address  == 0 || holderStatus[value].address == 3">
                                        <p>
                                            <el-select 
                                            @change="bindShareHoderProvince(value)" 
                                            v-model="form.shareHolderJson[value].provinceCode" 
                                            :disabled="!(holderStatus[value].address  == 0 || holderStatus[value].address == 3)" 
                                            name='provinceCode' 
                                            class="select-container" 
                                            placeholder="请选择省份">
                                                <el-option 
                                                v-for="(item,index) in provinceArr" 
                                                :key="index"
                                                :label="item.provinceName"
                                                :value="item.provinceCode"
                                                ></el-option>
                                            </el-select>

                                            <!-- <el-select v-if="isReEdit"
                                            style="margin-top:5px;" 
                                                class="fr select-container"
                                                :disabled="!(holderStatus[value].address  == 0 || holderStatus[value].address == 3)"
                                                v-model="form.shareHolderJson[value].cityName"   
                                            ></el-select> -->

                                            <el-select 
                                            v-model="form.shareHolderJson[value].cityCode" 
                                            :disabled="!(holderStatus[value].address  == 0 || holderStatus[value].address == 3)" 
                                            name='cityCode' 
                                            class="fr select-container"  
                                            placeholder="请选择城市">
                                                <el-option 
                                                    v-for="(item,index) in form.shareHolderJson[value].cityArr" 
                                                    :key="index"
                                                    :label="item.cityName"
                                                    :value="item.cityCode"
                                                ></el-option>
                                            </el-select>
                                        </p>
                                        <p style="margin-top:8px;"> 
                                            <el-input 
                                            type="text" 
                                            name="address" 
                                            v-model="form.shareHolderJson[value].address" 
                                            :disabled="!(holderStatus[value].address  == 0 || holderStatus[value].address == 3)" 
                                            class="add-input" 
                                            placeholder="填写至街道门牌详细地址"></el-input>
                                        </p>
                                    </template>
                                    <p v-else>
                                        <span class="text">
                                            {{data.shoreHolderRespVoList[value].provinceName}}{{data.shoreHolderRespVoList[value].cityName}}{{data.shoreHolderRespVoList[value].address}}
                                        </span>
                                    </p>
                                </div>
                        </div>
                    </template>
                    <p v-if="!isForbidUpload" class="add-button" @click="bindAddAnHolder"><i class="el-icon-plus"></i></p>
                </div>
            </div>
            <!-- 股东资料上传end -->

            <p class="btn">
                <template v-if="isReEdit">
                    <span v-if="!isForbidUpload"  @click="bindConfirmNext" class="cares-button-primary">确认提交</span>
                </template>
                <template v-else>
                    <!-- <span @click="bindPreButton" class="cares-button-primary pain">上一步</span> -->
                    <span @click="bindConfirmNext" class="cares-button-primary">确认提交</span>
                </template>
            </p>
        </div>

        <!-- 查看示例的弹框 -->
        <FadeModel v-model="exempleModel.flag">
            <h3>图片示例</h3>
            <p class="warning-notice">请确保上传资料文字清晰可见，最大不超过10M，格式限定为jpg、jpeg、png、bmp。</p>
            <div v-if="exempleModel.type=='blicenceId'">
                <p class="pic-title">营业执照示例：</p>
                <img style="width:60%;" src="./../../../../images/carepay/营业执照.jpg" alt="营业执照">
            </div>
            <div class="id-cark" v-if="exempleModel.type=='idCark'">
                <p class="pic-title">身份证示例：</p>
                <ul>
                    <li>
                        <p>身份证正面</p>
                        <img src="./../../../../images/carepay/id-s.png" alt="">
                    </li>
                    <li>
                        <p>身份证背面</p>
                        <img src="./../../../../images/carepay/id-n.png" alt="">
                    </li>
                </ul>
            </div>
        </FadeModel>
    </div>
 </transition>
</template>

<script>

    import '../../../../css/carespay/complete.scss';

    import $ from 'jquery';

    import VERICATION from './../../../../js/verification.js';

    import FadeModel from './../../../../components/fadeModel.vue';

    import {
        uploadefile,    //文件上传的接口
        personInfoAdd,  //添加实名认证
        queryAccountList,
        updateEnterprise,   //欧洲站 企业实名认证信息
        addEnterprise,   //欧洲站 企业实名认证信息
        updatePersonInfo// 更新个人信息
    } from './../../../../js/api.js';

      import {
        queryCustomerInfo,                              //客户信息
        queryProvinceList,                              //省份列表
        queryCityData,                                  //城市数据
    } from '../../utils/localbase.js';

    export default {
        data(){
            return{
                fileActive:uploadefile,
                provinceArr:[],
                cityArr:[],
                form:{
                    businessLocation:'CHN',             //当前证件类型 香港企业还是大陆企业
                    nationality:'CHN', 
                    phoneNo:'',                 //当前注册的手机号
                    cardFrontId:'',             //身份证正面id
                    cardAnotherId:'',           //身份证反面id
                    blicenceId:'',              //营业执照
                    provinceCode:'',            //省
                    cityCode:'',                //市
                    residentialAddress:'',                 //详细地址
                    type:'2',
                    shareHolderJson:[],         //股东列表
                    companyArticleId:'',        //公司章程的ID
                },
                uploadRules:false,              //上不上传公司章程
                AjaxIng:false,

                //2018-12-5   欧洲站
                //审核状态 : 0. 可以直接上传  1.待审核  2.审核通过   3.审核失败
                auditStatus:{
                    cardAnotherId:0,         //身份证反面审核状态
                    cardFrontId:0,           //身份证正面审核状态
                    scanCertification:0,            //营业执照审核状态
                    residentialAddress:0,           //常駐地址 
                    companyArticleId:0,           //公司章程 
                    provinceCode:0,            //省
                    cityCode:0,                //市
                },
                //股东的审核状态
                holderStatus:[],
                isForbidUpload:false,                //是否禁止上传  false 可以上传，表示实名失败，需要重新上传
                isReEdit:false,
                isAE:false,


                IMG_UPLOAD_ING:{
                    blicenceId:false,
                    cardFrontId:false,
                    cardAnotherId:false,
                },
                exempleModel:{
                    flag:false,
                    type:''
                }
            }
        },
        props:["INCOM","id","data",'edit','AfterJumpFn','ISADD'], 
        //edit  强行将当前页面变成可编辑
        created() {
            this.form.type = this.$route.query.type || "2";                            //个人还是公司
            // this.form.nationality = "CHN"

            Promise.all([
                queryCustomerInfo(),
                queryProvinceList()
            ]).then(res=>{
                let [customerInfo,province] = res;

                this.form.phoneNo = customerInfo.phoneNo         //当前手机号
                this.provinceArr = province                     //省份
            });

            this.NoAuthentication();

        },
        methods:{
            //非实名认证执行函数
            NoAuthentication(){
                //2018-11-28  添加亚马逊欧洲站
                if( ['ADD_EU','R_NAME'].indexOf(this.INCOM) > -1){
                    //Object.keys(this.data).length 表示有回显的数据传入
                    if(Object.keys(this.data).length>0){

                        (!this.edit)  && (this.isReEdit=true);
                        this.edit && (this.isAE=true,this.isReEdit=false);

                        this.enterpriseInfo(this.data);
                    }else{
                        this.reset();
                    }
                };
            },
            //2018-12-5 欧洲站企业信息绑定的回显
            enterpriseInfo(res){
                for (const key in this.form) {
                    if(['type'].indexOf(key)<0){
                        this.form[key] = res[key] || "";
                    };
                };

                this.form.shareHolderJson = [];

                 //2.法人审核状态
                let arr = ['cardFrontId','cardAnotherId','scanCertification','residentialAddress','companyArticleId']
                !this.isAE && res.auditInfoVoList.forEach(item=>{
                    if(arr.indexOf(item.auditField)>-1){
                        this.auditStatus[item.auditField] = item.auditStatus;
                    }
                });
                //申请人省份和城市的审核状态
                !this.isAE && (this.auditStatus['provinceCode'] = 1);
                !this.isAE && (this.auditStatus['cityCode'] = 1);


                //3.股东的审核状态
                res.shoreHolderRespVoList && res.shoreHolderRespVoList.length && res.shoreHolderRespVoList.forEach(item=>{
                    let o = {};
                    //每个股东的审核状态
                    item.auditInfoVoList.forEach(innerItem=>{
                        //股东身份证正面
                        (innerItem.auditField == "cardFrontId") && (o["cardFrontId"] = this.isAE ? 0 :innerItem.auditStatus);
                        //股东身份证反面
                        (innerItem.auditField == "cardAnotherId") && (o["cardAnotherId"] = this.isAE ? 0 :innerItem.auditStatus);
                        //股东详细地址
                        (innerItem.auditField == "address") && (o["address"] = this.isAE ? 0 :innerItem.auditStatus);
                        //股东省份
                        (innerItem.auditField == "provinceCode") && (o["provinceCode"] = this.isAE ? 0 :innerItem.auditStatus);
                        //股东城市
                        (innerItem.auditField == "cityCode") && (o["cityCode"] = this.isAE ? 0 :innerItem.auditStatus);
                        //股东股份
                        (innerItem.auditField == "shareProportion") && (o["shareProportion"] = this.isAE ? 0 :innerItem.auditStatus);
                        
                    });
                    //将状态添加进去
                    this.holderStatus.push(o);
                     //2018-12-18  股东信息的城市选择
                    let code = item.provinceCode;
                    // _this.$set(_this.cashCount,item.id,'');s
                    queryCityData(code).then(res=>{
                        this.$set(item,"cityArr",res)
                    });

                    this.form.shareHolderJson.push(item);
                });

                !this.isAE && (this.isForbidUpload = (res.status == 3 ? false : true));    //审核状态如果为3（失败）的时候可以上传图片

            },
            reset(){
                let not = ['businessLocation','nationality','type',"shareHolderJson"];
                for (const key in this.form) {
                    if(not.indexOf(key)<0){ this.form[key]=""; }
                };
                this.form['shareHolderJson'] = [];
                this.isReEdit = false;
            },
            bindConfirmNext(){
                //1. 验证必填
                let must = ['blicenceId','cardFrontId','cardAnotherId'];
                let notStoreEnterprise = ['provinceCode','cityCode','residentialAddress'];

                this.INCOM != 'ADD_EU' && (must = must.concat(notStoreEnterprise)); //2019-3-21  店铺企业资料没有居住地址

                 for(let i =0; i<must.length;i++){
                    if(!VERICATION(must[i],this.form[must[i]])) return;
                }

                //1.2. 如果有股东 -- 验证股东信息的完整性
                if(this.form.shareHolderJson.length){
                    for (let i = 0; i < this.form.shareHolderJson.length; i++) {
                        let holderMust = ["cardFrontId","cardAnotherId","shareProportion"];
                        let isNotStore = ['provinceCode','cityCode','address'];

                        this.INCOM != 'ADD_EU' && (holderMust = holderMust.concat(isNotStore)); //2019-3-21  店铺企业资料没有居住地址

                        //验证股东的必填
                        for(let j =0; j<holderMust.length;j++){
                            if(!VERICATION(holderMust[j],this.form.shareHolderJson[i][holderMust[j]],'HOLDER')) return;
                        }
                    }
                }

                //2. 删除多余数据
                 this.form.type = 2;
                let data = Object.assign({},this.form);

                for(let i = 0 ; i<data.shareHolderJson.length; i++){
                   delete  data.shareHolderJson[i].cityArr
                }

                data.shareHolderJson = JSON.stringify(data.shareHolderJson);

                //3. 进行网络请求
                // console.log(data);
                this.locaPageAjax(data);

            },
            //网络请求
            locaPageAjax(data){
                if(this.AjaxIng) return;
                this.AjaxIng = true;

                switch(this.INCOM){
                    case 'ADD_EU':
                    {
                        //2018-11-28  新增欧洲站完善店铺信息
                        data["storeId"]=this.id;    //完善店铺的ID

                        //编辑
                        !this.ISADD && updateEnterprise(data).then(res=>{
                            this.AjaxIng = false;
                            if(res.code == 0){
                                this.$Message.success(res.msg);
                                //跳转到店铺管理页面
                                this.AfterJumpFn();
                            }else{
                                this.$Message.error(res.msg);
                            }
                        });
                        //添加
                        this.ISADD && addEnterprise(data).then(res=>{
                            this.AjaxIng = false;
                            if(res.code == 0){
                                this.$Message.success(res.msg);
                                //跳转到成功添加店铺的页面
                                this.AfterJumpFn();
                            }else{
                                this.$Message.error(res.msg);
                            }
                        });
                    }
                    break;
                    case 'R_NAME':
                    {   //重新编辑实名信息
                         updatePersonInfo(data).then(res=>{
                            this.AjaxIng = false;
                            if(res.code==0){
                                 //清空当前实名认证的信息
                                this.$store.commit('setBaseDate',{
                                    key:`personInfo`,
                                    data:null
                                });
                                this.AfterJumpFn();
                            }else{
                                this.$Message.error(res.msg);
                            }
                        });
                    }
                    break;
                    default:
                    {
                        //3. 添加实名认证
                        personInfoAdd(data)
                        .then(res=>{
                            this.AjaxIng = false;
                            if(res.code==0){
                                this.$emit('watchIsFillDone',true); //是否已经完成实名认证
                                //1.请求看是否有添加了提现账户
                                this.AfterJumpFn();
                            }else{
                                this.$Message.error(res.msg)
                            }

                        })
                    }
                    break;
                }
            },
            // 点击添加一个股东
            bindAddAnHolder(){
                if(this.form.shareHolderJson.length>=4) return this.$Message.warning(`最多只能添加四个股东！`);
                let shareHolderJson = this.INCOM == 'ADD_EU' ? 
                {
                    "cardFrontId":"",
                    "id":"",
                    "cardAnotherId":"",
                    "shareProportion":"",
                } :{
                    "cardFrontId":"",
                    "id":"",
                    "cardAnotherId":"",
                    "shareProportion":"",

                    "provinceCode":"",
                    "cityCode":"",
                    "address":"",
                    "nationality":"CHN",
                    "cityArr":[],
                };
                this.form.shareHolderJson.push(shareHolderJson);
                //2018-12-5 股东的审核状态
                let holderStatus = this.INCOM == 'ADD_EU' ? 
                {
                    "cardAnotherId":"0",
                    "cardFrontId":"0",
                    "shareProportion":"0",
                }:{
                    "cardAnotherId":"0",
                    "cardFrontId":"0",
                    "shareProportion":"0",

                    "provinceCode":"0",
                    "cityCode":"0",
                    "address":"0",
                } 
                this.holderStatus.push(holderStatus);
            },
            //点击删除一个股东
            bindDeleteAnHolder(val){
                this.form.shareHolderJson.splice(val,1);
            },
            //股东城市选择
            bindShareHoderProvince(val){
                // console.log(val);
                let holderArr = this.form.shareHolderJson, 
                    code = holderArr[val].provinceCode;

                //1. 将对应的股东的城市变为空
                    holderArr[val].cityCode= ``;
                //2.请求对应股东的城市数据
                    queryCityData(code).then(res=>{
                        holderArr[val].cityArr = res;
                    });
            },


            //详细地址失去焦点的时候触发的事件
            bidnAddIptBlur(){
                VERICATION('residentialAddress',this.form['residentialAddress']);
            },
            bindBeforeUpload(file,name){
                this.IMG_UPLOAD_ING[name] = !this.IMG_UPLOAD_ING[name];
            },
            //上传成功
            bindUploadSuccess(res,file,name,index){
                index === undefined && (this.IMG_UPLOAD_ING[name] = !this.IMG_UPLOAD_ING[name]);
                if(res.code==0){
                    //判断给股东回显还是法人
                    if(index === undefined){
                        // document.getElementById(name).src = file.url;
                        this.form[name] = res.data.uuid;
                    }else{
                    //    document.getElementById(`${name}${index}`).src = file.url;
                        this.form.shareHolderJson[index][name] = res.data.uuid;
                    }

                }else{
                    this.$Message.error(res.msg);
                }
            },
             //2018-11-15 商场商户登记证为文件类型
            bindUploadFileSucess(res,file,name){
                //清掉当前上传的
                if(res.code==0){
                   $(`#${name}`).find('.el-upload-list li').length>1 && $(`#${name}`).find('.el-upload-list li').eq(0).hide(500,function(){ $(this).remove() });
                    this.form[name] = res.data.uuid;
                }else{
                    this.$Message.error(res.msg);
                }
            },
           //2018-11-15 移除上传的列表
            bindUploadFileExceed(file,fileList,name){
                this.form[name] = "";
            },
            //上传失败的
            bindUploadError(){
                 this.$Message.error(`上传失败，请重新上传！`);
            },
            //上传公司章程
            bindUploadRulesSuccess(res,file){
                if(res.code==0){
                    this.form.companyArticleId = res.data.uuid
                }else{
                     this.$Message.error(res.msg);
                }
            },
            //删除公司章程
            bindRemoveUploadFile(file){
                this.form.companyArticleId = ``;
            },
            //公司超出一份
            bindUploadExceed(file){
                this.$Message.error(`公司章程只允许上传一份`);
            },

            //弹出上传示例
            bindToShowExemple(name){
                this.exempleModel.flag = true;
                this.exempleModel.type = name;
            },


        },
        watch:{
            //监听省份的选择发生变化
            "form.provinceCode"(n,o){
                //请求城市接口
                queryCityData(n).then(res=>{
                    this.cityArr = res;
                });
                 if(!o) return;
                this.form.cityCode='';//城市回到没选择的状态
            },
            "data"(){
                this.NoAuthentication();
            },
        },
        components:{
            FadeModel
        } 
    }
</script>

<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';
    .upload-btn{
        padding: 0 20px;
    }

    .download_p{
        height: 40px;
        line-height: 40px;
        a{
            color: $--color-primary-one;
            text-decoration: underline;
        }
    }

      .check-ing{
        color: #999;
    }

    .pic-title{
        padding-top: 20px;
        color: #666;
    }

    .id-cark{
        ul{
            li{
                display: inline-block;
                margin-right: 20px;
                p{
                    line-height: 30px;
                    color: #aaa;
                }
            }
        }
    }
</style>


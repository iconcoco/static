<template>
    <div class="fadeIn">
       <div class="complate-name">
           <!-- <h2  v-if="INCOM=='ADD_EU'" class="banner-module-title">企业信息</h2> -->
            <div class="complate-name-item clearfix">
                <label class="fl">公司信息</label>
                <div class="fl">
                    <div class="inner-box clearfix">
                        <label class="title">商业登记证：</label>
                         <div class="step">
                             <p v-if="form.status==3 || form.status==0">请确保上传资料文字清晰可见，最大不超过10M，格式限定为jpg、jpeg、png、bmp。</p>
                             <ul class="clearfix">
                                <li>
                                    <!-- <p>商业登记证</p> :limit="1"-->
                                    <!-- <p class="download_p" v-if="isReEdit || (isAE && form.hkBizCertification)"> <a target="_blank" :href="`${downloadfile}${form.hkBizCertification}`">下载商业登记证</a> </p> -->
                                    <el-upload
                                    :show-file-list='false'
                                    name='upFile'
                                    id="hkBizCertification"   
                                    :action="fileActive"
                                    :on-success="function(res,file){ return bindUploadFileSucess(res,file,'hkBizCertification') }"
                                    :on-remove="function(file, fileList){ return bindUploadFileExceed(file, fileList,'hkBizCertification')} "
                                    :on-error="bindUploadError"
                                    :disabled="!(auditStatus.hkBizCertification==3 || auditStatus.hkBizCertification==0)"  
                                    :before-upload="function(file){ return bindBeforeUpload(file,'hkBizCertification') }" 
                                    >
                                        <!-- <span
                                        v-if="auditStatus.hkBizCertification==3 || auditStatus.hkBizCertification==0"
                                        class="cares-button-primary pain"
                                        >上传商业登记证</span> -->

                                        <label class="l-1" >
                                            <img v-if="isReEdit || form.hkBizCertification" :src="`${downloadfile}`+form.hkBizCertification" alt=""/>
                                        </label>
                                        <p>
                                            <a v-if="auditStatus.hkBizCertification==0" class="cares-color" href="javascript:;">点击上传</a>
                                            <a v-if="auditStatus.hkBizCertification==1" class="check-ing" href="javascript:;">待审核</a>
                                            <a v-if="auditStatus.hkBizCertification==2" class="cares-yes" href="javascript:;">审核通过</a>
                                            <a v-if="auditStatus.hkBizCertification==3" class="no" href="javascript:;">审核失败</a>
                                        </p>
                                    </el-upload>
                                </li>
                                <li>
                                    <div class="uploading-icon" style="height:84px;"> 
                                       <span v-show="IMG_UPLOAD_ING['hkBizCertification']" class="el-icon-loading cares-color"></span>
                                    </div>
                                    <a 
                                        v-if="!isReEdit || (isReEdit && form.status==3)"  
                                        @click="bindToShowExemple('hkBizCertification')"
                                        href="javascript:;" 
                                        class="cares-color"> <i class="el-icon-search"></i> 查看示例</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="inner-box clearfix">
                        <label class="title">公司注册证书：</label>
                        <div class="step">
                            <p v-if="form.status==3 || form.status==0">请确保上传资料文字清晰可见，最大不超过10M，格式限定为jpg、jpeg、png、bmp。</p>
                             <ul class="clearfix">
                                <li>
                                    <!-- <p>公司注册证</p> -->
                                    <!-- <p class="download_p" v-if="isReEdit || (isAE && form.hkRegisterCertification)"><a target="_blank" :href="`${downloadfile}${form.hkRegisterCertification}`">下载公司注册证书</a></p> -->
                                    <el-upload
                                    :show-file-list='false'
                                    name='upFile'   
                                    :action="fileActive"
                                    id="hkRegisterCertification"
                                    :on-success="function(res,file){ return bindUploadFileSucess(res,file,'hkRegisterCertification') }"
                                    :on-remove="function(file, fileList){ return bindUploadFileExceed(file, fileList,'hkRegisterCertification')} "
                                    :on-error="bindUploadError"
                                    :disabled="!(auditStatus.hkRegisterCertification==3||auditStatus.hkRegisterCertification == 0)"  
                                    :before-upload="function(file){ return bindBeforeUpload(file,'hkRegisterCertification') }" 
                                    >
                                        <!-- <span
                                        v-if="auditStatus.hkRegisterCertification==3||auditStatus.hkRegisterCertification == 0"
                                        class="cares-button-primary pain"
                                        >上传公司注册证</span> -->
                                        
                                        <label class="l-1" >
                                            <img v-if="isReEdit || form.hkRegisterCertification" :src="`${downloadfile}`+form.hkRegisterCertification" alt=""/>
                                        </label>
                                        <p>
                                            <a v-if="auditStatus.hkRegisterCertification==0" class="cares-color" href="javascript:;">点击上传</a>
                                            <a v-if="auditStatus.hkRegisterCertification==1" class="check-ing" href="javascript:;">待审核</a>
                                            <a v-if="auditStatus.hkRegisterCertification==2" class="cares-yes" href="javascript:;">审核通过</a>
                                            <a v-if="auditStatus.hkRegisterCertification==3" class="no" href="javascript:;">审核失败</a>
                                        </p>
                                    </el-upload>
                                </li>
                                <li>
                                    <div class="uploading-icon" style="height:84px;"> 
                                       <span v-show="IMG_UPLOAD_ING['hkRegisterCertification']" class="el-icon-loading cares-color"></span>
                                    </div>
                                    <a 
                                        v-if="!isReEdit || (isReEdit && form.status==3)"   
                                        @click="bindToShowExemple('hkRegisterCertification')"
                                        href="javascript:;" 
                                        class="cares-color"> <i class="el-icon-search"></i> 查看示例</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="inner-box clearfix">
                        <label class="title">法团成立表格：</label>
                        <div class="step">
                            <p v-if="form.status==3 || form.status==0">请确保上传资料文字清晰可见，多张图片请打包成一个压缩包，文件不超过10MB，格式不限</p>
                            <ul class="clearfix">
                                <li>
                                    <!-- <p>法团成立表格</p> -->
                                    <p class="download_p" v-if="isReEdit || (isAE && form.hkTableCertification)"><a target="_blank" :href="`${downloadfile}${form.hkTableCertification}`">下载法团成立表格</a></p>
                                    <el-upload
                                    :show-file-list='true'
                                    name='upFile'   
                                    :action="fileActive"
                                    id="hkTableCertification"
                                    :on-success="function(res,file){ return bindUploadFileSucess(res,file,'hkTableCertification') }"
                                    :on-remove="function(file, fileList){ return bindUploadFileExceed(file, fileList,'hkTableCertification')} "
                                    :on-error="bindUploadError"
                                    :disabled="!(auditStatus.hkTableCertification==3||auditStatus.hkTableCertification == 0)"  
                                    :before-upload="function(file){ return bindBeforeUpload(file,'hkTableCertification') }" 
                                    >
                                        <span
                                        v-if="auditStatus.hkTableCertification==3||auditStatus.hkTableCertification == 0"
                                        class="cares-button-primary pain"
                                        >上传法团成立表格</span>
                                        <!-- <label class="l-1" >
                                            <img id="hkTableCertification"  v-if="form.hkTableCertification" :src="`${downloadfile}${form.hkTableCertification}`" alt=""/>
                                        </label>
                                        <p><a  class="cares-color" href="javascript:;">点击上传</a></p> -->
                                        <p>
                                            <a v-if="auditStatus.hkTableCertification==1" class="check-ing" href="javascript:;">待审核</a>
                                            <a v-if="auditStatus.hkTableCertification==2" class="cares-yes" href="javascript:;">审核通过</a>
                                            <a v-if="auditStatus.hkTableCertification==3" class="no" href="javascript:;">审核失败</a>
                                        </p>
                                    </el-upload>
                                </li>
                                <li>
                                    <span v-show="IMG_UPLOAD_ING['hkTableCertification']" class="el-icon-loading cares-color"></span>
                                    <a 
                                        v-if="!isReEdit || (isReEdit && form.status==3)"  
                                        @click="bindToShowExemple('hkTableCertification')"
                                        href="javascript:;" 
                                        class="cares-color"> <i class="el-icon-search"></i> 查看示例</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                </div>
            </div>

            <div class="complate-name-item inner clearfix">
                <label class="fl">董事信息</label>
                <div class="fl step">
                    <!-- 董事证件类型 -->
                    <div class="inner-box clearfix" style="margin-bottom:0px;">
                        <label class="title">董事证件类型：</label>
                        <div class="step" style="line-height:42px;">
                             <el-select 
                                v-if="form.status==3 || form.status==0"
                                :disabled="!(auditStatus.hkDirectorIdcardType ==3 || auditStatus.hkDirectorIdcardType ==0)" 
                                v-model="form.hkDirectorIdcardType" placeholder="请选择董事证件类型">
                                <el-option :value="1" label="第二代居民身份证"></el-option>
                                <el-option :value="2" label="护照"></el-option>
                                <el-option :value="3" label="香港永久性居民身份证"></el-option>
                            </el-select>
                            <span v-else class="text">
                                <template v-if="form.hkDirectorIdcardType==1">第二代居民身份证</template>
                                <template v-if="form.hkDirectorIdcardType==2">护照</template>
                                <template v-if="form.hkDirectorIdcardType==3">香港永久性居民身份证</template>
                            </span>
                        </div>
                    </div>
                    <!-- 董事证件照片 -->
                    <div class="inner-box clearfix">
                        <label class="title">董事证件照片：</label>
                        <div class="step">
                            <p v-if="form.status==3 || form.status==0">请确认信息无误，证件图片清晰可见，图片支持jpg、png、jpeg，文件不超过10MB。</p>
                            <ul>
                                <li>
                                    <p>
                                        <template v-if="form.hkDirectorIdcardType==1">
                                            身份证正面
                                        </template>

                                        <template v-else-if="form.hkDirectorIdcardType==2">
                                            护照信息页
                                        </template>

                                        <template v-else>
                                            永久身份证正面照
                                        </template>
                                    </p>
                                     <el-upload
                                    :show-file-list='false'
                                    name='upFile'   
                                    :action="fileActive"
                                    :on-success="function(res,file){ return bindUploadSuccess(res,file,'cardFrontId') }"
                                    :on-error="bindUploadError"
                                    :disabled="!(auditStatus.cardFrontId==3 || auditStatus.cardFrontId==0)"  
                                    :before-upload="function(file){ return bindBeforeUpload(file,'cardFrontId') }" 
                                    >
                                        <label class="l-1">
                                            <img id="cardFrontId" v-if="form.cardFrontId" :src="`${downloadfile}${form.cardFrontId}`"  alt=""/>
                                        </label>
                                        <p>
                                            <a v-if="auditStatus.cardFrontId==0" class="cares-color" href="javascript:;">点击上传</a>
                                            <a v-if="auditStatus.cardFrontId==1" class="check-ing" href="javascript:;">待审核</a>
                                            <a v-if="auditStatus.cardFrontId==2" class="cares-yes" href="javascript:;">审核通过</a>
                                            <a v-if="auditStatus.cardFrontId==3" class="no" href="javascript:;">审核失败</a>
                                        </p>
                                     </el-upload>
                                </li>

                                <li v-if="form.hkDirectorIdcardType!=2">
                                    <p>{{ form.hkDirectorIdcardType==1 ? `身份证反面照`:`永久身份证反面照`}}</p>
                                     <el-upload
                                    :show-file-list='false'
                                    name='upFile'   
                                    :action="fileActive"
                                    :on-success="function(res,file){ return bindUploadSuccess(res,file,'cardAnotherId') }"
                                    :on-error="bindUploadError"
                                    :disabled="!(auditStatus.cardAnotherId==3 || auditStatus.cardAnotherId==0)"  
                                    :before-upload="function(file){ return bindBeforeUpload(file,'cardAnotherId') }" 
                                    >
                                        <label class="l-1">
                                            <img id="cardAnotherId" v-if="form.cardAnotherId" :src="`${downloadfile}${form.cardAnotherId}`" alt=""/>
                                        </label>
                                        <p>
                                            <a v-if="auditStatus.cardAnotherId==0" class="cares-color" href="javascript:;">点击上传</a>
                                            <a v-if="auditStatus.cardAnotherId==1" class="check-ing" href="javascript:;">待审核</a>
                                            <a v-if="auditStatus.cardAnotherId==2" class="cares-yes" href="javascript:;">审核通过</a>
                                            <a v-if="auditStatus.cardAnotherId==3" class="no" href="javascript:;">审核失败</a>    
                                        </p> 
                                    </el-upload>
                                </li>

                                <li style="padding-top:15px;">
                                    <div class="uploading-icon" style="height:84px;"> 
                                       <span 
                                        v-show="
                                            IMG_UPLOAD_ING['cardAnotherId']||
                                            IMG_UPLOAD_ING['cardFrontId']"
                                        class="el-icon-loading cares-color"></span>
                                    </div>
                                    <a 
                                        v-if="!isReEdit || (isReEdit && form.status==3)"   
                                        @click="bindToShowExemple('cardFrontId')"
                                        href="javascript:;" 
                                        class="cares-color"> <i class="el-icon-search"></i> 查看示例</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- 董事常驻地址 -->
                    <div class="inner-box clearfix" v-if="INCOM != 'ADD_EU'">
                        <label class="title">董事常住地址：</label>
                        <div class="step">
                            <el-form :model="form" style="padding-top:8px;">
                                <p style="margin-bottom:20px;"> 
                                    <template v-if="auditStatus.residentialAddress  == 0 || auditStatus.residentialAddress == 3">
                                        <el-radio @change="(value)=>{ return holderNationalityChange(value,-1) }" v-model="form.nationality" label="CHN">中国大陆</el-radio>
                                        <el-radio @change="(value)=>{ return holderNationalityChange(value,-1) }" v-model="form.nationality" label="HKG">中国香港</el-radio>
                                    </template>
                                    <template v-else>
                                        <span class="text">{{form.nationality=='CHN'?'中国大陆':'中国香港'}}</span>
                                    </template>
                                </p>
                                <template v-if="auditStatus.residentialAddress  == 0 || auditStatus.residentialAddress == 3">
                                    <p v-if="form.nationality=='CHN'">
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
                                            @blur="bidnAddIptBlur"
                                            v-model="form.residentialAddress" 
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
            <div v-if="!isReEdit || (isReEdit && form.shareHolderJson.length)" class="complate-name-item inner clearfix">
                <label class="fl">股东资料</label>
                <div class="fl">
                    <p v-if="form.status==3 || form.status==0">如有持股比例25%以上的股东，请如实上传，如没有可不传。</p>  
                    <!-- begin -->
                    <template v-for="(item,value) in form.shareHolderJson">
                        <!-- 证件类型 -->
                        <div :key="value" class="inner-box parner-id-info clearfix">
                            <label class="title">股东证件类型：</label>
                            <div>
                                <p>
                                    <el-select 
                                    v-if="(holderStatus[value].cardType==3||holderStatus[value].cardType==0)"
                                    :disabled="holderStatus[value] && !(holderStatus[value].cardType==3||holderStatus[value].cardType==0)"
                                    @change="bindShareIdcardType(value)" class="add-input" v-model="form.shareHolderJson[value].cardType" placeholder="请选择董事证件类型">
                                        <el-option :value="1" label="第二代居民身份证"></el-option>
                                        <el-option :value="2" label="护照"></el-option>
                                        <el-option :value="3" label="香港永久性居民身份证"></el-option>
                                    </el-select>
                                    <span v-else class="text">
                                        <template v-if="form.shareHolderJson[value].cardType==1">第二代居民身份证</template>
                                        <template v-if="form.shareHolderJson[value].cardType==2">护照</template>
                                        <template v-if="form.shareHolderJson[value].cardType==3">香港永久性居民身份证</template>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <!-- 上传的证件照 -->
                        <div :key="`n`+value" class="inner-box clearfix">
                            <label class="title">股东证件照片：</label>
                            <div class="fl step">
                                <p v-if="form.status==3 || form.status==0">请确认信息无误，证件图片清晰可见，图片支持jpg、png、jpeg，文件不超过10MB。</p>
                                <ul class="clearfix">
                                    <li>
                                        <p>
                                            <template v-if="form.shareHolderJson[value].cardType==1">
                                                身份证正面照
                                            </template>

                                            <template v-else-if="form.shareHolderJson[value].cardType==2">
                                                护照信息页
                                            </template>

                                            <template v-else>
                                                永久身份证正面照
                                            </template>
                                        </p>
                                         <el-upload
                                        :show-file-list='false'
                                        name='upFile'   
                                        :action="fileActive"
                                        :on-success="function(res,file){ return bindUploadSuccess(res,file,'cardFrontId',value) }"
                                        :on-error="bindUploadError"
                                        :disabled="holderStatus[value] && !(holderStatus[value].cardFrontId==3||holderStatus[value].cardFrontId==0)"  
                                        >
                                            <label class="l-1">
                                                <img :id="`cardFrontId${value}`" v-if="form.shareHolderJson[value].cardFrontId" :src="`${downloadfile}${form.shareHolderJson[value].cardFrontId}`" alt=""/>
                                            </label>
                                            <p>
                                                <a v-if="holderStatus[value] && holderStatus[value].cardFrontId==0" class="cares-color" href="javascript:;">点击上传</a>
                                                <a v-if="holderStatus[value] && holderStatus[value].cardFrontId==1" class="check-ing" href="javascript:;">待审核</a>
                                                <a v-if="holderStatus[value] && holderStatus[value].cardFrontId==2" class="cares-yes" href="javascript:;">审核通过</a>
                                                <a v-if="holderStatus[value] && holderStatus[value].cardFrontId==3" class="no" href="javascript:;">审核失败</a>
                                            </p>
                                         </el-upload>
                                    </li>

                                    <li v-if="form.shareHolderJson[value].cardType!=2">
                                        <p>{{ form.shareHolderJson[value].cardType==1?`身份证反面照`:`永久身份证反面照`}}</p>
                                        <el-upload
                                        :show-file-list='false'
                                        name='upFile'   
                                        :action="fileActive"
                                        :on-success="function(res,file){ return bindUploadSuccess(res,file,'cardAnotherId',value) }"
                                        :on-error="bindUploadError"
                                        :disabled="holderStatus[value] && !(holderStatus[value].cardAnotherId==3||holderStatus[value].cardAnotherId==0)"  
                                        >
                                            <label class="l-1">
                                                <img :id="`cardAnotherId${value}`" v-if="form.shareHolderJson[value].cardAnotherId" :src="`${downloadfile}${form.shareHolderJson[value].cardAnotherId}`" alt=""/>
                                            </label>
                                            <p>
                                                <a v-if="holderStatus[value] && holderStatus[value].cardAnotherId==0" class="cares-color" href="javascript:;">点击上传</a>
                                                <a v-if="holderStatus[value] && holderStatus[value].cardAnotherId==1" class="check-ing" href="javascript:;">待审核</a>
                                                <a v-if="holderStatus[value] && holderStatus[value].cardAnotherId==2" class="cares-yes" href="javascript:;">审核通过</a>
                                                <a v-if="holderStatus[value] && holderStatus[value].cardAnotherId==3" class="no" href="javascript:;">审核失败</a>
                                            </p> 
                                        </el-upload>
                                    </li>

                                    <li v-if="form.status==3 || form.status==0" @click="bindDeleteAnHolder(value)" class="delete-button"><i class="el-icon-minus"></i></li>

                                </ul>
                            </div>
                        </div>
                        <!-- 占股比例 -->
                        <div :key="`k`+value" class="inner-box clearfix">
                            <label class="title">占股比例：</label>
                            <div>
                                <p>
                                    <el-input 
                                    v-if="(holderStatus[value].shareProportion==3||holderStatus[value].shareProportion==0)"
                                    type="number"
                                    maxlength="3" max="100" class="add-input" 
                                    v-model="form.shareHolderJson[value].shareProportion" 
                                    :disabled="holderStatus[value] && !(holderStatus[value].shareProportion==3||holderStatus[value].shareProportion==0)"
                                    placeholder="如45%输入45即可"></el-input>

                                    <span class="text" v-else>{{form.shareHolderJson[value].shareProportion}}%</span>
                                </p>
                            </div>
                        </div>
                        <!-- 股东常驻地址 -->
                        <div :key="`z`+value" class="inner-box clearfix" v-if="INCOM!='ADD_EU'">
                            <label class="title">股东常住地址：</label>
                            <div>
                                <p > 
                                    <template v-if="holderStatus[value].address == 0 || holderStatus[value].address == 3">
                                        <el-radio @change="(defaultValue)=>{ return holderNationalityChange(defaultValue,value)  }" v-model="form.shareHolderJson[value].nationality" label="CHN">中国大陆</el-radio>
                                        <el-radio @change="(defaultValue)=>{ return holderNationalityChange(defaultValue,value)  }" v-model="form.shareHolderJson[value].nationality" label="HKG">中国香港</el-radio>
                                    </template>
                                    <template v-else>
                                        <span class="text">{{form.shareHolderJson[value].nationality=='CHN'?'中国大陆':'中国香港'}}</span>
                                    </template>
                                </p>
                                <template v-if="holderStatus[value].address  == 0 || holderStatus[value].address == 3">
                                    <p v-if="form.shareHolderJson[value].nationality=='CHN'">

                                        <el-select v-model="form.shareHolderJson[value].provinceCode" 
                                        @change="bindShareHoderProvince(value)" 
                                        class="select-container" 
                                        :disabled="!(holderStatus[value].address  == 0 || holderStatus[value].address == 3)"
                                        name='provinceCode' placeholder="请选择省份">
                                            <el-option 
                                            v-for="(item,index) in provinceArr" 
                                            :key="index"
                                            :label="item.provinceName"
                                            :value="item.provinceCode"
                                            ></el-option>
                                        </el-select>

                                    <el-select v-model="form.shareHolderJson[value].cityCode" 
                                        class="select-container fr" 
                                        :disabled="!(holderStatus[value].address  == 0 || holderStatus[value].address == 3)"
                                        name='cityCode' placeholder="请选择城市">
                                            <el-option 
                                                v-for="(item,index) in form.shareHolderJson[value].cityArr" 
                                                :key="index"
                                                :label="item.cityName"
                                                :value="item.cityCode"
                                            ></el-option>
                                        </el-select>
                                    </p>
                                    <!-- :disabled="!(holderStatus[value].address  == 0 || holderStatus[value].address == 3)"  -->
                                    <p style="margin-top:10px;"> 
                                        <el-input 
                                        type="text" 
                                        name="address" 
                                        :disabled="!(holderStatus[value].address  == 0 || holderStatus[value].address == 3)"
                                        v-model="form.shareHolderJson[value].address" 
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
                    <!-- ending -->
                    <p v-if="form.status==3 || form.status==0" @click="bindAddAnHolder" class="add-button"><i class="el-icon-plus"></i></p>
                </div>
            </div>
            <!-- 股东资料上传end -->

             <p class="btn">
                  <template v-if="isReEdit">
                      <span v-if="form.status==3"  @click="bindConfirmNext" class="cares-button-primary">确认提交</span>
                </template>
                <template v-else>
                    <!-- <span @click="bindPreButton" class="cares-button-primary pain">上一步</span> -->
                    <span @click="bindConfirmNext" class="cares-button-primary">确认提交</span>
                </template>
            </p>

        </div>

        <FadeModel v-model="exempleModel.flag">
            <h3>图片示例</h3>
            <p class="warning-notice">请确保上传资料文字清晰可见，最大不超过10M，格式限定为jpg、jpeg、png、bmp。</p> 

            <div v-if="exempleModel.type=='hkBizCertification'">
                <p class="pic-title">商业登记证示例：</p>
                <img style="width:60%;" src="./../../../../images/carepay/商业登记证.jpg" alt="商业登记证">
            </div>

            <div v-if="exempleModel.type=='hkRegisterCertification'">
                <p class="pic-title">注册证书示例：</p>
                <img style="width:60%;" src="./../../../../images/carepay/注册证书.jpg" alt="注册证书">
            </div>

            <div v-if="exempleModel.type=='hkTableCertification'">
                <p class="pic-title">法团成立示例：</p>
                <img style="width:60%;" src="./../../../../images/carepay/发团成立表格.png" alt="法团成立">
            </div>

            <div class="id-cark" v-if="exempleModel.type=='cardFrontId'">
                <p class="pic-title">证件照片示例：</p>
                <ul>
                    <li v-if="form.hkDirectorIdcardType != 2">
                        <p>证件正面</p>
                        <img src="./../../../../images/carepay/hkid-f.jpg" alt="">
                    </li>
                    <li v-if="form.hkDirectorIdcardType != 2">
                        <p>证件背面</p>
                        <img src="./../../../../images/carepay/hkid-n.jpg" alt="">
                    </li>
                    <li v-else>
                        <p>护照信息页</p>
                        <img src="./../../../../images/carepay/hkhz.png" alt="">
                    </li>
                </ul>
            </div>
        </FadeModel>
    </div>
</template>

<script>
    // 实名认证页面--香港对公业务
    import '../../../../css/carespay/complete.scss';

    import $ from 'jquery';

    import VERICATION from '../../../../js/verification.js';

    import {
        uploadefile,            //上传接口
        downloadfile ,           //下载接口
        updateEnterprise,       //欧洲站完善企业信息
        addEnterprise,       //欧洲站完善企业信息
        personInfoAdd           //添加实名认证
        ,updatePersonInfo,
    } from './../../../../js/api.js';

      import {
        queryProvinceList,                              //省份列表
        queryCityData,                                  //城市数据
    } from '../../utils/localbase.js';

    import FadeModel from './../../../../components/fadeModel.vue';

    export default {
        data(){
            return{
                fileActive:uploadefile,
                downloadfile:downloadfile,
                form:{
                    businessLocation:'HKG',             //当前证件类型 香港企业还是大陆企业
                    nationality:'HKG',                 //地区 -- 董事的常驻地址 CHN. 中国大陆 HKG. 中国香港
                    hkBizCertification:"",              //商户登记证
                    hkRegisterCertification:"",         //公司注册证书
                    hkTableCertification:"",          //发团成立表格

                    hkDirectorIdcardType:3,          //董事证件类型
                    cardFrontId:"",          //董事证件正面照
                    cardAnotherId:"",          //董事证件反面照
                    shareHolderJson:[],         //股东列表

                    // companyArticleId:"",        //公司章程
                    type:'2',                   //个人还是公司
                    status:'0',                    //审核总状态


                    provinceCode:'',//省份code
                    cityCode:'',//城市code
                    residentialAddress:'',//居住地址
                },
                // uploadRules:false,              //上不上传公司章程

                //2018-12-5  欧洲站完善企业信息
                isReEdit:false,
                auditStatus:{
                    cardAnotherId:"0",         //身份证反面审核状态
                    cardFrontId:"0",           //身份证正面审核状态
                    hkBizCertification:"0",         //商户登记证审核状态
                    hkRegisterCertification:"0",         //公司注册证书审核状态
                    hkTableCertification:"0",           //发团成立表格审核状态
                    hkDirectorIdcardType:"0",           //董事证件类型
                    residentialAddress:"0"              //董事地址的审核状态
                },
                holderStatus:[],
                isAE:false,

                doNumber:0,

                provinceArr:[],//省份列表
                cityArr:[],//城市列表

                //图片上传的loading
                IMG_UPLOAD_ING:{
                    hkBizCertification:false,
                    hkRegisterCertification:false,
                    cardAnotherId:false,
                    cardFrontId:false,
                    hkTableCertification:false,
                },
                exempleModel:{
                    flag:false,             //是否展示引导
                    type:'cardFrontId'
                }
            }
        },
        props:["INCOM","id","data","edit",'AfterJumpFn','ISADD'],
        created(){
            queryProvinceList().then(res=>{
                this.provinceArr = res       
            }); 

            this.NoAuthentication();
         
        },
        mounted(){
           
        },
        watch:{
            //董事身份类型变换
            IdcardType(n,o){
                //第一次进入回显的时候不需要清空
                if((this.isReEdit || this.isAE) && !this.doNumber) return
                this.doNumber++;

                this.form.cardFrontId="";
                this.form.cardAnotherId="";
            },
             //监听省份的选择发生变化
            "form.provinceCode"(n,o){
                //请求城市接口
                n && queryCityData(n).then(res=>{
                    this.cityArr = res;
                });
                 if(!o) return;
                this.form.cityCode='';//城市回到没选择的状态
            },

            "data"(){
                this.NoAuthentication();
            }
        },
        methods:{
            //非实名认证执行函数
            NoAuthentication(){
                    //2018-11-28  添加亚马逊欧洲站
                if(['ADD_EU','R_NAME'].indexOf(this.INCOM) > -1){
                    //Object.keys(this.data).length 表示有回显的数据传入
                    if(Object.keys(this.data).length>0){
                        //有数据  判断是 编辑 还是 添加  this.edit 添加  ！this.edit 编辑更新
                        (!this.edit)  && (this.isReEdit=true);
                        this.edit && (this.isAE=true,this.isReEdit=false);
                        // this.isReEdit=true
                        this.enterpriseInfo(this.data)
                    }else{
                        //没有数据，  添加
                        this.reset();
                    }
                };
            },
            reset(){
                let not = ['businessLocation','nationality','type',"hkDirectorIdcardType","shareHolderJson",'status'];
                for (const key in this.form) {
                    if(not.indexOf(key)<0){ this.form[key]=""; }
                };
                this.form['shareHolderJson'] = [];
                this.isReEdit = false;
            },
            //下一步
            bindConfirmNext(){
                //1. 验证必填
                let must = ["hkBizCertification","hkRegisterCertification","hkTableCertification","cardFrontId",];

                this.form["hkDirectorIdcardType"]!=2 && must.push("cardAnotherId");

                //1.1 2019-3-21 店铺企业资料没有地址；
                if(this.INCOM != 'ADD_EU'){
                    //1.1 2019-3-1 董事地址必填信息；
                    let Dmust = this.form["nationality"] == 'CHN' ?
                    ['provinceCode','cityCode','residentialAddress']:
                    ['residentialAddress'];

                    must = must.concat(Dmust)
                };
                
                for(let i =0; i<must.length;i++){
                    if(!VERICATION(must[i],this.form[must[i]],'HK')) return;
                }

                //2. 如果有股东 -- 验证股东信息的完整性
                if(this.form.shareHolderJson.length){
                    for (let i = 0; i < this.form.shareHolderJson.length; i++) {
                        let holderMust = ["cardFrontId","shareProportion"];
                        if(this.form.shareHolderJson[i].cardType !=2) holderMust.push("cardAnotherId");
                        //2019-3-21 店铺企业资料没有地址；
                        if(this.INCOM != 'ADD_EU'){
                            let holderMustAddr = this.form.shareHolderJson[i]["nationality"] == 'CHN' ?
                            ['provinceCode','cityCode','address']:
                            ['address'];

                            holderMust = holderMust.concat(holderMustAddr)
                        };

                        //验证股东的必填
                        for(let j =0; j<holderMust.length;j++){
                            if(!VERICATION(holderMust[j],this.form.shareHolderJson[i][holderMust[j]],'HOLDER')) return;
                        }
                    }
                }

                //3. 提交的数据表单
                this.form.type = 2;
                let data = Object.assign({},this.form);

                for(let i = 0 ; i<data.shareHolderJson.length; i++){
                   delete  data.shareHolderJson[i].cityArr
                }

                data.shareHolderJson = JSON.stringify(data.shareHolderJson);
                
                //4. 进行网络请求
                this.localPageAjax(data);
                //  console.log(data);

            },
            localPageAjax(data){
                if(this.AjaxIng) return;
                this.AjaxIng = true;
                 //2018-11-28  新增欧洲站完善店铺信息
                switch(this.INCOM){
                    case 'ADD_EU':
                    {
                        //亚马逊欧洲站
                        data["storeId"]=this.id;    //完善店铺的ID ISADD
                        //1. 添加
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
                        //2. 修改
                        !this.ISADD && updateEnterprise(data).then(res=>{
                            this.AjaxIng = false;
                            if(res.code == 0){
                                this.$Message.success(res.msg);
                                this.AfterJumpFn();
                            }else{
                                this.$Message.error(res.msg);
                            }
                        });
                    }
                    break;
                    case 'R_NAME':
                    {//重新编辑实名信息
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
                    default :
                    {   
                        //实名认证的添加
                        personInfoAdd(data).then(res=>{
                            this.AjaxIng = false;
                            if(res.code==0){
                                this.$emit('watchIsFillDone',true); //是否已经完成实名认证
                                //1.添加了提现账户
                                this.AfterJumpFn();
                            }else{
                                this.$Message.error(res.msg)
                            }
                        });
                    }
                    break;
                }
            },
            // 点击添加一个股东
            bindAddAnHolder(){
                if(this.form.shareHolderJson.length>=4) return this.$Message.warning(`最多只能添加四个股东！`);
                //添加一位股东
                let HolderJson = this.INCOM == 'ADD_EU' ? {
                    "cardType":3,          //证件类型
                    "cardFrontId":"",       //正面
                    "cardAnotherId":"",     //反面
                    "id":"",
                    "shareProportion":"",   //占股比例
                }:{
                    "cardType":3,          //证件类型
                    "cardFrontId":"",       //正面
                    "cardAnotherId":"",     //反面
                    "id":"",
                    "shareProportion":"",   //占股比例

                    "nationality":"HKG",
                    "provinceCode":"",  //省份
                    "cityCode":"",      //城市
                    "address":"",       //地址
                    "cityArr":[],
                }
                this.form.shareHolderJson.push(HolderJson);
                this.holderStatus.push({
                    "cardType":0,
                    "cardFrontId":0,
                    "cardAnotherId":0,
                    "shareProportion":0,
                    "address":0,
                });
            },
            //删除股东
            bindDeleteAnHolder(val){
                this.form.shareHolderJson.splice(val,1);
            },
            //股东证件类型变换
            bindShareIdcardType(val){
                this.form.shareHolderJson[val].cardFrontId="";
                this.form.shareHolderJson[val].cardAnotherId="";
            },
            //2018-11-15 商场商户登记证为文件类型
            bindUploadFileSucess(res,file,name){
                // index === undefined &&
                 (this.IMG_UPLOAD_ING[name] = !this.IMG_UPLOAD_ING[name]);
                //清掉当前上传的
                if(res.code==0){
                   $(`#${name}`).find('.el-upload-list li').length>1 && $(`#${name}`).find('.el-upload-list li').eq(0).hide(500,function(){ $(this).remove() });
                    this.form[name] = res.data.uuid;
                }else{
                    this.$Message.error(res.msg);
                }
            },
            bindToShowExemple(name){
                this.exempleModel.flag = true;
                this.exempleModel.type = name;
            },
            bindBeforeUpload(file,name){
                 this.IMG_UPLOAD_ING[name] = true;
            },
            //上传成功
            bindUploadSuccess(res,file,name,index){
                index === undefined && (this.IMG_UPLOAD_ING[name] = !this.IMG_UPLOAD_ING[name]);
                if(res.code==0){
                    //判断给股东回显还是董事
                    if(index === undefined){
                        this.form[name] = res.data.uuid;
                    }else{
                        this.form.shareHolderJson[index][name] = res.data.uuid;
                    }

                }else{
                    this.$Message.error(res.msg);
                }
            },
            //上传失败的
            bindUploadError(){
                 this.$Message.error(`上传失败，请重新上传！`);
            },
            //2018-11-15 移除上传的列表
            bindUploadFileExceed(file,fileList,name){
                this.form[name] = "";
            },

             bidnAddIptBlur(){
                VERICATION('residentialAddress',this.form['residentialAddress']);
            },
            //股东省份发生变化
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
            //常驻地址发生变化
            holderNationalityChange(value,index){
                // provinceCode:'',//省份code
                //     cityCode:'',//城市code
                if(index<0){
                    //董事证件信息常驻地址变化
                    value == 'HKG' && (this.form.provinceCode="");
                }else{
                    value == 'HKG' && (
                        this.form.shareHolderJson[index].provinceCode="",
                        this.form.shareHolderJson[index].cityCode=""
                    );
                }
            },


              //2018-11-28  新增欧洲站完善店铺信息
            enterpriseInfo(res){
                 for (const key in this.form) {
                     if(['type','shareHolderJson'].indexOf(key)<0){
                         this.form[key] = res[key] || '';
                     }
                };

                this.isAE && (this.form.status = 0)

                // this.form.shareHolderJson = res.shoreHolderRespVoList || [];

                //2. 董事的审核状态

                !this.isAE &&res.auditInfoVoList && res.auditInfoVoList.forEach(item=>{
                    for (const key in this.auditStatus) {
                        if(item.auditField == key){
                            this.auditStatus[key] = item.auditStatus;
                        }
                    };

                });

                //3. 股东的审核状态
                res.shoreHolderRespVoList && res.shoreHolderRespVoList.length && res.shoreHolderRespVoList.forEach(item=>{
                    let o = {};
                    //每个股东的审核状态
                    item.auditInfoVoList.forEach(innerItem=>{
                        //股东身份证正面
                        (innerItem.auditField == "cardFrontId") && (o["cardFrontId"] = this.isAE ? 0 :innerItem.auditStatus);
                        //股东身份证反面
                        (innerItem.auditField == "cardAnotherId") && (o["cardAnotherId"] = this.isAE ? 0 :innerItem.auditStatus);
                        //股东证件类型
                        (innerItem.auditField == "cardType") && (o["cardType"] = this.isAE ? 0 :innerItem.auditStatus);
                        //股东占股比例
                        (innerItem.auditField == "shareProportion") && (o["shareProportion"] = this.isAE ? 0 :innerItem.auditStatus);
                        //股东地址
                        (innerItem.auditField == "address") && (o["address"] = this.isAE ? 0 :innerItem.auditStatus);
                        
                    });
                    //将状态添加进去
                    this.holderStatus.push(o);

                    //  //2018-12-18  股东信息的城市选择
                    let code = item.provinceCode;
                    // _this.$set(_this.cashCount,item.id,'');s
                    queryCityData(code).then(res=>{
                        this.$set(item,"cityArr",res)
                    });
                    
                    // console.log(this.form.shareHolderJson);
                    this.form.shareHolderJson.push(item);
                });
            }
        },
        computed:{
            IdcardType(){
                return this.form.hkDirectorIdcardType;
            }
        },
        components:{
            FadeModel,
        }
    }
</script>

<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';
    .upload-btn{
        padding: 0 20px;
    }

    .complate-name{
        .inner-box{
            position: relative;
            .title{
                width: 100px;
            }
            .rules{
                width: 150px;
            }
        }
        .parner-id-info{
            margin-bottom: 0;
        }
        .delete-button{
            position: absolute;
            top: 50%;
            right: -100px;
        }
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
        margin-bottom: 10px;
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
                img{
                    width: 270px;
                }
            }
        }
    }
</style>


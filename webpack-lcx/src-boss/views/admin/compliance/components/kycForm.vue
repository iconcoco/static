<template>
    <div class="kyc-form ">
        <div class="kyc-status clearfix">
            <h3>审核总状态：</h3>
            <template v-if="type<10">
                <span v-if="totalStatus==1" class="ing">待审核</span>
                <span v-if="totalStatus==2" class="yes">审核通过</span>
                <span v-if="totalStatus==3" class="no">审核失败</span>
            </template>

            <template v-else>
                <span v-if="totalStatus==1" class="ing">低风险</span>
                <span v-if="totalStatus==2" class="yes">中风险</span>
                <span v-if="totalStatus==3" class="no">高风险</span>
                <span v-if="totalStatus==4" class="no"><b>EDD</b></span>
            </template>

            <el-button class="fr" @click="bindSendTableData" type="primary" >提交</el-button>
            <!-- subType <el-button style="margin-right:10px;" v-if="type==1" class="fr" @click="bindvalidIdCard" type="warning" plain>取消EDD</el-button> -->
            <el-button style="margin-right:10px;" v-if="type==1 || (type==4&&subType==2)" class="fr" @click="bindvalidIdCard" type="warning" plain>身份验证</el-button>
            <el-button style="margin-right:10px;" v-if="type<10" class="fr" @click="bindShowAddRemarkModal(id,type)" type="success">备注</el-button>
            <el-button  style="margin-right:10px;" v-if="type>10 && totalStatus==4" @click="bindCancleEdd(id,type)" class="fr"  type="success" plain>取消EDD</el-button>
        </div>
        <table>
            <thead>
                <tr>
                    <th class="per10">审核属性</th>
                    <th>属性值</th>
                    <th  class="per10">审核方式</th>
                    <th class="per30">审核状态</th>
                     <th  class="per20">备注</th>
                    <!--<th  class="per10">审核人</th>
                    <th  class="per10">审核时间</th> -->
                </tr>
            </thead>
            <tbody>
                 <tr v-if="!form.length">
                    <td colspan="5">暂无查询结果</td>
                </tr>
                <tr v-for="(item,index) in form" :key="index">
                    <td>{{item.fieldName}}</td>
                    <td>
                        <!-- 图片 -->
                        <template v-if="item.fieldType==4">
                            <img preview="1" v-if="item.fieldValue" preview-text="" :src="`/file/download?fileId=`+item.fieldValue" alt="图片">
                            <el-upload
                                v-if="item.isEdit==1"
                                :show-file-list='false'
                                name='upFile'   
                                :action="actionsUpload"
                                :on-success="bindUploadSuccess"
                                :on-error="bindUploadError"
                                style="display:inline-block;"
                                >
                                <el-button @click="bindUploadImg(index)" type="success">上传</el-button>
                            </el-upload>
                        </template>
                         <!-- 日期 -->
                        <template v-else-if="item.fieldType==2">
                            <span v-if="!(item.isEdit==1)">{{item.fieldValue}}</span>
                            <template   v-else>
                                <!-- <el-checkbox  v-model="item.fieldValue"  v-model="item.isLong?'2019-04-08':item.fieldValue" label="2100-01-01">长期</el-checkbox> -->
                                <el-checkbox  
                                    v-if="item.auditField=='expirationDate'"
                                    @change="(bol)=>{ return bindChangeDateToLong(bol,index) }"
                                >长期</el-checkbox>
                                <el-date-picker
                                    value-format="yyyy-MM-dd"
                                    v-model="item.fieldValue"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </template>
                        </template>
                         <!-- 链接 -->
                        <template v-else-if="item.fieldType==5" >
                            <a target="_blank" :href="item.fieldValue">{{item.fieldValue}}</a>
                        </template>
                        <!-- 附件需要下载 -->
                        <template  v-else-if="item.fieldType==6" >
                            <a class="primary" v-if="item.fieldValue" target="_blank" :href="`${download}?fileId=${item.fieldValue}`"><span class="fa fa-cloud-download"></span> 下载附件</a>
                              <el-upload
                                v-if="item.isEdit==1"
                                :show-file-list='false'
                                name='upFile'   
                                :action="actionsUpload"
                                :on-success="bindUploadSuccess"
                                :on-error="bindUploadError"
                                style="display:inline-block;"
                                >
                                <el-button @click="bindUploadImg(index)" type="success">上传</el-button>
                            </el-upload>
                        </template>
                         <!-- 其他 -->
                        <template  v-else>
                            <!-- 证件类型 -->
                            <template v-if="
                            item.auditField=='identityType' || 
                            item.auditField=='cardType' || 
                            item.auditField=='hkDirectorIdcardType' || 
                            item.riskField=='hkDirectorIdcardType' || 
                            item.riskField=='identityType'||
                            item.riskField=='cardType'
                            ">
                               <span v-if="!(item.isEdit==1)">{{idCard[item.fieldValue-1]}}</span>
                                <el-select v-else v-model="item.fieldValue" placeholder="请选择证件类型">
                                    <el-option v-for="(idItem,idIndex) in idCard" 
                                        :key="idIndex"
                                        :label="idItem"   
                                        :value="`${idIndex+1}`"   
                                    ></el-option>
                                </el-select>
                            </template>
                            <!-- 生效和失效日期 -->
                            <template v-else-if="
                                (item.auditField=='certificateDate')||
                                (item.auditField=='dateOfIssue')||
                                (item.auditField=='expiredDate')||(item.auditField=='dob')||
                                (item.riskField=='certificateDate')||(item.riskField=='expiredDate')||(item.riskField=='dob')
                            ">
                                <span v-if="!(item.isEdit==1)">{{item.fieldValue}}</span>
                                 <el-date-picker
                                    v-else
                                    value-format="yyyy-MM-dd"
                                    v-model="item.fieldValue"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </template>
                            <!-- 性别 -->
                            <template v-else-if="item.auditField=='sex'||item.riskField=='sex'">
                                <span v-if="!(item.isEdit==1)">{{sexArr[item.fieldValue-1]}}</span> 
                                <el-select v-else v-model="item.fieldValue" placeholder="请选择性别">
                                    <el-option v-for="(idItem,idIndex) in sexArr" 
                                        :key="idIndex"
                                        :label="idItem"   
                                        :value="`${idIndex+1}`"   
                                    ></el-option>
                                </el-select>
                            </template>
                            <!-- 企业类型 -->
                            <template v-else-if="item.auditField=='companyType'">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,companyType,'companyTypeName','companyTypeCode')}}</span> 
                                <el-select v-else v-model="item.fieldValue" placeholder="请选择企业类型">
                                    <el-option v-for="(idItem,idIndex) in companyType" 
                                        :key="idIndex"
                                        :label="idItem.companyTypeName"   
                                        :value="idItem.companyTypeCode"   
                                    ></el-option>
                                </el-select>
                            </template>
                            <!-- 国籍 -->
                            <template v-else-if="
                            item.auditField=='nationality'||
                            item.auditField=='businessLocation'||
                            item.riskField=='country' ||
                            item.riskField=='registerAddress' ||
                            item.riskField=='legalpersonCountry'
                            ">
                                <span v-if="!(item.isEdit==1)">{{nationObj[item.fieldValue]}}</span> 
                                <el-select v-else v-model="item.fieldValue" placeholder="请选择国籍">
                                    <el-option v-for="(v,key) in nationObj" 
                                        :key="key"
                                        :label="v"   
                                        :value="key"   
                                    ></el-option>
                                </el-select>
                            </template>
                            <!-- 预计年销量 -->
                            <template v-else-if=" /^expectedSale/.test(item.auditField)||item.riskField=='businessVolume'">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,salesVolume,'saleName','saleCode')}}</span> 
                                <template v-else>
                                    <el-select v-if="type<10" v-model="item.fieldValue" placeholder="请选择年销量">
                                        <el-option v-for="(saleItem,key) in salesVolume" 
                                            :key="key"
                                            :label="saleItem.saleName"   
                                            :value="saleItem.saleCode"   
                                        ></el-option>
                                    </el-select>
                                    <el-select v-else v-model="item.riskLevel" placeholder="请选择年销量">
                                        <el-option v-for="(saleItem,key) in salesVolume" 
                                            :key="key"
                                            :label="saleItem.saleName"   
                                            :value="saleItem.saleCode"   
                                        ></el-option>
                                    </el-select>
                                </template>
                            </template>

                            <!-- 平台 -->
                            <template v-else-if="item.auditField=='platform'||item.riskField=='platform'">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,platArr,'platformName','platformCode')}}</span> 
                                <el-select v-else v-model="item.fieldValue" placeholder="请选择平台">
                                    <el-option v-for="(platItem,key) in platArr" 
                                        :key="key"
                                        :label="platItem.platformName"   
                                        :value="platItem.platformCode"   
                                    ></el-option>
                                </el-select>
                            </template>

                            <!-- 名单筛选、负面新闻 -->
                            <template v-else-if="
                            item.riskField=='listScreening'||
                            item.riskField=='legalpersonListScreening'||
                            item.riskField=='legalpersonGoogleNews'||
                            item.riskField=='googleNews'">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,googleNews,'googleNewsName','googleNewsCode')}}</span> 
                                 <template v-else >
                                    <el-select v-if="type<10" v-model="item.fieldValue" placeholder="请选择">
                                        <el-option v-for="(platItem,key) in googleNews" 
                                            :key="key"
                                            :label="platItem.googleNewsName"   
                                            :value="platItem.googleNewsCode"   
                                        ></el-option>
                                    </el-select>
                                    <el-select v-else v-model="item.riskLevel" placeholder="请选择">
                                            <el-option v-for="(platItem,key) in googleNews" 
                                                :key="key"
                                                :label="platItem.googleNewsName"   
                                                :value="platItem.googleNewsCode"   
                                            ></el-option>
                                    </el-select>
                                </template>
                            </template>

                            <!-- 商品种类 -->
                             <template v-else-if="/^productCategories/.test(item.auditField) ||item.auditField=='goodsType'||item.riskField=='goodsType'">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,category,'productName','productCode')}}</span> 
                                <el-select v-else v-model="item.fieldValue" placeholder="请选择商品种类">
                                    <el-option v-for="(cateItem,key) in category" 
                                        :key="key"
                                        :label="cateItem.productName"   
                                        :value="cateItem.productCode"   
                                    ></el-option>
                                </el-select>
                            </template>

                            <!-- 企业注册时长 -->
                             <template v-else-if="item.auditField=='registerDate'||item.riskField=='registerDate'">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,registerDate,'registerDateName','registerDateCode')}}</span>

                                    <el-select v-else v-model="item.riskLevel" placeholder="请选择企业注册时长">
                                        <el-option v-for="(evItem,key) in registerDate" 
                                            :key="key"
                                            :label="evItem.registerDateName"   
                                            :value="evItem.registerDateCode"   
                                        ></el-option>
                                    </el-select>

                               
                            </template>

                            <!-- 企业经营范围 -->
                             <template v-else-if="item.auditField=='bizScope'||item.riskField=='bizScope'">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,bizScope,'bizScopeName','bizScopeCode')}}</span> 
                                <el-select v-else v-model="item.riskLevel" placeholder="请选择商品种类">
                                    <el-option v-for="(evItem,key) in bizScope" 
                                        :key="key"
                                        :label="evItem.bizScopeName"   
                                        :value="evItem.bizScopeCode"   
                                    ></el-option>
                                </el-select>
                            </template>

                            <!-- 居住地 -->
                             <template v-else-if="
                             item.auditField=='address'||
                             item.riskField=='address' ||
                             item.riskField=='legalpersonAddress'
                             ">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,provinceArr,'provinceName','provinceCode')}}</span> 
                                <el-select v-else v-model="item.fieldValue" placeholder="请选择省份">
                                    <el-option v-for="(proItem,key) in provinceArr" 
                                        :key="key"
                                        :label="proItem.provinceName"   
                                        :value="proItem.provinceCode"   
                                    ></el-option>
                                </el-select>
                            </template>

                            <!-- 企业类型 -->
                             <template v-else-if="item.auditField=='enterpriseType'||item.riskField=='enterpriseType'">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,enterpriseType,'enterpriseTypeName','enterpriseTypeCode')}}</span> 
                                <el-select v-else v-model="item.riskLevel" placeholder="请选择商品种类">
                                    <el-option v-for="(evItem,key) in enterpriseType" 
                                        :key="key"
                                        :label="evItem.enterpriseTypeName"   
                                        :value="evItem.enterpriseTypeCode"   
                                    ></el-option>
                                </el-select>
                            </template>

                            <!-- 店铺经营时长 -->
                             <template v-else-if="item.auditField=='bizTime'||item.riskField=='bizTime'">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,dealInTime,'bizTimeName','bizTimeCode')}}</span> 
                                <template v-else>
                                    <el-select v-if="type<10" v-model="item.fieldValue" placeholder="请选择店铺经营时长">
                                        <el-option v-for="(dealItem,key) in dealInTime" 
                                            :key="key"
                                            :label="dealItem.bizTimeName"   
                                            :value="dealItem.bizTimeCode"   
                                        ></el-option>
                                    </el-select>

                                    <el-select v-else v-model="item.riskLevel" placeholder="请选择店铺经营时长">
                                        <el-option v-for="(dealItem,key) in dealInTime" 
                                            :key="key"
                                            :label="dealItem.bizTimeName"   
                                            :value="dealItem.bizTimeCode"   
                                        ></el-option>
                                    </el-select>

                                </template>
                                
                            </template>

                            <!-- 店铺负面评价 -->
                             <template v-else-if="item.auditField=='negativeComment'||item.riskField=='negativeComment'">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,negativeComment,'negativeCommentName','negativeCommentCode')}}</span> 
                                <template v-else >
                                     <el-select v-if="type<10" v-model="item.fieldValue" placeholder="请选择店铺负面评价">
                                        <el-option v-for="(negaItem,key) in negativeComment" 
                                            :key="key"
                                            :label="negaItem.negativeCommentName"   
                                            :value="negaItem.negativeCommentCode"   
                                        ></el-option>
                                    </el-select>

                                     <el-select v-else v-model="item.riskLevel" placeholder="请选择店铺负面评价">
                                        <el-option v-for="(negaItem,key) in negativeComment" 
                                            :key="key"
                                            :label="negaItem.negativeCommentName"   
                                            :value="negaItem.negativeCommentCode"   
                                        ></el-option>
                                    </el-select>
                                </template>
                               
                            </template>

                            <!-- 关系建立渠道 -->
                             <template v-else-if="item.auditField=='registerChannel'||item.riskField=='registerChannel'">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,registerChannelType,'registerChannelName','registerChannelCode')}}</span> 
                                <template v-else >
                                     <el-select v-if="type<10" v-model="item.fieldValue" placeholder="请选择关系建立渠道">
                                        <el-option v-for="(regiChannerItem,key) in registerChannelType" 
                                            :key="key"
                                            :label="regiChannerItem.registerChannelName"   
                                            :value="regiChannerItem.registerChannelCode"   
                                        ></el-option>
                                    </el-select>

                                     <el-select v-else v-model="item.riskLevel" placeholder="请选择关系建立渠道">
                                        <el-option v-for="(regiChannerItem,key) in registerChannelType" 
                                            :key="key"
                                            :label="regiChannerItem.registerChannelName"   
                                            :value="regiChannerItem.registerChannelCode"   
                                        ></el-option>
                                    </el-select>
                                </template>
                               
                            </template>

                            <!-- 店铺商品价位 -->
                             <template v-else-if="item.auditField=='goodsPrice'||item.riskField=='goodsPrice'">
                                <span v-if="!(item.isEdit==1)">{{fineValName(item.fieldValue,goodsPrice,'goodsPriceName','goodsPriceCode')}}</span> 
                                <template v-else >
                                    <el-select v-if="type<10" v-model="item.fieldValue" placeholder="请选择商品价位">
                                        <el-option v-for="(PriItem,key) in goodsPrice" 
                                            :key="key"
                                            :label="PriItem.goodsPriceName"   
                                            :value="PriItem.goodsPriceCode"   
                                        ></el-option>
                                    </el-select>

                                    <el-select v-else v-model="item.riskLevel" placeholder="请选择商品价位">
                                        <el-option v-for="(PriItem,key) in goodsPrice" 
                                            :key="key"
                                            :label="PriItem.goodsPriceName"   
                                            :value="PriItem.goodsPriceCode"   
                                        ></el-option>
                                    </el-select>
                                </template>
                                
                            </template>

                            <!-- 其他输入框 -->
                            <template v-else>
                                <span v-if="!(item.isEdit==1)">{{item.fieldValue}}</span>
                                <el-input  v-else v-model="item.fieldValue"></el-input>
                            </template>

                        </template>
                    </td>
                    <td>
                        <span v-if="item.auditMode==1" class="yes">自动</span>
                        <span v-else class="ing">手动</span>
                    </td>
                    <td >
                        <template v-if="type<10">
                            <el-radio v-if="item.auditMode!=1" v-model="item.auditStatus" label="1">待审核</el-radio>
                            <el-radio  v-model="item.auditStatus" label="2">审核通过</el-radio>
                            <el-radio v-if="item.auditMode!=1" v-model="item.auditStatus" label="3">审核失败</el-radio>
                        </template>

                        <template v-else>
                            <el-radio v-model="item.riskLevel" label="1">低风险</el-radio>
                            <el-radio v-model="item.riskLevel" label="2">中风险</el-radio>
                            <el-radio v-model="item.riskLevel" label="3">高风险</el-radio>
                            <!-- <el-radio v-model="item.riskLevel" label="4">EDD</el-radio> -->
                        </template>
                        
                    </td>
                    <td class="kyc-remark">
                         <template v-if="item.remarkType==4">
                            <!-- <a target="_blank" v-if="item.fieldValue&&!(item.isEdit==1)" '/file/download?fileId='+item.remark :href="'/file/download?fileId='+item.fieldValue"> -->
                            <img preview="1" preview-text="" v-show="item.remark" :src="`${item.remark && `/file/download?fileId=`+item.remark}`" alt="图片">
                            <!-- </a>  v-else -->
                            <el-upload
                                v-if="item.isEdit==1"
                                :show-file-list='false'
                                name='upFile'   
                                :action="actionsUpload"
                                :on-success="bindRemarkUploadSuccess"
                                :on-error="bindUploadError"
                                style="display:inline-block;"
                                >
                                <el-button @click="bindUploadImg(index)" type="success">上传</el-button>
                            </el-upload>
                            <!-- <img v-if="item.fieldValue" @click="bindUploadImg(index)" :src="'/file/download?fileId='+item.fieldValue" alt="">  -->
                        </template>

                        <!-- <el-input v-else style="width:90%" v-model="item.remark" placeholder="输入备注"></el-input> -->
                        <el-autocomplete
                            v-else style="width:90%"
                            v-model="item.remark"
                            :fetch-suggestions="suggestions"
                            placeholder="输入备注"
                        ></el-autocomplete>
                            <!-- @select="handleSelect" -->

                    </td>
                    <!-- <td>{{item.auditUser}}</td>
                    <td>{{item.auditTime}}</td> -->
                </tr>
            </tbody>
        </table>

        <AdminModal
            title="备注"
            v-model="remarkForm.isShow"
            :confirm="bindAddRemark"
            confirmTxt="添加备注"
            class="kyc-adminModal"
        >
            <table>
                <thead>
                    <tr>
                        <th class="per20">添加人</th>
                        <th class="per20">添加时间</th>
                        <th>内容</th>
                    </tr>
                </thead>
            </table>
            <div class="table-content">
                <table>
                    <thead>
                        <tr>
                            <th class="per20">添加人</th>
                            <th class="per20">添加时间</th>
                            <th>内容</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!remarkTbable.length">
                            <td colspan="3">暂无任何备注信息</td>
                        </tr>
                        <tr v-else v-for="(item, index) in remarkTbable" :key="index">
                            <td>{{item.createUserName}}</td>
                            <td>{{format(item.createTime)}}</td>
                            <td>{{item.remark}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>添加备注：</p>
            <el-input type="textarea" v-model="remarkForm.remark"></el-input>
        </AdminModal>
    </div>
</template>

<script>

    import {saveKycAuditInfo,
    saveStoreOwnAuditInfo,
    queryEuOtherStatus,
    validIdCard,
    upload,
    saveRiskInfo,
    queryAuditRemark,
    saveAuditRemark,
    cancelEddRisk,
    download} from '../../../../utils/axios/api.js';
    import {
        queryPlatform,salesVolume,category,dealInTime,negativeComment,goodsPrice,
        googleNews,
        registerDate,
        bizScope,
        enterpriseType,
        queryProvince,
        registerChannelType,
        companyType
        } from '../../../../ext/localBase.js';
    
    import { formatTimer } from '../../../../utils/common.js';

    import AdminModal from '../../../../components/adminModal.vue';

    export default {
        data(){
            return{
                download:download, 
                form:[],
                totalStatus:'',
                actionsUpload:upload,

                switchUpload:'',
                idCard:[
                    "中华人民共和国居民身份证",
                    "护照",
                    "香港永久性居民身份证",
                    "澳门特别行政区永久性居民身份证",
                    "港澳居民来往内地通行证",
                    "台湾居民来往大陆通行证",
                    ],
                sexArr:["男","女"],
                nationObj:{
                    CHN:"中国大陆",
                    HKG:"中国香港"
                },

                remarkForm:{
                    isShow:false,
                    remark:'',
                    bizType:'',
                    foreignId:'',
                },
                remarkTbable:[],

                platArr:[],
                provinceArr:[],
                salesVolume:salesVolume,
                category:category,
                dealInTime:dealInTime,
                negativeComment:negativeComment,
                goodsPrice:goodsPrice,
                googleNews:googleNews,
                registerDate:registerDate,
                bizScope:bizScope,
                enterpriseType:enterpriseType,
                registerChannelType:registerChannelType,
                companyType:companyType,
            }
        },
        props:['data','type','id','URL','params','nation','subType'],
        //data  循环的数据
        //type  是否是风险  <10 非风险  >10 风险
        //subType  2019-3-8 欧洲站店铺信息子tab
        //id    外键id 应该是必备的
        //URL   亚马逊欧洲站审核需要换接口提交，用来判断是否需要改变提交的url  布尔值;
        //params   亚马逊欧洲站审核需要换接口提交，用来判断传值参数区别，如有需要可扩展，此参数配合URL一起使用;
        created() {
            this.loadingQuery(this.data);
            
            Promise.all([
                queryPlatform(),
                queryProvince(),
            ]).then(res=>{
                let [a,b] = res;
                 this.platArr = a;
                 this.provinceArr = b;
            });
        },
        methods:{
            suggestions(queryString, cb){
                cb([
                    { "value": "身份证正面模糊"},
                    { "value": "身份证反面模糊"},
                    { "value": "地址不够详细"},
                    { "value": "照片不清晰"},
                ]);
            },
            loadingQuery(n){
                this.form = [];
                this.totalStatus = n.totalStatus;
                n.auditInfoList && n.auditInfoList.length>0 && n.auditInfoList.forEach(item=>{
                    this.form.push({
                        id:item.id,

                        auditField:item.auditField,                 //审核字段
                        riskField:item.riskField,                   //风险审核字段

                        fieldValue:item.fieldValue,                 //审核值
                        bizType:item.bizType,                       //业务类型
                        foreignId:item.foreignId,                   //外键ID
                        auditUser:item.auditUser,                   //审核人
                        auditTime:item.auditTime,                   //审核时间
                        fieldName:item.fieldName,                   //审核属性
                        fieldType:item.fieldType,                   //字段类型 1:普通文本，2日期，3多图合并（逗号隔开）,4图片,5链接
                        auditMode:item.auditMode,                   //审核模式 1 自动 2 手动

                        auditStatus: item.auditMode==1? '2': `${item.auditStatus}`,  //审核状态 0 1 2
                        riskLevel: `${item.riskLevel===null? '1' : item.riskLevel}`,                  //风险等级 0 1 2

                        remark:item.remark,                         //审核备注
                        remarkType:item.remarkType,                 //备注类型
                        isEdit:item.isEdit,                         //是否可以编辑
                    }); 
                }); 
            },
            //展示添加备注的modal
            bindShowAddRemarkModal(foreignId,bizType){
                this.remarkForm.isShow = true;
                this.remarkForm.bizType = bizType;
                this.remarkForm.foreignId = foreignId;

                queryAuditRemark({
                    foreignId,
                    bizType,
                }).then(res=>{
                    if(res.code==0){
                        this.remarkTbable = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //取消EDD
            bindCancleEdd(foreignId,bizType){

                
                 this.$confirm('确认取消EDD吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'primary'
                }).then(()=>{
                    // console.log(foreignId,Math.floor(bizType/10));
                    cancelEddRisk({
                        foreignId,
                        bizType:Math.floor(bizType/10)
                    }).then(res=>{

                        if(res.code==0){
                            this.$message.success(res.msg);
                            this.totalStatus = res.data;
                        }else{
                            this.$message.error(res.msg);
                        }

                    });
                }).catch(()=>{});
            },
            //提交添加备注
            bindAddRemark(){

                if(!(this.remarkForm.remark.trim())) return this.$message.warning(`请输入备注信息！`);

               saveAuditRemark(this.remarkForm).then(res=>{
                   if(res.code==0){
                        this.$message.success(`添加成功！`);
                        this.remarkForm.remark = "";
                        this.remarkForm.isShow = false;
                   }else{
                       this.$message.error(res.msg);
                   }
               });
            },
            format(p){
                return formatTimer(p);
            },
            //提交审核
            bindSendTableData(){

                let _this = this;
                
                if(this.type<10){
                    //保存修改
                    let postData = this.form;//['']
                    for(let i=0;i<postData.length;i++){
                        let item = postData[i];
                        delete item.auditTime
                        if(item.auditStatus==3 && !item.remark) return this.$message.warning('请在备注栏中输入审核失败的原因');
                    };
                    
                    //2018-12-07  欧洲站审核提交另外的接口
                    if(this.URL) return this.EUStroeAuditInfo();

                    !this.URL && saveKycAuditInfo({
                        "auditInfoReqVoList":postData
                    }).then(res=>{
                        if(res.code==0){
                            _this.$message.success(res.msg);
                            this.totalStatus = res.data;
                        }else{
                            _this.$message.error(res.msg);
                        }
                    });
                }else{
                    saveRiskInfo({
                        "riskInfoReqVoList":this.form
                    }).then(res=>{
                         if(res.code==0){
                            _this.$message.success(res.msg);
                            this.totalStatus = res.data;
                        }else{
                            _this.$message.error(res.msg);
                        }
                    });
                }
                
            },
            bindvalidIdCard(){
                let ajax = {
                    name:'',
                    idNumber:''
                }
                 this.form.forEach(item=>{
                     if(item.auditField=='name'||item.auditField=='idNumber'){
                         ajax[item.auditField] = item.fieldValue;
                     }
                });

                let flag = Object.values(ajax).every(item=>item);
                if(!flag) return this.$message.error(`身份证号或名字不能为空！`);

                validIdCard(ajax).then(res=>{
                    if(res.code==0){
                        this.$message.success('验证通过！');
                        //2. 将目前手动审核变为失败
                         this.form.forEach(item=>{
                            if(item.auditMode==2){
                                item.auditStatus = '2';
                                item.remark = null;
                            }
                        });
                        //3. 提交保存当前的审核状态
                        this.bindSendTableData();
                    }else if(res.code==2){
                        //1. 提示失败
                        this.$message.error(`验证失败！`);
                        //2. 将目前手动审核变为失败
                         this.form.forEach(item=>{
                            if(item.auditMode==2){
                                item.auditStatus = '3';
                                item.remark = '身份证验证失败';
                            }
                        });
                        //3. 提交保存当前的审核状态
                        this.bindSendTableData();

                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //2018-12-7 亚马逊欧洲站店铺审核接口
            EUStroeAuditInfo(){
                //1. 获取客户编号和店铺ID
                let PARR = this.params.split(","),
                    customerNo = PARR[0],
                    storeId = PARR[1],
                    storeNo = PARR[2],
                    currency = PARR[3];

                //2. 提交审核的数据
                let postData = this.form;//['']
                postData.forEach(item=>{
                    delete item.auditTime
                });

                //3. 提交审核的接口
                saveStoreOwnAuditInfo({
                    "auditInfoReqVoList":postData,
                    customerNo,
                    storeId,
                     "id":storeNo,
                     currency,
                }).then(res=>{
                    if(res.code==0){
                        this.$message.success(res.msg);
                        this.totalStatus = res.data;
                        //查询英国欧洲站的状态
                       this.nation == 'GB' &&  queryEuOtherStatus({"id":storeNo}).then(resp=>{
                            if(resp.code==0){
                                this.$emit('transParams',{ ENSTATUS : resp.data})
                            }else{
                                this.$message.error(res.msg);
                            }
                        });
                        
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //上传图片点击
            bindUploadImg(index){
                this.switchUpload = index;
            },
            bindUploadSuccess(res){
                if(res.code==0){
                    this.form[this.switchUpload].fieldValue = res.data.uuid;
                }else{
                    this.$message.error(res.msg);
                }
                
            },
            //选择永久时间
            bindChangeDateToLong(bol,i){
                 this.form.forEach((item,index)=>{
                    if(index==i){
                        item.fieldValue= bol ? '2100-01-01' : '';
                    }
                })
            },
            //图片
            bindRemarkUploadSuccess(res){
                if(res.code==0){
                    this.form[this.switchUpload].remark = res.data.uuid;
                }else{
                    this.$message.error(res.msg);
                }
            },
            bindUploadError(){
                this.$message.error(`上传失败，请重新上传！`);
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
        computed:{

        },
        watch:{
            data(n){
              this.loadingQuery(n) ;
            }
        },
        components:{
            AdminModal,
        }
    }
</script>

<style lang="scss" scoped>
    .kyc-status{
        h3{
            display: inline-block;
            color: #333;
            margin-right: 10px;
        }
    }
    table{
        tr{
            td{
               img{
                    max-width:200px;
                    height: 45px;
                    vertical-align: middle;
               }
            }
        }
    }
</style>


<style lang="scss">
    .kyc-adminModal{
        .modal-container{
            margin-top:-200px;
        }
        .content{
            padding:0 0 20px 0;
            p{
                margin-bottom:10px;
            }
            .el-textarea__inner{
                height:80px;
            }
            .table-content{
                height:136px;
                overflow: auto;
                margin-top:-21px;
                table{
                    margin-top:-40px;
                }
            }
        }
    }

    table{
        .kyc-remark{
            .el-input{
                width:100%;
            }
        }
    }
</style>



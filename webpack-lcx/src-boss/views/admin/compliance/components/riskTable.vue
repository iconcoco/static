<template>
    <el-table :data="tableData" border >
        <el-table-column prop="fieldName" label="风险属性"></el-table-column>

        <el-table-column prop="fieldValue" label="属性值">
            <template slot-scope="scope">
                <!-- 证件类型 -->
                <template v-if="[
                    'hkDirectorIdcardType',
                    'identityType',
                    'cardType',
                ].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{idCard[scope.row.fieldValue-1]}}</span>
                    <el-select v-else v-model="scope.row.fieldValue" placeholder="请选择证件类型">
                        <el-option v-for="(idItem,idIndex) in idCard" 
                            :key="idIndex"
                            :label="idItem"   
                            :value="`${idIndex+1}`"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 生效和失效日期 -->
                <template v-else-if="[
                    'certificateDate',
                    'expiredDate',
                ].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{scope.row.fieldValue}}</span>
                    <el-date-picker
                        v-else
                        value-format="yyyy-MM-dd"
                        v-model="scope.row.fieldValue"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </template>

                <!-- 性别 -->
                <template v-else-if="['sex'].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{sexArr[scope.row.fieldValue-1]}}</span> 
                    <el-select v-else v-model="scope.row.fieldValue" placeholder="请选择性别">
                        <el-option v-for="(idItem,idIndex) in sexArr" 
                            :key="idIndex"
                            :label="idItem"   
                            :value="`${idIndex+1}`"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 国籍 -->
                <template v-else-if="['country','registerAddress','legalpersonCountry'].includes(scope.row.riskField)">
                   <span v-if="!(scope.row.isEdit==1)">{{nationObj[scope.row.fieldValue]}}</span> 
                    <el-select v-else v-model="scope.row.fieldValue" placeholder="请选择国籍">
                        <el-option v-for="(v,key) in nationObj" 
                            :key="key"
                            :label="v"   
                            :value="key"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 预计年销量 -->
                <template v-else-if="['businessVolume'].includes(scope.row.riskField)">
                   <span v-if="!(scope.row.isEdit==1)">{{fineValName(scope.row.fieldValue,salesVolume,'saleName','saleCode')}}</span> 
                    <el-select v-else v-model="scope.row.fieldValue" @change="(value)=>{ return changeCallBackSales(value,scope.row.riskField) }"  placeholder="请选择年销量">
                        <el-option v-for="(saleItem,key) in salesVolume" 
                            :key="key"
                            :label="saleItem.saleName"   
                            :value="saleItem.saleCode"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 平台 -->
                <template v-else-if="['platformCode'].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{fineValName(scope.row.fieldValue,platArr,'platformName','platformCode')}}</span> 
                    <el-select v-else v-model="scope.row.fieldValue" placeholder="请选择平台">
                        <el-option v-for="(platItem,key) in platArr" 
                            :key="key"
                            :label="platItem.platformName"   
                            :value="platItem.platformCode"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 名单筛选、负面新闻 -->
                <template v-else-if="['listScreening','legalpersonListScreening','legalpersonGoogleNews','googleNews'].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{fineValName(scope.row.fieldValue,googleNews,'googleNewsName','googleNewsCode')}}</span> 
                    <el-select v-else v-model="scope.row.fieldValue" @change="(value)=>{ return changeCallBack(value,scope.row.riskField) }" placeholder="请选择">
                        <el-option v-for="(platItem,key) in googleNews" 
                            :key="key"
                            :label="platItem.googleNewsName"   
                            :value="platItem.googleNewsCode"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 商品种类 -->
                <template v-else-if="['goodsType'].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{fineValName(scope.row.fieldValue,category,'productName','productCode')}}</span>
                    <el-select v-else v-model="scope.row.fieldValue" @change="(value)=>{ return changeCallBackWish(value,scope.row.riskField) }" placeholder="请选择商品种类">
                        <el-option v-for="(cateItem,key) in category" 
                            :key="key"
                            :label="cateItem.productName"   
                            :value="cateItem.productCode"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 企业注册时长 -->
                <template v-else-if="['registerDate'].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{fineValName(scope.row.fieldValue,registerDate,'registerDateName','registerDateCode')}}</span>
                    <el-select v-else v-model="scope.row.fieldValue"  @change="(value)=>{ return changeCallBack(value,scope.row.riskField) }" placeholder="请选择企业注册时长">
                        <el-option v-for="(cateItem,key) in registerDate" 
                            :key="key"
                            :label="cateItem.registerDateName"   
                            :value="cateItem.registerDateCode"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 企业经营范围 -->
                <template v-else-if="['bizScope'].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{fineValName(scope.row.fieldValue,bizScope,'bizScopeName','bizScopeCode')}}</span>
                    <el-select v-else v-model="scope.row.fieldValue" @change="(value)=>{ return changeCallBack(value,scope.row.riskField) }" placeholder="请选择商品种类">
                        <el-option v-for="(cateItem,key) in bizScope" 
                            :key="key"
                            :label="cateItem.bizScopeName"   
                            :value="cateItem.bizScopeCode"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 居住地 -->
                <template v-else-if="['address','legalpersonAddress'].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{fineValName(scope.row.fieldValue,provinceArr,'provinceName','provinceCode')}}</span>
                    <el-select v-else v-model="scope.row.fieldValue" placeholder="请选择省份">
                        <el-option v-for="(cateItem,key) in provinceArr" 
                            :key="key"
                            :label="cateItem.provinceName"   
                            :value="cateItem.provinceCode"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 企业类型 -->
                <template v-else-if="['enterpriseType'].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{fineValName(scope.row.fieldValue,enterpriseType,'enterpriseTypeName','enterpriseTypeCode')}}</span>
                    <el-select v-else v-model="scope.row.fieldValue" @change="(value)=>{ return changeCallBack(value,scope.row.riskField) }" placeholder="请选择企业类型">
                        <el-option v-for="(cateItem,key) in enterpriseType" 
                            :key="key"
                            :label="cateItem.enterpriseTypeName"   
                            :value="cateItem.enterpriseTypeCode"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 店铺经营时长 -->
                <template v-else-if="['bizTime'].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{fineValName(scope.row.fieldValue,dealInTime,'bizTimeName','bizTimeCode')}}</span>
                    <el-select v-else v-model="scope.row.fieldValue" @change="(value)=>{ return changeCallBack(value,scope.row.riskField) }" placeholder="请选择店铺经营时长">
                        <el-option v-for="(cateItem,key) in dealInTime" 
                            :key="key"
                            :label="cateItem.bizTimeName"   
                            :value="cateItem.bizTimeCode"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 店铺负面评价 -->
                <template v-else-if="['negativeComment'].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{fineValName(scope.row.fieldValue,negativeComment,'negativeCommentName','negativeCommentCode')}}</span>
                    <el-select v-else v-model="scope.row.fieldValue"  @change="(value)=>{ return changeCallBack(value,scope.row.riskField) }" placeholder="请选择店铺经营时长">
                        <el-option v-for="(cateItem,key) in negativeComment" 
                            :key="key"
                            :label="cateItem.negativeCommentName"   
                            :value="cateItem.negativeCommentCode"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 关系建立渠道 -->
                <template v-else-if="['registerChannel'].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{fineValName(scope.row.fieldValue,registerChannelType,'registerChannelName','registerChannelCode')}}</span>
                    <el-select v-else v-model="scope.row.fieldValue" @change="(value)=>{ return changeCallBack(value,scope.row.riskField) }" placeholder="请选择关系建立渠道">
                        <el-option v-for="(cateItem,key) in registerChannelType" 
                            :key="key"
                            :label="cateItem.registerChannelName"   
                            :value="cateItem.registerChannelCode"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 店铺价位 -->
                <template v-else-if="['goodsPrice'].includes(scope.row.riskField)">
                    <span v-if="!(scope.row.isEdit==1)">{{fineValName(scope.row.fieldValue,goodsPrice,'goodsPriceName','goodsPriceCode')}}</span>
                    <el-select v-else v-model="scope.row.fieldValue" @change="(value)=>{ return changeCallBack(value,scope.row.riskField) }" placeholder="请选择店铺价位">
                        <el-option v-for="(cateItem,key) in goodsPrice" 
                            :key="key"
                            :label="cateItem.goodsPriceName"   
                            :value="cateItem.goodsPriceCode"   
                        ></el-option>
                    </el-select>
                </template>

                <!-- 其他输入框 -->
                <template v-else>
                    <span v-if="!(scope.row.isEdit==1)">{{scope.row.fieldValue}}</span>
                    <el-input  v-else v-model="scope.row.fieldValue"></el-input>
                </template>
            </template>
        </el-table-column>

        <el-table-column prop="riskLevel" label="风险等级">
            <template slot-scope="scope">
                <span v-if="scope.row.riskLevel==1"><i class="point ING"></i>低</span>
                <span v-else-if="scope.row.riskLevel==2"><i class="point warning"></i>中</span>
                <span v-else-if="scope.row.riskLevel==3"><i class="point no"></i>高</span>
                <span v-else-if="scope.row.riskLevel==4"><i class="point no"></i>高</span>
                <span v-else>N/A</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import {
    enterpriseType,
    goodsPrice,
    negativeComment,
    registerChannelType,
    salesVolume,
    category,
    dealInTime,
    googleNews,
    bizScope,
    registerDate,
    queryPlatform,
    queryProvince
} from '../../../../ext/localBase.js';

export default {
    props:['tableData'],
    data(){
        return {
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
            salesVolume:salesVolume, 
            googleNews:googleNews, 
            category:category, 
            registerDate:registerDate, 
            dealInTime:dealInTime, 
            enterpriseType:enterpriseType, 
            negativeComment:negativeComment, 
            registerChannelType:registerChannelType, 
            bizScope:bizScope, 
            goodsPrice:goodsPrice, 
            platArr:[],
            provinceArr:[],
        }
    },
    created(){
        Promise.all([
            queryPlatform(),
            queryProvince(),
        ]).then(([a,b])=>{
            this.platArr = a;
            this.provinceArr = b;
        });
    },
    methods:{
        changeCallBackWish(value,riskField){
             this.tableData.forEach(item=>{
                if(item.riskField==riskField){
                    let level = null;
                    if(value==13){
                        level = 3;
                    }else if(value==2){
                        level = 2;
                    }else{
                        level = 1;
                    };
                    item.riskLevel = level
                }
            })
        },
        changeCallBackSales(value,riskField){
            this.tableData.forEach(item=>{
                if(item.riskField==riskField){
                     let level = null;
                    if(value==4){
                        level = 3;
                    }else if(value==3){
                        level = 2;
                    }else{
                        level = 1;
                    }
                    item.riskLevel = level;
                }
            })
        },
        changeCallBack(value,riskField){
            this.tableData.forEach(item=>{
                if(item.riskField==riskField){
                    item.riskLevel = value >= 4 ? 3 : value;
                }
            })
        },
        fineValName(code,LIST,NAME,itemCode){
            let I = LIST.find(item=>{
                return item[itemCode]==code;
            });
            if(I){
                return I[NAME];
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    
    table{
        tbody{
            td{
                .el-select,
                .el-input{
                    width: 90%;
                }
            }
        }
    }
</style>

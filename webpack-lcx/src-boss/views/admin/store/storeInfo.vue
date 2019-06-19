<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form class="admin-form-inline" :inline="true" :model="form">

                 <el-form-item label="店铺ID：">
                    <el-input v-model="form.storeId" placeholder="请输入店铺ID"></el-input>
                </el-form-item>

                <el-form-item label="客户ID：" >
                    <el-input  v-model="form.customerNo" placeholder="请输入客户ID"></el-input>
                </el-form-item>

                 <el-form-item label="店铺名称：">
                    <el-input v-model="form.storeName" placeholder="请输入店铺名称"></el-input>
                </el-form-item>

                 <el-form-item label="客户名称：" >
                    <el-input  v-model="form.customerName" placeholder="请输入客户名称"></el-input>
                </el-form-item>



                <el-form-item label="店铺所属平台："  class="customer_sale_item">
                    <el-select v-model="form.platformCode" placeholder="请选择店铺所属平台">
                        <el-option v-for="(item,index) in Platform" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="店铺所在国家："  class="customer_sale_item">
                    <el-select v-model="form.storeCountry" placeholder="请选择店铺所属国家">
                         <el-option v-for="(item,index) in NationCode" :key="index"
                            :label="item.nation"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <!-- <el-form-item label="店铺状态：">
                    <el-select v-model="form.status" placeholder="请选择授权状态">
                        <el-option v-for="(item,index) in storeStatus" :key="index"
                            :label="item.status"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item label="授权状态：">
                    <el-select v-model="form.authStatus" placeholder="请选择授权状态">
                        <el-option v-for="(item,index) in storeAuthenStatus" :key="index"
                            :label="item.status"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="连续无入账天数：">
                    <el-slider
                        v-model="Ranges"
                        range
                        :max="100">
                    </el-slider>
                </el-form-item>


                <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
                <el-button type="success" @click="uploadEtsyFile(true)">ETSY文件上传</el-button>
            </el-form>
            <div> 
                <!-- <el-checkbox label="忽略连续60天及以上无入账的店铺"></el-checkbox> -->
                <ul class="filter">
                     <li>
                        <span>{{TotalShow.authNumber}}</span>
                        <p>已授权</p>
                    </li>
                    <li>
                        <span>{{TotalShow.unauthNumber}}</span>
                        <p>未授权</p>
                    </li>
                    <li>
                        <span>{{TotalShow.invalidNumber}}</span>
                        <p>授权失效</p>
                    </li>
                    <li>
                        <span>{{TotalShow.errorNumber}}</span>
                        <p>超过14天无入账</p>
                    </li>
                </ul>
            </div>
        </div>

        <div class="table-container">
             <div class="admin-tab-title">店铺信息管理</div>

             <el-table :data="table" border >
                <el-table-column width="160" prop="customerNo" label="客户ID"></el-table-column>
                <el-table-column width="160" prop="storeId" label="店铺ID"></el-table-column>
                <el-table-column prop="storeName" label="店铺名称"></el-table-column>
                <el-table-column prop="customerName" label="客户名称"></el-table-column>
                <el-table-column prop="platformCode" label="店铺所属平台">
                    <template slot-scope="scope">
                        {{platformName(scope.row.platformCode)}}
                    </template>
                </el-table-column>
                <el-table-column label="店铺所属国家">
                    <template slot-scope="scope">
                        {{countryName(scope.row.storeCountry)}}
                    </template>
                </el-table-column>
                <el-table-column prop="authStatus" label="是否授权">
                    <template slot-scope="scope">
                        <span class="waiting" v-if="scope.row.authStatus==2">授权失效</span>
                        <span class="yes" v-if="scope.row.authStatus==1">已授权</span>
                        <span class="no" v-if="scope.row.authStatus==0">未授权</span>
                    </template>
                </el-table-column>
                <el-table-column prop="intervalDay" label="连续无入账天数"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <a class="primary" @click="bindToShopDe(scope.row.storeId,scope.row.storeCountry)" href="javascript:;">查看详情</a>
                    </template>
                </el-table-column>
             </el-table>

             <Pagination 
                :page="form.pageNumber"
                :pageSize="form.pageSize"
                :count="form.totalSize"
                :chosefallback="pageChange"
            ></Pagination>
        </div>
        
        <!-- etsy文件上传 -->
        <AdminModal 
            v-model="etsyForm.flag"
            :confirm="etsyFormConfirm"
        >
            <el-form :model="etsyForm"  class="admin-form-inline suspicious-form" :inline="true">
                <el-form-item label="客户编号">
                    <el-input v-model="etsyForm.customerNo" placeholder="请输入客户编号"></el-input>
                </el-form-item>
                <el-form-item  label="店铺 ID">
                    <el-input v-model="etsyForm.storeId" placeholder="请输入店铺ID"></el-input>
                </el-form-item>
                <el-form-item label="文件">
                    <el-upload
                        ref="upload"
                        :show-file-list='false'
                        :auto-upload="false"
                        :action="etsyUploadFile"
                        :data="uploadData"
                        :on-change="onUploadChange"
                        :on-error="bindUploadError"
                        :on-success="bindUploadSuccess"
                        style="display:inline-block;"
                        >
                        <el-button type="success">上传文件</el-button>
                        <i v-if="etsyForm.file" class="el-icon-success yes"></i>
                    </el-upload>

                    <!-- <input type="file" ref="upload"/> -->
                </el-form-item>
            </el-form>
        </AdminModal>
    </div>
</template>

<script>
import {queryPlatform,NationCode,storeStatus} from '../../../ext/localBase.js';

import AdminModal from './../../../components/adminModal.vue';

 import {
        queryStoreFollowInfo,
        etsyUploadFile,
    } from '../../../utils/axios/api.js';

import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return{
             form:{
                    storeId:'',
                    platformCode:'',
                    storeName:'',
                    customerNo:'',
                    customerName:'',
                    storeCountry:'',
                    authStatus:'',
                    startDay:'',
                    endDay:'',
                    // status:'',

                    pageNumber:'1',
                    pageSize:'10',
                    totalSize:'1'
            },
            TotalShow:{
                authNumber:0,
                errorNumber:0,
                unauthNumber:0,
                invalidNumber:0,
            },
            Ranges:[0,60],
            Platform:[],
            table:[],
            storeAuthenStatus:[
                {code:0,status:'未授权'},
                {code:1,status:'已授权'},
                {code:2,status:'授权失效'},
            ],
            storeStatus:storeStatus,
            NationCode:NationCode,

            etsyUploadFile:etsyUploadFile,
            etsyForm:{
                flag:false,
                file:'',
                customerNo:'',
                storeId:'',
            },
            uploadData:{
                customerNo:'',
                storeId:'',
            }
        }
    },
    methods:{
        __LOADING(){
            this.loadingQuery(this.form),
            queryPlatform().then(res=>{
                this.Platform = res;
            });
        },
        loadingQuery(params){
            let Data = Object.assign({},params);
            Data.startDay= this.Ranges[0];
            Data.endDay= this.Ranges[1];

            queryStoreFollowInfo(Data).then(res=>{
                if(res.code==0){
                    this.table = res.data.pageVo.list;
                    this.form.totalSize = res.data.pageVo.totalSize;

                    this.TotalShow = res.data.storeFollowUpCountVo
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        uploadEtsyFile(bol){
            this.etsyForm.flag = bol;
        },
        etsyFormConfirm(){

            if(!this.etsyForm.customerNo) return this.$message.warning(`输入客户编号`);
            if(!this.etsyForm.storeId) return this.$message.warning(`输入店铺ID`);
            // if(!this.$refs.upload.$refs['upload-inner'].fileList.length) return this.$message.warning(`请上传文件`);
            if(!this.etsyForm.file) return this.$message.warning(`请上传文件`);

            this.uploadData.customerNo = this.etsyForm.customerNo;
            this.uploadData.storeId = this.etsyForm.storeId;
           
            // etsyUploadFile(this.etsyForm)
            this.$refs.upload.submit();
        },

        bindToSubmit(){
                this.form.pageNumber = 1;
                this.loadingQuery(this.form);
        },
        reset(){
              let n = ['pageNumber','pageSize','totalSize'];
                for (const key in this.form) {
                    if(n.indexOf(key)<0){
                        this.form[key] = "";
                    }
                }
        },

        onUploadChange(file){
            this.etsyForm.file = file.status == 'ready'
        },
        bindUploadSuccess(res){
            if(res.code==0){
                this.$message.success(`上传成功！`);
                this.uploadEtsyFile(false);
            }else{
                this.$message.error(res.msg);
            }
        },
        bindUploadError(){
            this.$message.error(`上传失败，请重新上传！`);
        },
         //页码选择的时候
        pageChange(n,pageSize){
            this.form.pageNumber = n;
            this.form.pageSize = pageSize;
            this.loadingQuery(this.form);
        },
        bindToShopDe(storeId,storeCountry){
            this.$router.push({
                name:"storeDetails",
                params:{
                    storeId,
                    storeCountry
                }
            });
        },
        countryName(code){
            let str = null;
            NationCode.forEach(item=>{
                if(item.code==code){ str = item.nation }
            }) ;
            return str;
        },
        platformName(code){
            let str = null;
            this.Platform.forEach(item=>{
                if(item.platformCode==code){ str = item.platformName }
            }) ;
            return str;
        },


    },
    watch:{
        "etsyForm.flag"(){
            this.etsyForm.file = false;
        }
    },
    components:{
        AdminModal
    }
}
</script>


<style lang="scss" scoped>
@import './../../../css/element-variables.scss';
.filter{
    padding-top: 20px;
    li{
        display: inline-block;
        margin-right: 10px;
        width: 100px;
        height:60px;
        text-align: center;
        font-size: 13px;
        padding: 10px 0;
        border-radius: 4px;
        background-color: rgb(241, 248, 252);
        p{
            line-height: 24px;
        }
        span{
            color: $--color-primary;
            font-size: bold;
        }
    }
}
</style>



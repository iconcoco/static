<template>
 <transition name="fade">
    <div>
        <div class="table-container KYC-index">
            <el-form class="admin-form-inline subAccount-form" :inline="true" :model="form">

              <el-form-item label="分配日期：">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.allotStartTime"
                        type="date"
                        placeholder="分配开始时间">
                    </el-date-picker>
                    -
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.allotEndTime"
                        type="date"
                        placeholder="分配结束时间">
                    </el-date-picker>
              </el-form-item>

              <el-form-item label="激活日期：">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.activeStartTime"
                        type="date"
                        placeholder="激活开始时间">
                    </el-date-picker>
                    -
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.activeEndTime"
                        type="date"
                        placeholder="激活结束时间">
                    </el-date-picker>
              </el-form-item>

              <el-form-item label="状态状况：">
                  <el-select v-model="form.status" placeholder="请选择">
                    <el-option label="未分配" value="0"></el-option>
                    <el-option label="已分配" value="1"></el-option>
                    <el-option label="预激活" value="2"></el-option>
                    <el-option label="已激活" value="3"></el-option>
                  </el-select>
              </el-form-item>

              <el-form-item label="海外银行：">
                  <el-select v-model="form.bankCode" placeholder="请选择银行">
                     <el-option v-for="(item,index) in  ForeigBank" :key="index"
                            :label="item.bankName"
                            :value="item.bankCode"
                        ></el-option>
                  </el-select>
              </el-form-item>

              <el-form-item label="国内渠道：">
                  <el-select v-model="form.channelCode" placeholder="请选择渠道">
                     <el-option v-for="(item,index) in  ChannelArr" :key="index"
                            :label="item.channelName"
                            :value="item.channelCode"
                        ></el-option>
                  </el-select>
              </el-form-item>
              
              <el-form-item label="币种：">
                  <el-select v-model="form.currency" placeholder="请选择渠道">
                     <el-option v-for="(item,index) in  CurrencyArr" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                  </el-select>
              </el-form-item>

              <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
              <el-button @click="reset" type="primary">重置</el-button>

              <el-button @click="bindToShowModal" type="success">上传子账号文件</el-button>


            </el-form>

        </div>
        
        <div  class="table-container">
            <div class="admin-tab-title">子账号管理列表</div>
            
            <ul class="countZoom" v-if="count.length">
                <li v-for="(item, index) in count" :key="index">
                    <span>{{IBCbank(item.bankCode)}}-{{item.currency}}：</span>
                    <span>已分配<i>{{item.allocated}}</i>个</span>
                    <span>未分配<i>{{item.undistributed}}</i>个</span>
                    <span>已激活<i>{{item.activated}}</i>个</span>
                    <span>预激活<i>{{item.preActivated}}</i>个</span>
                    <span>总数<i>{{item.amount}}</i>个</span>
                </li>
            </ul>
            
            <el-table :data="table" border >
                <el-table-column width="90" prop="subAccount" label="子账号"></el-table-column>
                <el-table-column prop="currency" label="币种"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==0">未分配</span>
                        <span class="yes" v-if="scope.row.status==1">已分配</span>
                        <span class="ing" v-if="scope.row.status==2">预激活</span>
                        <span class="yes" v-if="scope.row.status==3">已激活</span>     
                    </template>
                </el-table-column>
                <el-table-column width="145" prop="allotTime" label="分配时间"></el-table-column>
                <el-table-column width="145" prop="activeTime" label="激活时间"></el-table-column>

                <el-table-column width="145" prop="" label="客户ID"></el-table-column>
                <el-table-column width="145" prop="storeId" label="店铺ID"></el-table-column>
                <el-table-column prop="" label="店铺名称"></el-table-column>

                <el-table-column label="国内渠道">
                    <template slot-scope="scope">
                        {{ChannelName(scope.row.channelCode)}}
                    </template>
                </el-table-column>
                <el-table-column label="海外银行">
                    <template slot-scope="scope">
                        {{IBCbank(scope.row.bankCode)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <a v-if="scope.row.bankCode=='IBC'&& (scope.row.status==1 || scope.row.status==2)" class="primary" @click="bindToModify(scope.row.id)" href="javascript:;">激活</a>
                    </template>
                </el-table-column>
            </el-table>

             <Pagination 
                :page="form.pageNum"
                :pageSize="form.pageSize"
                :count="form.totalPages"
                :chosefallback="pageChange"
            ></Pagination> 

            
            <AdminModel
                title="上传子账号文件"
                confirmTxt="确认"
                v-model="isShow" 
                :confirm="bindRateConfirm"
                class="customer-details-adminModal"
            >
                <el-form :model="tableForm" :inline="true">

                    <el-form-item v-if="tableForm.bankCode != 'IBC'" label="选择币种：">
                        <el-select v-model="tableForm.currencyCode" placeholder="请选择币种">
                            <el-option label="所有" value=""></el-option>
                            <el-option label="EUR" value="EUR"></el-option>
                            <el-option label="GBP" value="GBP"></el-option>
                            <el-option label="USD" value="USD"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="海外银行：">
                        <el-select v-model="tableForm.bankCode" placeholder="请选择银行">
                            <el-option v-for="(item,index) in  ForeigBank" :key="index"
                                    :label="item.bankName"
                                    :value="item.bankCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- :show-file-list='false' -->
                    <el-upload
                        name='upFile'   
                        :action="actionsUpload"
                        :beforeUpload="beforeAvatarUpload"
                        id="hkBizCertification"
                        :on-success="function(res,file){ return bindUploadSuccess(res,file,'hkBizCertification') }"
                        :on-error="bindUploadError"
                        :on-remove="bindUploadFileExceed"
                        class="modle_upload"
                        >
                        <el-button class="upload_btn" type="success">上传文件</el-button>
                    </el-upload>
                   

                </el-form>
            </AdminModel>
            
        </div>
    </div>
 </transition>
</template>

<script>

    import {
        queryForeignBank,
        queryChannel,
        queryCurrency
    } from '../../../ext/localBase.js';

    import $ from 'jquery';

    import { dataReshow } from '../../../utils/common.js'

    import {qeurySubAccount,
            qeurySubAccountAetail,
            upload,
            importSubAccount,
            updateSubAccountStatus
    } from '../../../utils/axios/api.js';

    import AdminModel from '../../../components/adminModal.vue';

    import mixin from '../../../ext/mixin.js';

    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                    allotStartTime:'',
                    allotEndTime:'',
                    activeStartTime:'',
                    activeEndTime:'',
                    status:'',
                    bankCode:'',
                    channelCode:'',
                    currency:'',

                    pageNum:'1',
                    pageSize:'10',
                    totalPages:'1'
                },
                table:[],
                count:[],

                ForeigBank:[],
                ChannelArr:[],
                CurrencyArr:[],

                actionsUpload:upload,
                isShow:false,
                tableForm:{
                    bankCode:"",
                    currencyCode:"",
                    fileId:"",
                }
            }
        },
        watch:{
           "tableForm.bankCode"(n){
               if(n=='IBC'){ this.tableForm.currencyCode='';}
           }
        },
        methods:{
            __LOADING(){
                this.loadingQuery(this.form),
                //渠道和国外银行的请求
                Promise.all([
                    queryChannel(),
                    queryForeignBank(),
                    queryCurrency(),
                ]).then(res=>{
                    let [a,b,c] = res;
                    this.ChannelArr = a;
                    this.ForeigBank = b;
                    this.CurrencyArr = c;
                });
            },
            loadingQuery(params){

                qeurySubAccountAetail(params).then(res=>{
                    if(res.code==0){
                        this.table = res.data.content;
                         this.form.totalPages = res.data.totalPages

                    }else{
                        this.$message.error(res.msg);
                    }
                });
                //统计结果
                qeurySubAccount().then(res=>{
                    if(res.code==0){
                        this.count = res.data;
                    }else{
                       this.$message.error(res.msg); 
                    }
                });
            }, //确认查询按钮
            bindFormSubmit(){
                this.form.pageNum = 1;
                this.loadingQuery(this.form);
            },
            reset(){
                this.form = {
                    allotStartTime:'',
                    allotEndTime:'',
                    activeStartTime:'',
                    activeEndTime:'',
                    status:'',
                    bankCode:'',
                    channelCode:'',
                    pageNum:'1',
                    pageSize:'10',
                    totalPages:'1'
                };
            },
            bindToShowModal(){
                this.isShow = true;
            },
            bindRateConfirm(){
                if(!this.tableForm.bankCode) return this.$message.warning(`请选择海外银行`);
                if(!this.tableForm.fileId) return this.$message.warning(`请选择上传的文件`);

                if(this.tableForm.bankCode != 'IBC' && !this.tableForm.currencyCode){ return this.$message.warning(`请选择子账号币种`) };

                importSubAccount(this.tableForm).then(res=>{
                    if(res.code==0){
                        this.$message.success(`导入成功！`);
                        this.isShow = false;
                        this.loadingQuery(this.form);
                        //清空所选项
                        for (const key in this.tableForm) {
                            this.tableForm[key]="";
                        };
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            beforeAvatarUpload(file){
                let fileType = file.name.substring(file.name.lastIndexOf('.')+1).toUpperCase();
                if(fileType=='XLS'||fileType=='XLSX'){
                    return true;
                }else{
                    this.$message.error(`只能上传xls、xlsx格式的文件!`);
                    return false;
                }
            },
            bindUploadSuccess(res,fild,name){
                if(res.code==0){
                    $(`#${name}`).find('.el-upload-list li').length>1 && $(`#${name}`).find('.el-upload-list li').eq(0).hide(500,function(){ $(this).remove() });
                    this.tableForm.fileId = res.data.uuid;
                }else{
                    this.$message.error(res.msg);
                }
            },
            bindUploadError(){
                this.$message.error(`上传失败，请重新上传！`);
            },
            bindUploadFileExceed(){
                this.tableForm.fileId = '';
            },
            bindToModify(id){
                 this.$confirm('确定要激活该子账号吗？', '确认激活', {
                        confirmButtonText: '激活',
                        cancelButtonText: '取消'
                }).then(()=>{
                     updateSubAccountStatus({id}).then(res=>{
                         if(res.code==0){
                             this.$message.success(`激活成功！`);
                             this.loadingQuery(this.form);
                         }else{
                             this.$message.error(res.msg);
                         }
                     });
                }).catch(()=>{})
            },
            IBCbank(code){
                return dataReshow(this.ForeigBank,'bankName','bankCode',code);
            },
            ChannelName(code){
                return dataReshow(this.ChannelArr,'channelName','channelCode',code);
            },
            //页码改变
            pageChange(n,pageSize){
                this.form.pageNum = n;
                this.form.pageSize = pageSize;
                this.loadingQuery(this.form);
            }
        },
        components:{
            AdminModel
        },
    }
</script>



<style lang="scss" scoped>
    .countZoom{
        margin: 20px 0;
        background-color: #f0f9eb;
        border:1px solid #c2e7b0;
        padding-left: 40px;
        border-radius:4px;
        li{
            line-height: 30px;
            font-size: 12px;
            color: #333;
            span{
                margin-right: 5px;
            }
            i{
                color: red;
                margin: 0 2px;
            }
        }
    }
    .customer-details-adminModal{
        form{
            text-align: left;
        }
        .el-form-item{
            margin-bottom: 0px;
        }

        .modle_upload{
            position: relative;
            .upload_btn{
                position: absolute;
                top: -40px;
                right: 10px;
            }
        }
       
    }
</style>

<style lang="scss">
    .admin-form-inline.subAccount-form {
        .el-form-item__label{
            width: 84px;
        }
        .el-form-item__content{
            width: auto;
        }
    }
</style>


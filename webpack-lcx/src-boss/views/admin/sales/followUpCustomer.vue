<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form :inline="true" class="admin-form-inline" :model="reportForm">
                <el-form-item label="销售简报：" class="widthAuto">
                    <el-date-picker
                        type="daterange"
                        v-model="reportTime"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        @change="queryStatistic"
                        >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <ul class="filter">
                <li class="up one" @click="filterSubmit(1)">
                    <p>3天未跟进</p>
                    <p>{{followData.day3}}</p>
                </li>
                <li class="up two" @click="filterSubmit(2)">
                    <p>7天未跟进</p>
                    <p>{{followData.day7}}</p>
                </li>
                <li class="up three" @click="filterSubmit(3)">
                    <p>14天未跟进</p>
                    <p>{{followData.day14}}</p>
                </li>
                <li class="up four" @click="filterSubmit(4)">
                    <p>超时未跟进</p>
                    <p>{{followData.over14}}</p>
                </li>

                <li class="left one">
                    <span class="fa fa-crosshairs"></span>
                    <div>
                        <p>跟进次数</p>
                        <p>{{reportForm.followCount}}</p>
                    </div>
                </li>
                <li class="left two">
                    <span class="fa fa-user-plus"></span>
                    <div>
                        <p>新增客户</p>
                        <p>{{reportForm.userCount}}</p>
                    </div>
                </li>
                <li class="left three">
                    <span class="fa fa-users"></span>
                    <div>
                        <p>客户总数</p>
                        <p>{{reportForm.userTotal}}</p>
                    </div>
                </li>
                <li class="left four">
                    <span class="fa fa-refresh"></span>
                    <div>
                        <p>有效转化</p>
                        <p>{{reportForm.activeUserCount}}</p>
                    </div>
                </li>
            </ul>
        </div>

        <Block
            title="客户列表"
        >
            <el-form :inline="true" class="admin-form-inline" :model="form">
                    
                    <el-form-item label="客户姓名：">
                        <el-input v-model="form.name" placeholder="请输入客户姓名"></el-input>
                    </el-form-item>

                    <el-form-item label="公司名称：">
                        <el-input v-model="form.company" placeholder="请输入公司名称"></el-input>
                    </el-form-item>

                    <el-form-item label="手机号码：">
                        <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
                    </el-form-item>

                    <el-form-item label="跟进人：">
                        <el-select v-model="form.distrUser" placeholder="请选择跟进人">
                            <el-option v-for="(item,index) in saleStatusData" :key="index"
                                :label="item.userName"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="客户状态：">
                        <el-select v-model="form.status" placeholder="请选择跟进人">
                            <el-option v-for="(item,index) in customerStatusData"
                                :key="index"
                                :value="item.key"
                                :label="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="录入时间" class="widthAuto">
                        <el-date-picker
                            type="daterange"
                            v-model="createdTime"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :clearable="false"
                            >
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="最后跟进时间" class="widthAuto">
                        <el-date-picker
                            type="daterange"
                            v-model="followTime"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :clearable="false"
                            >
                        </el-date-picker>
                    </el-form-item>

                    <el-button type="warning" @click="changModelStatus(true)" plain>导入客户报表</el-button>
                    <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                    <el-button @click="reset" type="primary">重置</el-button>
                    <el-button type="success" @click="bindToAdd">新增</el-button>
            </el-form>
           
            <el-table :data="table" border >
                <el-table-column prop="name" label="客户姓名"></el-table-column>
                <el-table-column prop="company" label="公司名称"></el-table-column>
                <el-table-column prop="businessScope" label="经营范围"></el-table-column>
                <el-table-column prop="businessChannelDesc" label="经营渠道"></el-table-column>
                <el-table-column prop="amountScope" label="月交易额度">
                    <template slot-scope="scope">
                        {{amountScopeName(scope.row.amountScope)}}
                    </template>
                </el-table-column>
                <el-table-column prop="payTypeDesc" label="现有收款方式"></el-table-column>
                <el-table-column prop="phone" width="100" label="手机"></el-table-column>
                <el-table-column prop="distrUserName" label="跟进人"></el-table-column>
                <el-table-column prop="status" label="客户状态">
                    <template slot-scope="scope">
                       {{statusFormat(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column prop="createdTime" width="150" label="录入时间">
                    <template slot-scope="scope">
                        {{formatTimer(scope.row.createdTime)}}
                    </template>
                </el-table-column>
                 <el-table-column prop="lastFollowTime" width="150" label="最后跟进时间">
                    <template slot-scope="scope">
                        {{formatTimer(scope.row.lastFollowTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <a class="primary" @click="bindToFollowDetail(scope.row.id)" href="javascript:;">查看详情</a>
                    </template>
                </el-table-column>
            </el-table>

            <template v-if="witchForm==1">
                <Pagination 
                    :page="form.page"
                    :pageSize="form.size"
                    :count="form.totalPages"
                    :chosefallback="pageChange"
                ></Pagination>
            </template>

            <template v-else>
                <Pagination 
                    :page="fillterForm.page"
                    :pageSize="fillterForm.size"
                    :count="fillterForm.totalPages"
                    :chosefallback="fillterPageChange"
                ></Pagination>
            </template>
        </Block>

        <AdminModel 
            v-model="showModel"
            :confirm="toUpload"
            title="导入客户"
        >
            <el-upload
                ref="upload"
                name='file'
                :action="actionsUpload"
                :on-success="bindUploadSuccess"
                :auto-upload="false"
                :file-list="fileList"
                :limit="1"
                :on-exceed="bindUploadexceed"
                >
                    <div class="upload-container">
                        <el-button type="success">上传</el-button>
                    </div>
            </el-upload>
        </AdminModel>
    </div>
</template>

<script>

 import {
     queryCustomerStatus,
     queryAbleSale,
     salesVolume
} from '../../../ext/localBase.js';

import { 
    getDisFollowStatistic,
    getCustomerList,
    getStatistic,
    importCustomerByExcel
} from './../../../utils/axios/api.js';

 import {formatTimer} from '../../../utils/common.js'; 

 import AdminModel from './../../../components/adminModal.vue';

 import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return {
            actionsUpload:importCustomerByExcel,
            followData:{
                day3: 1,
                day7: 0,
                day14: 0,
                over14: 2
            },
            reportForm:{
                activeUserCount: 0,
                followCount: 4,
                userCount: 6,
                userTotal: 7
            },
            reportTime:[],
            form:{
                name:"",
                company:"",
                phone:"",
                status:"",
                distrUser:"",
                startCreatedTime:"",
                endCreatedTime:"",
                startFollowTime:"",
                endFollowTime:"",

                isDistr:'1',
                page:1,
                size:10,
                totalPages:1
            },
            fillterForm:{
                isDistr:'1',
                disFollowType:'',
                page:1,
                size:10,
                totalPages:1
            },
            table:[],

            showModel:false,

            fileList:[],

            witchForm:1,


            followTime:[],
            createdTime:[],

            customerStatusData:[],
            saleStatusData:[],
            salesVolume:salesVolume,
        }
    },
    methods:{
        __LOADING(){
            this.reportTime=[
                formatTimer(new Date().getTime()-7*24*60*60*1000,true),
                formatTimer(new Date().getTime(),true)
            ],
            this.loadingQuery(this.form),
            this.queryStatistic(),
            this.queryDisFollow(),
            Promise.all([
                queryCustomerStatus(),
                queryAbleSale(),
            ]).then(([a,b])=>{
                this.customerStatusData = a;
                this.saleStatusData = b;
            });
        },
        filterSubmit(index){
            this.fillterForm.disFollowType = index;
            this.filterQuery();
        },
        filterQuery(){
            this.witchForm = 0;
            getCustomerList(this.fillterForm).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                    this.fillterForm.totalPages = res.page.total;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        loadingQuery(parmas){
            this.witchForm = 1;
            getCustomerList(parmas).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                    this.form.totalPages = res.page.total;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        queryStatistic(){
            getStatistic({
                startTime:this.reportTime[0],
                endTime:this.reportTime[1]
            }).then(res=>{
                if(res.code==0){
                    this.reportForm = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        queryDisFollow(){
            getDisFollowStatistic().then(res=>{
                if(res.code==0){
                    this.followData = res.data
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindToSubmit(){
            this.form.page = 1;

            this.form.startCreatedTime = this.createdTime[0];
            this.form.endCreatedTime = this.createdTime[1];
            this.form.startFollowTime = this.followTime[0];
            this.form.endFollowTime = this.followTime[1];

            this.loadingQuery(this.form);
        },
        reset(){
            let n = ['page','size','totalPages','isDistr'];
            for (const key in this.form) {
                if(n.indexOf(key)<0){
                    this.form[key] = ""
                }
            };

            this.followTime = [],
            this.createdTime =[];
        },
         pageChange(n,per){
           this.form.page = n;
           this.form.size = per;
           this.loadingQuery(this.form);
        },
        fillterPageChange(n,per){
            this.fillterForm.page = n;
            this.fillterForm.size = per;
            this.filterQuery();
        },
        changModelStatus(bol){
            this.showModel = bol;
        },
        toUpload(){
            // this.$refs.upload.submit();
            if(!this.$refs.upload.uploadFiles.length) return  this.$message.warning(`请选择文件`);
            this.$refs.upload.submit();
        },
        bindToFollowDetail(id){
            let data = null
            this.table.forEach(item=>{
                if(item.id == id) data = item;
            });
             this.$router.push({
                name:'followCustomerDetail',
                params:{
                    data
                }
            });
        },
        bindToAdd(){
            this.$router.push({
                name:'addCustomerInfo'
            })
        },
        bindUploadSuccess(res){
            if(res.code==0){
                this.$message.success('上传成功');
                this.fileList=[];
                this.changModelStatus(false)
            }else{
                this.fileList=[];
                this.$message.error(res.msg);
            }
        },
        bindUploadexceed(files, fileList){
            this.$message.warning(`一次只允许上传一份文件！`);
        },
        formatTimer(code){
            return formatTimer(code)
        },
        statusFormat(code){
            let str = null
            this.customerStatusData.forEach(item=>{
                item.key == code && (str = item.value)
            });
            return str;
        },
        amountScopeName(code){
            let str = null
            this.salesVolume.forEach(item=>{
                item.saleCode == code && (str = item.saleName)
            });
            return str;
        }
    },
    components:{
        AdminModel
    },
}
</script>

<style lang="scss" scoped>
$color-one:#5268BE;
$color-two:rgba(255, 153, 51, 1);
$color-three:rgba(239, 90, 161, 1);
$color-four:rgba(255, 51, 51, 1);

.filter{
    li{
        display: inline-block;
        width: 120px;
        height: 60px;
        margin-right: 15px;
        border-radius: 4px;
        box-shadow: 0 0 10px 0px rgba(0,0,0,.2);
        vertical-align: middle;
        overflow: hidden;
        p{
            height: 50%;
            line-height: 30px;
            text-align: center;
            &:nth-child(2){
                font-size: 16px;
                font-weight: bold;
            }
        }
        >span{
            width: 30%;
            display: inline-block;
            vertical-align: middle;
            text-align: right;
            font-size: 26px;
            margin-right: 8px;
        }
        >div{
            display: inline-block;
            vertical-align: middle;
        }
    }

    .up{
        cursor: pointer;
        &.one{
            p{
                &:first-child{
                    background-color: $color-one;
                    color: #fff;
                }
                &:nth-child(2){
                    color: $color-one;
                }
            }
        }
        &.two{
            p{
                &:first-child{
                   background-color: $color-two;
                    color: #fff;
                }
                &:nth-child(2){
                    color: $color-two;
                }
            }
        }
        &.three{
            p{
                &:first-child{
                   background-color: $color-three;
                    color: #fff;
                }
                &:nth-child(2){
                    color: $color-three;
                }
            }
        }
        &.four{
            p{
                &:first-child{
                   background-color: $color-four;
                    color: #fff;
                }
                &:nth-child(2){
                    color: $color-four;
                }
            }
        }

    }
    .left{
        &.one span{ color: $color-one}
        &.two span{ color: $color-two}
        &.three span{ color: $color-three}
        &.four span{ color: $color-four}
        p{
            &:first-child{
                color: #333;
            }
            &:nth-child(2){
                color: #5268BE;
            }
        }
    }
}

.upload-container{
    text-align: center;
    padding-top: 20px;
}
</style>

<template>
    <div>
        <div class="table-container">
            <ul class="monitoring clearfix">
                <li>监控简报</li>
                <li @click="clcikCheckReport(1)" :class="{active:activeLi==1}" class="can-select first">所有店铺当前周期</li>
                <li @click="clcikCheckReport(2)" :class="{active:activeLi==2}" class="can-select">当前店铺所有周期</li>
                <li @click="clcikCheckReport(3)" :class="{active:activeLi==3}" class="can-select last">所有店铺所有周期</li>
                <li class="result warning">Alert：{{reportData ? reportData.alert : 0}}</li>
                <li class="result success">Closed：{{reportData ? reportData.closed : 0}}</li>
                <li class="result danger">Escalated：{{reportData ? reportData.escalated : 0}}</li>

                <li style="float:right">
                    <span class="el-icon-arrow-up primary arrow" @click="bindChangeSliderStatus('report')" :class="{active:slider.report}"></span>
                </li>
            </ul>

            <div v-show="slider.report">
                <el-form class="admin-form-inline" :inline="true" :model="form">
                    <el-form-item label="店铺ID：">
                        <el-input v-model="form.storeId" placeholder="请输入店铺ID"></el-input>
                    </el-form-item>

                    <el-form-item label="店铺名称：">
                        <el-input v-model="form.storeName" placeholder="请输入店铺名称"></el-input>
                    </el-form-item>

                    <el-form-item label="平台：">
                        <el-select v-model="form.platformCode" placeholder="请选择平台">
                            <el-option v-for="(item,index) in PlatData" :key="index"
                                :label="item.platformName"
                                :value="item.platformCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="国家：">
                         <el-select v-model="form.countryCode" placeholder="请选择国家">
                            <el-option v-for="(item,index) in NationCode" :key="index"
                                :label="item.nation"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-checkbox label="含有Alert" v-model="form.isAlert"></el-checkbox>

                    <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                    <el-button @click="reset" type="primary">重置</el-button>

                </el-form>
                <el-table :data="table" border >
                    <el-table-column prop="storeId" width="150" label="店铺ID"></el-table-column>
                    <el-table-column prop="storeName" label="店铺名">
                        <template slot-scope="scope">
                            <a target="__blank" :href="scope.row.storeLink">{{scope.row.storeName}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="platformCode" label="平台">
                        <template slot-scope="scope">
                            {{fineValName(scope.row.platformCode,PlatData,'platformName','platformCode')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="nationalCode" label="国家">
                        <template slot-scope="scope">
                            {{fineValName(scope.row.nationalCode,NationCode,'nation','code')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="riskSocre" label="店铺风险评分"></el-table-column>
                    <el-table-column prop="alert" label="Alert"></el-table-column>
                    <el-table-column prop="passed" label="Passed"></el-table-column>
                    <el-table-column prop="closed" label="Closed"></el-table-column>
                    <el-table-column prop="escalated" label="Escalated"></el-table-column>
                    <el-table-column label="详情">
                        <template slot-scope="scope">
                            <a href="javascript:;" class="primary" @click="checkStoreReportDetail(scope.row)">查看详情</a>
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
        </div>

        <div class="table-container">
            <h5>店铺风险评级 {{curStoreData.riskSocre}} <span class="el-icon-arrow-up primary" @click="bindChangeSliderStatus('risk')" :class="{active:slider.risk}"></span> </h5>
            <p  class="fr" style="margin-top: -38px;"><el-button @click="claculateStoreRisk" type="primary" >计算风险分数</el-button></p>
            <RiskTable :tableData="riskTable" v-show="slider.risk"></RiskTable>
        </div>

        <Block title="店铺订单监控">
            <ul class="monitoring clearfix">
                <li>当前RF：{{fineValName(paymentId,paymentDay,'riskFactor','id')}}</li>
                <li :class="{other:slider.EditGF}">
                    GF：{{curStoreData.growingFactor}}
                    <span v-if="!slider.EditGF" class="el-icon-edit-outline" @click="bindToEdit"></span>

                    <input type="number" v-else :autofocus="true" v-model="monitoringGF" @blur="bindInputBlur" class="my-input cares-input" placeholder="请输入">

                </li>
                <li class="other">历史监控 
                    <el-select v-model="paymentId" placeholder="选择监控周期">
                        <ElOption v-for="(item,index) in paymentDay" :key="index"
                            :label="item.financialRange"
                            :value="item.id"
                        ></ElOption>
                    </el-select>
                </li>
                <li class="result warning">Alert：{{paymentAlertData? paymentAlertData.alert : 0}}</li>
                <li class="result success">Closed：{{paymentAlertData? paymentAlertData.closed : 0}}</li>
                <li class="result danger">Escalated：{{paymentAlertData ? paymentAlertData.escalated:0}}</li>
                <li class="other button">
                    <el-button @click="createSuspectEvent" type="primary">创建案例</el-button>
                </li>
                <li class="other">
                    <el-button v-if="!downloadPayment.ING" type="primary" @click="changeDownSelect('ccc')">下载订单详情</el-button>
                    <el-button v-else type="primary"><span class="fa fa-spinner fa-spin"></span> 正在生成订单</el-button>
                    <ul class="inner-ul" v-show="downloadPayment.flag">
                        <li @click="()=>{ changeDownSelect(false,1); return toDownloadPayment() }">上个账期</li>
                        <li @click="()=>{ changeDownSelect(false,4); return toDownloadPayment() }">前3个账期</li>
                        <li @click="()=>{ changeDownSelect(false,7); return toDownloadPayment() }">前6个账期</li>
                    </ul>
                </li>
            </ul>
            <el-table :data="monitoringTable" border >
                <ElTableColumn prop="attr" label="监控属性">
                    <template slot-scope="scope">
                        {{orderAttrName[scope.row.attr.toUpperCase()]}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="status" label="Status">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==1"><i class="point warning"></i> Alert</span>
                        <span v-if="scope.row.status==2"><i class="point yes"></i> Passed</span>
                        <span v-if="scope.row.status==3"><i class="point no"></i> Escalate</span>
                        <span v-if="scope.row.status==4"><i class="point yes"></i> Closed</span>
                    </template>
                </ElTableColumn>
                <!-- <ElTableColumn prop="detail" label="详情"></ElTableColumn> -->
                <ElTableColumn label="操作">
                    <template slot-scope="scope">
                        <span :class="{active:scope.row.status==4}" @click="changeOrderStatus(4,scope.row.id)" class="statusButton success" v-if="scope.row.status != 2">Closed</span>
                        <span :class="{active:scope.row.status==3}" @click="changeOrderStatus(3,scope.row.id)" class="statusButton error" v-if="scope.row.status != 2">Escalate</span>
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="remark" label="备注">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注"></el-input>
                    </template>
                </ElTableColumn>
            </el-table>
        </Block>
    </div>
</template>

<script>

import { 
    tmUpdateGf,
    claculateStoreRisk,
    createSuspectMangeByTm,
    tmUpdateStoreInfo,
    queryStoreRiskList,
    queryStoreInfoByTmId,
    queryStoreByStoreId,
    queryStoreStatusNumber,
    queryStorePage,
    existDownOrderInfo,
    downloadFileStatus,
} from '../../../../utils/axios/api.js';

import { NationCode,queryPlatform } from './../../../../ext/localBase.js';

import RiskTable from './riskTable.vue';

export default {
    data(){
        return{
            activeLi:1,

            curStoreData:{},
            form:{
                storeId:'',
                storeName:'',
                platformCode:'',
                countryCode:'',
                customerId:'',

                isAlert:true,         //1

                pageNumber:1,
                pageSize:10,
                totalSize:1,
            },
            table:[],

            riskTable:[],
            reportData:{
                alert:0,
                closed:0,
                escalated:0,
            },
            paymentAlertData:{
                alert:0,
                closed:0,
                escalated:0,
            },

            monitoringTable:[], //店铺监控列表
            paymentId:'',       //店铺订单监控周期ID
            monitoringGF:'',    //订单监控的值可以设置的
            paymentDay:[],      //店铺的账期


            slider:{
                report:true,
                risk:true,

                EditGF:false,
            },

            downloadPayment:{
                flag:false,
                count:'',
                ING:false,
            },

            orderAttrName:{
                ACCOUNTTURNOVER:'账期入账金额',
                ACCOUNTORDER:'账期订单数量',
                MAXORDERSINGLEBUYER:'单个买家最大订单数量',
                MAXAMOUNTSINGLEBUYER:'单个买家最大金额',
                LARGEACCOUNTTURNOVER:'账期大金额',
                SIGNIFICANTCHANGEOFSOLDPRODUCTQUANTITY:'销售产品数量的显著变化',
                HIGHESTPRICEITEM:'最高价格产品',
                SIGNIFICANTCHANGEOFPRICE:'价格显著变动',
                DORMANTACCOUNTREACTIVATION:'休眠帐户恢复',
                REFUNDRATE:'退单率',
                LARGEAMOUNTORDER:'大额定单',
            },

            PlatData:[],
            NationCode:NationCode,

            TIMEID:null
        }
    },
    props:['Data'],
    created(){

        let {storeId,platformCode,shopId,customerNo} = this.Data;

        this.curStoreData = this.Data
        this.form.customerId = customerNo;

        queryPlatform().then(res=>{
            this.PlatData=res;
        });
        //查当前客户的所有店铺列表
        this.LoadingQueryStoreList(this.form);
        //查当前店铺的风险
        this.LoadingQueryRisk(platformCode,shopId)
        //查询几个状态
        this.clcikCheckReport(1);
        //查询店铺账期
        this.QueryStorePaymentDays(storeId);
        
    },
    watch:{
        //账期ID发生变化
        paymentId(id){
            this.QueryStorePaymentDetail(id);

            queryStoreStatusNumber({flag:4,storeId:this.curStoreData.storeId,tmId:id}).then(res=>{
                if(res.code==0){
                    this.paymentAlertData = res.data
                }else{
                    this.$message.error(res.msg);
                }
            });
        }
    },
    methods:{
       
        clcikCheckReport(flag){
            this.activeLi = flag;
            //查询监控简报
            let storeId = flag==2 ? this.curStoreData.storeId : '';
            let customerNo = this.curStoreData.customerNo ;
            queryStoreStatusNumber({flag,storeId,customerNo}).then(res=>{
                if(res.code==0){
                    this.reportData = res.data
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //店铺列表查看订单监控
        checkStoreReportDetail(storeData){
            if(storeData.storeId == this.curStoreData.storeId) return;

            this.curStoreData = storeData;
            //查询当前店铺的风险
            this.LoadingQueryRisk(storeData.platformCode,storeData.shopId);
            //查询当前店铺账期
            this.QueryStorePaymentDays(storeData.storeId);
        },
        //查询客户的所有店铺
        LoadingQueryStoreList(params){
            let formData = Object.assign({},params);
            formData.isAlert = params.isAlert ? '1':'';

            queryStorePage(formData).then(res=>{
                if(res.code==0){
                    this.table = res.data.content;
                    this.form.totalSize = res.data.totalPages;
                }else{
                    this.$message.error(res.msg);
                }
            })
        },

        //查询店铺风险
        LoadingQueryRisk(platform,foreignId){
            queryStoreRiskList({
                platform,
                foreignId
            }).then(res=>{
                if(res.code==0){
                    this.riskTable = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //查询店铺账期
        QueryStorePaymentDays(storeId){
            queryStoreByStoreId({storeId}).then(res=>{
                if(res.code){
                    this.paymentDay = res.data;
                    //选择默认的账期ID
                    this.paymentId = res.data.length ? res.data[0].id : '';
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //获取店铺的账期详情
        QueryStorePaymentDetail(tmId){
            queryStoreInfoByTmId({tmId}).then(res=>{
                if(res.code==0){
                    this.monitoringTable = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        claculateStoreRisk(){
            if(!this.riskTable.length) return  this.$message.warning(`暂无风险评估项`);

            claculateStoreRisk({storeRiskVoList:this.riskTable}).then(res=>{
                if(res.code==0){
                    this.$message.success(`计算成功！`);
                    //如何刷新当前页面的数据
                    return queryStorePage({
                        storeId:this.curStoreData.storeId,
                        pageNumber:1,
                        pageSize:10,
                        totalSize:1,
                    });
                }else{
                    this.$message.error(res.msg);
                }
            }).then(res=>{
                if(!res) return
                if(res.code==0){
                    this.curStoreData = res.data.content[0];
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        bindFormSubmit(){
            this.form.pageNumber = 1;
            this.LoadingQueryStoreList(this.form);
        },
        reset(){
            let n = ['pageNumber','pageSize','totalSize','isAlert'];
            for (const key in this.form) {
                if(!n.includes(key)){
                    this.form[key] = ""
                }
            };
        },
        pageChange(n,per){
            this.form.pageNumber = n;
            this.form.pageSize = per;

            this.LoadingQueryStoreList(this.form);
        },

        //订单监控的操作
        changeOrderStatus(status,id){
            let orderItem = this.monitoringTable.find(item=>{
                return item.id == id;
            });

            //原来的状态与要改变的状态一直
            if(orderItem.status == status) return;

            let remark = orderItem.remark;

            tmUpdateStoreInfo({
                id,
                status,
                remark,
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`修改成功！`);
                    //刷新列表
                    this.QueryStorePaymentDetail(this.paymentId);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        //创建案例  创建可以报告
        createSuspectEvent(){
            let EscalateArr = this.monitoringTable.filter(item=>{
                return item.status==3
            });

            if(!EscalateArr.length) return this.$message.warning('监控记录中没有数据为Escalate！');

            createSuspectMangeByTm({tmId:this.paymentId}).then(res=>{
                if(res.code==0){
                    this.$message.success(`创建成功！`);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },


        bindToEdit(){
            this.slider.EditGF = !this.slider.EditGF;
        },
        bindInputBlur(){

            if(!this.monitoringGF) return this.$message.error(`请输入数值`);
            
            tmUpdateGf({
                id:this.curStoreData.id,
                gf:this.monitoringGF
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`修改成功!`);
                    this.curStoreData.growingFactor = this.monitoringGF;
                    this.bindToEdit();        
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        bindChangeSliderStatus(attr){
            this.slider[attr] = !this.slider[attr];
        },

        changeDownSelect(bol,count){
            typeof bol == 'boolean' ? 
            (this.downloadPayment.flag = bol):(
                this.downloadPayment.flag = !this.downloadPayment.flag
            )
            
            this.downloadPayment.count = count ? count : '';
        },

        //下载账期
        toDownloadPayment(){
            if(this.downloadPayment.ING) return;
            this.downloadPayment.ING = true;
            let params = {
                id :this.paymentId,
                count:this.downloadPayment.count,
            };
            existDownOrderInfo(params).then(res=>{
                if(res.code==0){

                    let count = 0;

                   this.TIMEID = setInterval(()=>{
                        count++;
                        if(count>50) return clearInterval(this.TIMEID);

                        downloadFileStatus({
                            uuid:res.data
                        }).then(iRes=>{
                            if(String(iRes)=='true'){ 
                                this.downloadPayment.ING = false;
                                clearInterval(this.TIMEID);
                                window.open(`${location.origin}/tmStore/downOrderInfo?uuid=${res.data}`);
                            };
                        });

                    },2000);
                }else{
                    this.downloadPayment.ING = false;
                    this.$message.error(res.msg);
                }
            });
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
        RiskTable
    },
    destroyed(){
        clearInterval(this.TIMEID);
    }
}
</script>


<style lang="scss" scoped>
@import './../../../../css/element-variables.scss';
    .monitoring{
        margin-bottom: 20px;
        >li{
            float: left;
            vertical-align: middle;
            padding: 5px 20px;
            padding-left: 0;
            position: relative;
            span{
                cursor: pointer;
            }

            &.can-select{
                border: 1px solid #d8d8d8;
                margin-left: -1px;
                cursor: pointer;
                padding: 5px 20px;
                position: relative;
                &.active{
                    border-color: $--color-primary;
                    z-index: 2;
                }

                 &.first{
                border-radius: 4px 0 0 4px;
                }
                &.last{
                    border-radius: 0 4px 4px 0;
                }
            }

            &.other{
                padding-top: 0px;
            }
            &.button{
                margin-left: 40px;
            }
            // 结果
            &.result{
                color: #fff;
                margin-left: 10px;
                margin-top: 3px;
                padding: 2px 10px;
                border-radius: 4px;
                &.warning{
                    background-color: $--color-warning;
                }
                &.success{
                     background-color: $--color-success;
                }
                &.danger{
                    background-color: $--color-danger;
                }
            }
        }
    }

    .inner-ul{
        position: absolute;
        background: #fff;
        width: 100%;
        z-index: 2;
        top: 100%;
        border-left: 1px solid #f5f5f5;
        border-right: 1px solid #f5f5f5;
        >li{
            line-height: 30px;
            padding: 0 10px;
            height: 30px;
            border-bottom: 1px solid #f5f5f5;
            cursor: pointer;
        }
    }

    .el-table{
        margin: 0;
    }

    .my-input{
        width: 150px;
    }

    h5{
        color: #666;
        font-size: 14px;
        font-weight: normal;
        margin-bottom: 10px;
        span{
            margin-left: 20px;
            font-size:  18px;
            cursor: pointer;
            transition: all .5s;
            &.active{
                transform: rotate(180deg);
            }
        }
    }

    span.arrow{
        font-size:  18px;
        cursor: pointer;
        transition: all .5s;
        &.active{
            transform: rotate(180deg);
        }
    }

    .statusButton{
        display: inline-block;
        padding:0 10px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #e5e5e5;
        border-radius: 15px;
        cursor: pointer;
        &.success{
            &:hover{
                color: $--color-success;
            }

            &.active{
                color: #fff;
                background-color: $--color-success;
                border: none;
            }
        }

        &.error{
            &:hover{
                color: $--color-danger;
            }
             &.active{
                color: #fff;
                background-color:  $--color-danger;
                border: none;
            }
        }
    }

    .pagination{
        margin-top: 20px;
    }
</style>

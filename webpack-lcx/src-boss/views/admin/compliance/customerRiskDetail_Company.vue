<template>
    <div class="fadeIn">
        <Block title="客户信息（Enterprise）">
            <el-button type="primary" class="check-button" @click="bindToStoreRisk">查看店铺监控</el-button>
            <h5>#企业信息  </h5>
            <el-table :data="companeyInfo" border >
                <el-table-column prop="customerNo" label="客户ID"></el-table-column>
                <el-table-column prop="enterpriseName" label="企业名称"></el-table-column>
                <el-table-column prop="createTime" label="成立日期">
                    <template slot-scope="scope">
                        {{formatDate(scope.row.createTime,true)}}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="所在地">
                    <template slot-scope="scope">
                        {{nationObj[scope.row.address]}}
                    </template>
                </el-table-column>
                <el-table-column prop="pep" label="PEP">
                    <template slot-scope="scope">
                        <span v-if="scope.row.pep==2">否</span>
                        <span v-if="scope.row.pep==1">是</span>
                    </template>
                </el-table-column>
                <el-table-column prop="badNews" label="负面新闻">
                     <template slot-scope="scope">
                        <span v-if="scope.row.badNews==2">否</span>
                        <span v-if="scope.row.badNews==1">是</span>
                    </template>
                </el-table-column>
                <el-table-column prop="relTime" label="关系建立日期">
                    <template slot-scope="scope">
                        {{formatDate(scope.row.relTime)}}
                    </template>
                </el-table-column>
            </el-table>

            <h5>#法定代表人信息</h5>
            <el-table :data="legalPersonInfo" border >
                <el-table-column prop="customerName" label="姓名"></el-table-column>
                <el-table-column prop="birthday" label="年龄">
                    <template slot-scope="scope">
                        {{formatDate(scope.row.birthday) | Birth}}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="居住地"></el-table-column>
                <el-table-column prop="pep" label="PEP">
                    <template slot-scope="scope">
                        <span v-if="scope.row.pep==2">否</span>
                        <span v-if="scope.row.pep==1">是</span>
                    </template>
                </el-table-column>
                <el-table-column prop="badNews" label="负面新闻">
                     <template slot-scope="scope">
                        <span v-if="scope.row.badNews==2">否</span>
                        <span v-if="scope.row.badNews==1">是</span>
                    </template>
                </el-table-column>
                <el-table-column prop="relTime" label="关系建立日期">
                     <template slot-scope="scope">
                        {{formatDate(scope.row.relTime)}}
                    </template>
                </el-table-column>
            </el-table>

            <h5>#受益人 <span @click="bindChangeSliderStatus('beneficiay')" class="el-icon-arrow-up primary" :class="{active:slider.beneficiay}"></span> </h5>
            <el-table v-show="slider.beneficiay" :data="shareholderVoList" border >
                <el-table-column width="50" type="index" label="#"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="birthday" label="年龄">
                    <template slot-scope="scope">
                        {{formatDate(scope.row.birthday) | Birth}}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="居住地"></el-table-column>
                <el-table-column prop="pep" label="PEP">
                    <template slot-scope="scope">
                        <span v-if="scope.row.pep==2">否</span>
                        <span v-if="scope.row.pep==1">是</span>
                    </template>
                </el-table-column>
                <el-table-column prop="badNews" label="负面新闻">
                     <template slot-scope="scope">
                        <span v-if="scope.row.badNews==2">否</span>
                        <span v-if="scope.row.badNews==1">是</span>
                    </template>
                </el-table-column>
                <el-table-column prop="registerTime" label="关系建立日期">
                     <template slot-scope="scope">
                        {{formatDate(scope.row.registerTime)}}
                    </template>
                </el-table-column>
            </el-table>
             
        </Block>
        
        <Block title="风险评级" class="clearfix">
            <h5 class="sub-tit">客户风险评级: {{companeyInfo.length && companeyInfo[0].score}} 
                <el-button type="primary" style="margin-top:-15px;float:right" @click="toCalcularRisk">计算风险分数</el-button> <span @click="bindChangeSliderStatus('risk')" class="el-icon-arrow-up primary" :class="{active:slider.risk}"></span> 
            </h5>

            <div class="block" v-show="slider.risk">
                <h5>#企业风险评级</h5>

                <RiskTable :tableData="enterpriseTable"></RiskTable>
            </div>

            <div class="block" v-show="slider.risk">
                <h5>#受益人风险评级</h5>
                <template v-for="(item,index) in shareholderVoList">
                    <div :key="index">
                        <p class="shareTitle"><span>{{item.name}}</span>{{item.share && `${item.share}%`}}</p>
                        <RiskTable :tableData="item.riskList" @transition="()=>{ return loadingQuery(customerNo);}"></RiskTable>
                    </div>
                </template>
            </div>
        </Block>
        
    </div>
</template>

<script>
import {
    queryCustomerRishDetail,
    calculateEnterpriseRisk
} from '../../../utils/axios/api.js';
import { formatTimer } from '../../../utils/common.js';

import RiskTable from './components/riskTable.vue';

export default {
    data(){
        return {
            customerNo:'',
            companeyInfo:[],
            legalPersonInfo:[],
            shareholderVoList:[],

            slider:{
                beneficiay:true,
                risk:true,
            },

            ING:false,
            nationObj:{
                CHN:"中国大陆",
                HKG:"中国香港"
            },
        }
    },
    created(){
        let OBJ = this.$route.params;
        let m = this.$store.state.Memory.customerRiskCompany;

        if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"customerRisk"});
        
        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
            this.loadingQuery(OBJ.customerNo);
            this.customerNo = OBJ.customerNo;
        };

    },
    computed:{
        enterpriseTable(){
            if(this.companeyInfo.length){
                return this.companeyInfo[0].riskList
            }else{
                return [];
            }
        }
    },
    methods:{
        loadingQuery(customerNo){
            queryCustomerRishDetail({customerNo}).then(res=>{
                if(res.code==0){
                    //受益人
                    this.shareholderVoList = res.data.shareholderVoList;
                    //法人或个人信息
                    res.data.individualVo && (this.legalPersonInfo = [res.data.individualVo]);
                    //公司信息
                    res.data.enterpriseVo && (this.companeyInfo = [res.data.enterpriseVo]);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindToStoreRisk(){
            this.$router.push({
                name:'storeRisk',
                params:{
                   customerNo: this.customerNo,
                   reflesh: true
                }
            })
        },
        bindChangeSliderStatus(attr){
            this.slider[attr] = !this.slider[attr];
        },
        //计算风险评级
        toCalcularRisk(){
            if(!this.companeyInfo.length) return;
            if(!this.companeyInfo[0].riskList.length) return this.$message.warning('暂无风险评估项');

            if(this.ING) return;
            this.ING = true;
            let shareholderRiskVoList = [];
            this.shareholderVoList.forEach(item=>{
                shareholderRiskVoList = shareholderRiskVoList.concat(item.riskList);
            });
            //请求借口计算
            calculateEnterpriseRisk({
                enterpriseRiskVoList:this.companeyInfo[0].riskList,
                // individualRiskVoList:'',
                shareholderRiskVoList
            }).then(res=>{
                this.ING = false;
                if(res.code==0){
                    this.$message.success(`计算成功`)
                    this.loadingQuery(this.customerNo);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        formatDate(value,bol){
            return formatTimer(value,bol) || 'N/A';
        }
    },
    components:{
        RiskTable
    },
    filters:{
        Birth(value){
            let birthday = new Date(value).getTime();
            let AntNow = new Date().getTime();
            return Math.floor( (AntNow-birthday)/(365*24*60*60*1000) );
        }
    }
    ,destroyed(){
        let tabArr = this.$store.state.TabList;
        tabArr.forEach(item=>{
            if(item.name=='customerRiskCompany'){
                return  this.$store.commit('setModelRecordData',{
                     key:'customerRiskCompany',
                     data:this._data
                 });
            }
        });
    }
}
</script>

<style lang="scss" scoped>
h5{
    color: #666;
    font-size: 14px;
    // margin-bottom: -16px;
    font-weight: normal;
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

.el-table{
    margin-top: 10px;
}

.sub-tit{
    margin-bottom: 0px;
    color: #333;
    margin-bottom: 10px;
}

.block{
    width: 50%;
    float: left;
    padding-right: 10px;
}

.check-button{
    position: absolute;
    right: 20px;
    top: 10px;
}

.shareTitle{
    background-color: #f8f8f8;
    margin-top: 10px;
    margin-bottom: -10px;
    padding-left: 20px;
    color: #999;
    height: 30px;
    line-height: 30px;
    span{
        margin-right: 10px;
    }
}
</style>

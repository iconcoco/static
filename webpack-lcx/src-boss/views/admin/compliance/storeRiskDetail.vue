<template>
    <div class="fadeIn">
        <Block title="客户信息（Enterprise）" v-if="customerType==1">
            <span class="el-icon-arrow-up primary arrow"  @click="bindChangeSliderStatus('customerInfo')" :class="{active:slider.customerInfo}"></span>
            <el-button type="primary" class="check-button" @click="bindToStoreRisk('customerRiskCompany')">查看客户监控</el-button>
            <div v-show="slider.customerInfo">
                <h5>#企业信息</h5>
                <el-table :data="companeyInfo" border >
                    <el-table-column prop="customerNo" label="客户ID"></el-table-column>
                    <el-table-column prop="enterpriseName" label="企业名称"></el-table-column>
                    <el-table-column prop="createTime" label="成立日期">
                        <template slot-scope="scope">
                            {{formatDate(scope.row.createTime)}}
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
                            {{formatDate(scope.row.birthday)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="居住地"></el-table-column>
                    <el-table-column prop="pep" label="PEP"></el-table-column>
                    <el-table-column prop="badNews" label="负面新闻"></el-table-column>
                    <el-table-column prop="relTime" label="关系建立日期">
                        <template slot-scope="scope">
                            {{formatDate(scope.row.relTime)}}
                        </template>
                    </el-table-column>
                </el-table>

                <h5>#受益人 <span class="el-icon-arrow-up primary" @click="bindChangeSliderStatus('beneficiary')" :class="{active:slider.beneficiary}"></span></h5>
                <el-table :data="beneficiaryInfo" border v-show="slider.beneficiary">
                    <el-table-column width="50" type="index" label="#"></el-table-column>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="birthday" label="年龄">
                        <template slot-scope="scope">
                            {{formatDate(scope.row.birthday)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="居住地"></el-table-column>
                    <el-table-column prop="pep" label="PEP"></el-table-column>
                    <el-table-column prop="badNews" label="负面新闻"></el-table-column>
                    <el-table-column prop="registerTime" label="关系建立日期">
                        <template slot-scope="scope">
                            {{formatDate(scope.row.relTime)}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </Block>

        <Block title="客户信息（Individual）" v-if="customerType == 0">
            <el-button type="primary" class="check-button" @click="bindToStoreRisk('customerRiskPersonal')">查看客户监控</el-button>
            <h5>#客户信息 <span class="el-icon-arrow-up primary" @click="bindChangeSliderStatus('personInfo')" :class="{active:slider.personInfo}"></span> </h5>
            <el-table :data="customerInfo" border v-show="slider.personInfo">
                <el-table-column prop="customerNo" label="客户ID"></el-table-column>
                <el-table-column prop="customerName" label="客户名称"></el-table-column>
                <el-table-column prop="birthday" label="年龄">
                    <template slot-scope="scope">
                        {{formatDate(scope.row.birthday)}}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="居住地">
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
        </Block>

        <!-- 店铺风险组建 -->
        <storeRiskCommon
            :Data="componentParams"
        ></storeRiskCommon>
    </div>
</template>

<script>
import storeRiskCommon from './components/storeRiskCommon.vue';
import { formatTimer } from '../../../utils/common.js';

import {
    queryCustomerRishDetail
} from '../../../utils/axios/api.js';

export default {
    data(){
        return {
           companeyInfo:[], 
           legalPersonInfo:[], 
           beneficiaryInfo:[], 

           customerInfo:[],

           slider:{
               customerInfo:false,
               beneficiary:false,
               personInfo:false,
           },
            nationObj:{
                CHN:"中国大陆",
                HKG:"中国香港"
            },

           customerType:1,

            componentParams:{
                platformCode:'',
                shopId:'',
            }
        }
    },
    created(){

        let OBJ = this.$route.params;
        let m = this.$store.state.Memory.storeRiskDetail;

        if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"storeRisk"});
        
        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
             this.loadingQuery(OBJ.customerNo);
            this.componentParams = OBJ;
        };
       
    },
    methods:{
        loadingQuery(customerNo){
            queryCustomerRishDetail({customerNo}).then(res=>{
                if(res.code==0){
                    if(res.data.enterpriseVo){
                        this.customerType = 1;

                        this.companeyInfo = [res.data.enterpriseVo];    //企业
                        this.legalPersonInfo = [res.data.individualVo]; //法人
                        this.beneficiaryInfo = res.data.shareholderVoList; //受益人

                    }else{
                        this.customerType = 0;

                        this.customerInfo = [res.data.individualVo];     //个人信息
                    }
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindToStoreRisk(name){
            this.$router.push({name,params:{
                customerNo:this.componentParams.customerNo
            }})
        },
        bindChangeSliderStatus(attr){
            this.slider[attr] = !this.slider[attr];
        },

        formatDate(value){
            return formatTimer(value) || 'N/A';
        }
    },
    components:{
        storeRiskCommon
    },
    destroyed(){
        let tabArr = this.$store.state.TabList;
        tabArr.forEach(item=>{
            if(item.name=='storeRiskDetail'){
                return  this.$store.commit('setModelRecordData',{
                     key:'storeRiskDetail',
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

span.arrow{
    position: absolute;
    margin-left: 20px;
    font-size:  18px;
    cursor: pointer;
    transition: all .5s;
    left: 200px;
    top: 20px;
    &.active{
        transform: rotate(180deg);
    }
}

.el-table{
    margin-top: 10px;
}

.check-button{
    position: absolute;
    right: 20px;
    top: 10px;
}
</style>
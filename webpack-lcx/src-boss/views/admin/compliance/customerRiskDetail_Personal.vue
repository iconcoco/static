<template>
    <div class="fadeIn">
        <Block title="客户信息（Individual）">
            <el-button type="primary" class="check-button" @click="bindToStoreRisk">查看店铺监控</el-button>
            <h5># 客户信息 <span class="el-icon-arrow-up primary" @click="bindChangeSliderStatus('info')" :class="{active:slider.info}"></span></h5>
            <el-table v-show="slider.info" :data="companeyInfo" border >
                <el-table-column prop="customerNo" label="客户ID"></el-table-column>
                <el-table-column prop="customerName" label="客户名称"></el-table-column>
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
        </Block>

        <Block title="客户风险评级">
            <h5>客户风险评级: {{companeyInfo.length && companeyInfo[0].score}} 
                <el-button @click="toCalcularRisk" style="margin-top:-15px;float:right"  type="primary">计算风险分数</el-button> 
                <span class="el-icon-arrow-up primary" @click="bindChangeSliderStatus('risk')" :class="{active:slider.risk}"></span>
            </h5>
            <RiskTable v-show="slider.risk" :tableData="enterpriseTable"></RiskTable>
        </Block>
        
    </div>
</template>

<script>

import {
    queryCustomerRishDetail,
    calculateIndividualRisk
} from '../../../utils/axios/api.js';
import { formatTimer } from '../../../utils/common.js';

import RiskTable from './components/riskTable.vue';

export default {
    data(){
        return {
            customerNo:'',
            companeyInfo:[],

            slider:{
                info:true,
                risk:true,
            },
            ING:false,
        }
    },
    created(){
         let OBJ = this.$route.params;
        let m = this.$store.state.Memory.customerRiskPersonal;

        if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"customerRisk"});
        
        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
            this.loadingQuery(OBJ.customerNo);
            this.customerNo = OBJ.customerNo
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
                    //公司信息
                    res.data.individualVo && (this.companeyInfo = [res.data.individualVo]);
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

        toCalcularRisk(){
           
            if(!this.companeyInfo.length) return;
            if(!this.companeyInfo[0].riskList.length) return this.$message.warning('暂无风险评估项');

             if(this.ING) return;
            this.ING = true;
            //请求借口计算
            calculateIndividualRisk({
                individualRiskVoList:this.companeyInfo[0].riskList,
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

        formatDate(value){
            return formatTimer(value) || 'N/A';
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
            if(item.name=='customerRiskPersonal'){
                return  this.$store.commit('setModelRecordData',{
                     key:'customerRiskPersonal',
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
    margin-top: 5px;
}

.check-button{
    position: absolute;
    right: 20px;
    top: 10px;
}
</style>

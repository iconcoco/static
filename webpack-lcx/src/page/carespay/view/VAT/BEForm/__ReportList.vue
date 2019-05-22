<template>
    <div class="fadeIn reportListContainer" v-show="ING">
         <h2 class="banner-module-title">VAT报税列表</h2>
         <template v-if="oppenCountry.length">
            <p class="nation-tab">
                <span v-for="(item,index) in oppenCountry" :key="index" 
                    :class="{active:form.countryCode==item}"
                    @click="()=>{ form.countryCode = item }"
                >
                    {{fineValName(item,AllNationCode,'nation','code') }}
                </span>
            </p>
            <el-form :model="form" class="vatApplyList" :inline="true">

                <p class="nation-tab form-select-type">
                    <!-- <span>全部 <i>{{}}</i></span> -->
                    <span v-for="(item,index) in statusArr" :key="index"
                        v-if="item.customerStatus"
                        @click="searceStatusCount(item.customerStatus.toString(),item.count)"
                        :class="{active:form.queryStatus==item.customerStatus.toString()}"
                    >{{item.name}} <i>{{item.count || 0}}</i></span>
                </p>

                <el-form-item label="申请截止日查询时间：" class="dataPicker">
                    <el-date-picker
                        type="datetimerange"
                        v-model="FormTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        >
                    </el-date-picker>
                </el-form-item>

                <a class="cares-button-primary" href="javascript:;" @click="toSubmit">查询</a>
                <a class="cares-button-primary pain" href="javascript:;" @click="reset">重置</a>
            </el-form>

            <CTable>
                <table>
                    <thead>
                        <tr>
                            <th>公司名</th>
                            <th>申报国家</th>
                            <th>增值税/商品和服务税登记号</th>
                            <th>税号生效时间</th>
                            <th>申报截止时间</th>
                            <th>申报状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!table.length" class="empty">
                            <td colspan="7">暂无数据</td>
                        </tr>
                        <tr v-for="(item,index) in table" :key="index">
                            <td>{{item.companyName}}</td>
                            <!-- 申报国家 -->
                            <td>{{fineValName(item.countryCode,AllNationCode,'nation','code')}}</td>
                            <td>{{item.dutyServiceNumber}}</td>
                            <!-- 税号生效时间 -->
                            <td>{{formatTimer(item.dutyEffectTime)}}</td>
                            <td>{{formatTimer(item.deadlineTime)}}</td>
                            <td>
                                <span v-if="[0,1,2].includes(item.status)" class="ING">{{fineValName(item.status,statusArr,'name','status')}}</span>
                                <span v-if="
                                    [3,5,6,7,8,10].includes(item.status) ||
                                    ['GB','DE','PL','CZ'].includes(item.countryCode) &&  [9].includes(item.status) ||
                                    ['FR','IT','ES'].includes(item.countryCode) &&  [13,16].includes(item.status)
                                " class="ing">{{fineValName(item.status,statusArr,'name','status')}}</span>
                                <span v-if="[11].includes(item.status)" class="yes">{{fineValName(item.status,statusArr,'name','status')}}</span>
                                <span v-if="
                                    ['FR','IT','ES'].includes(item.countryCode) &&  [4,14,9,15,12].includes(item.status)||
                                    ['GB','DE','PL','CZ'].includes(item.countryCode) &&  [4,13,12].includes(item.status)
                                " class="no">{{fineValName(item.status,statusArr,'name','status')}}</span>
                            </td>
                            <td>
                                <a href="javascript:;" class="cares-color" @click="jumpToDetails(item.id)">查看详情</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CTable>

            <Pagination
                    :page='form.pageNum  '
                    :pageSize='form.pageSize'
                    :count='form.count'
                    :countSize='form.countSize'
                    :chosefallback='bindChosePage'
            ></Pagination>
        </template>

        <div v-else class="null">
            <img src="./../../../../../images/carepay/vat/null.png" alt="空">
            <p>暂无VAT申报记录</p>
            <br/>
            <router-link to="/vat/apply" class="cares-button-primary">先去申请VAT税号</router-link>
        </div>
    </div>
</template>

<script>
import CTable from './../../../../../components/CTable.vue';
import {AllNationCode} from './../../../utils/localbase.js';
import { 
    findDeclarationModelList 
    ,vatFindStatusCount
    ,declarationFindCountryCode
} from './../../../../../js/api.js';

import { formatTimer } from './../../../../../js/common.js';

import { STATUS_PART1,STATUS_PART2 } from './var.js';

export default {
    data(){
        return {
            form:{
                countryCode:'',
                applyStartTime:'',
                applyEndTime:'',
                queryStatus:'',

                pageNum:1,
                pageSize:10,
                count:1,
                countSize:1,
            },
            FormTime:null,
            table:[],

            oppenCountry:[],

            AllNationCode:AllNationCode,
            statusArr:[],

            ING:false
        }
    },
    components:{
        CTable
    },
    created(){
        declarationFindCountryCode().then(res=>{
            this.ING = true;
            if(res.code==0){
                this.form.countryCode = res.data[0];
                this.oppenCountry = res.data;
            }else{
                this.$Message.error(res.msg);
            }
        });
        
    },
    methods:{
        loadingQueryList(){
            this.form.applyStartTime = this.FormTime ? this.FormTime[0]: '';
            this.form.applyEndTime = this.FormTime ? this.FormTime[1]: '';

            findDeclarationModelList(this.form).then(res=>{
                if(res.code==0){
                    this.table = res.data.list;
                    this.form.count = res.data.total;
                    this.form.countSize = res.data.totalSize;
                }else{
                    this.$Message.error(res.msg);
                }
            });

            //状态统计
            vatFindStatusCount({countryCode:this.form.countryCode}).then(res=>{
                if(res.code==0){
                    
                    let counts=res.data;
                    
                    for (let index = 0; index < this.statusArr.length; index++) {
                        const Item = this.statusArr[index];
                        if(!Item.customerStatus) continue;
                        Item['count'] = 0;
                        for (const key in counts) {
                            if(Item.customerStatus.indexOf(Number(key))>-1){
                                Item['count'] += counts[key];
                            }
                        };
                    };


                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        jumpToDetails(id){
            this.$emit('jumpPage',{
                toPage:'ReportDetails',
                data:id
            });
        },
        searceStatusCount(status,count){
            if(count==0) return;

            this.form.queryStatus = status;
            this.toSubmit();
        },
        toSubmit(){
            this.form.pageNum = 1;
            this.loadingQueryList();
        },
        reset(){
            this.FormTime = null;
            let noChange = ['countryCode','pageNum','pageSize','count','countSize'];
            for (const key in this.form) {
                if(!noChange.includes(key)){
                    this.form[key] = "";
                }
            };
        },
        bindChosePage(size,per){
            this.form.pageNum = size;
            this.form.pageSize = per;
            this.loadingQueryList();
        },
         formatTimer(code){
            return formatTimer(code);
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
    watch:{
        'form.countryCode'(code){
            this.form.queryStatus = '';
            ['FR','IT','ES'].includes(code) ? (
                this.statusArr = STATUS_PART2
            ):(
                this.statusArr = STATUS_PART1
            );
            //请求数据
            this.toSubmit();
        }
    }
}
</script>


<style lang="scss" scoped>
@import './../../../../../css/common/theme.scss';
.reportListContainer{
    padding-bottom: 20px;
}
.nation-tab{
    padding: 20px 0;
    border-bottom: 1px solid #f1f1f1;

    &.form-select-type{
        padding: 0;
        margin-bottom: 10px;
        border-bottom: none;
        span{
            margin-bottom: 10px;
        }
    }
    span{
        display: inline-block;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        padding: 0 15px;
        border-radius: 16px;
        margin-right: 10px;
        border: 1px solid #EBEBEB;
        cursor: pointer;
        transition: all .2s;
        i{
            margin-left: 5px;
        }
         &.active{
            border-color: $--color-primary-two;
            color: $--color-primary-two;
        }

         &:hover{
             color: $--color-primary-two;
         }
    }
}

form{
    padding-top: 20px;
    .cares-button-primary{
        min-width: 80px;
        margin-right: 10px;
    }
}

table{
    margin-bottom: 20px;
}

.banner-module-title{
    font-weight: bold;
}

</style>
